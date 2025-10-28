import { getCurrentUserId } from '@/lib/auth/get-current-user'
import { stripe } from '@/lib/stripe'
import { supabaseAdmin } from '@/lib/supabase/supabaseAdmin'
import { NextRequest, NextResponse } from 'next/server'

/**
 * Sync payment history from Stripe to Supabase
 * This endpoint can be used to manually sync missing payments
 * or reconcile data inconsistencies
 */
export async function POST(req: NextRequest) {
  try {
    const userId = await getCurrentUserId()

    if (!userId) {
      return NextResponse.json(
        { error: 'User not authenticated' },
        { status: 401 }
      )
    }

    const { limit = 100, starting_after } = await req.json()

    // Get user's email to find Stripe customer
    const { data: userProfile } = await supabaseAdmin
      .from('user_profiles')
      .select('email')
      .eq('id', userId)
      .single()

    if (!userProfile?.email) {
      return NextResponse.json(
        { error: 'User email not found' },
        { status: 404 }
      )
    }

    // Find Stripe customer by email
    const customers = await stripe.customers.list({
      email: userProfile.email,
      limit: 1
    })

    if (customers.data.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'No Stripe customer found for this user',
        syncedCount: 0
      })
    }

    const customer = customers.data[0]

    // Get payment intents for this customer
    const paymentIntents = await stripe.paymentIntents.list({
      customer: customer.id,
      limit: limit,
      starting_after: starting_after
    })

    let syncedCount = 0
    const errors: string[] = []

    // Process each payment intent
    for (const paymentIntent of paymentIntents.data) {
      try {
        // Check if this payment already exists in our database
        const { data: existingPayment } = await supabaseAdmin
          .from('payment_transactions')
          .select('id')
          .eq('stripe_payment_intent_id', paymentIntent.id)
          .single()

        if (existingPayment) {
          continue // Skip if already exists
        }

        // Get checkout session if available
        let checkoutSession = null
        if (paymentIntent.metadata?.checkout_session_id) {
          try {
            checkoutSession = await stripe.checkout.sessions.retrieve(
              paymentIntent.metadata.checkout_session_id
            )
          } catch (e) {
            console.log('Could not retrieve checkout session:', e)
          }
        }

        // Determine product information
        let productName = 'Unknown Product'
        let productDescription = null
        let paymentType = 'payment'

        if (checkoutSession) {
          const lineItems = await stripe.checkout.sessions.listLineItems(
            checkoutSession.id
          )
          if (lineItems.data.length > 0) {
            productName = lineItems.data[0].description || 'Unknown Product'
            productDescription = lineItems.data[0].description
          }
          paymentType =
            checkoutSession.mode === 'subscription' ? 'subscription' : 'payment'
        }

        // Create transaction record
        const transactionData = {
          id: paymentIntent.id,
          user_id: userId,
          stripe_session_id: checkoutSession?.id || null,
          stripe_payment_intent_id: paymentIntent.id,
          amount_cents: paymentIntent.amount,
          currency: paymentIntent.currency,
          status:
            paymentIntent.status === 'succeeded' ? 'succeeded' : 'pending',
          payment_type: paymentType,
          product_name: productName,
          product_description: productDescription,
          created_at: new Date(paymentIntent.created * 1000).toISOString(),
          updated_at: new Date().toISOString()
        }

        const { error } = await supabaseAdmin
          .from('payment_transactions')
          .upsert(transactionData, {
            onConflict: 'id'
          })

        if (error) {
          errors.push(
            `Failed to sync payment ${paymentIntent.id}: ${error.message}`
          )
        } else {
          syncedCount++
        }
      } catch (error) {
        errors.push(`Error processing payment ${paymentIntent.id}: ${error}`)
      }
    }

    return NextResponse.json({
      success: true,
      syncedCount,
      totalProcessed: paymentIntents.data.length,
      errors: errors.length > 0 ? errors : undefined,
      message: `Successfully synced ${syncedCount} payments from Stripe`
    })
  } catch (error) {
    console.error('Error in Stripe sync API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
