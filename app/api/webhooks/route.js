import { headers } from 'next/headers'
import { NextResponse } from 'next/server'

import { stripe } from '../../../lib/stripe'
import { supabaseAdmin } from '../../../lib/supabase/supabaseAdmin'

// Helper function to store payment transaction with retry logic
async function storePaymentTransaction(sessionData, retryCount = 0) {
  const maxRetries = 3

  try {
    // Extract user ID from metadata or customer email
    const userId = sessionData.metadata?.user_id || sessionData.customer_email

    if (!userId) {
      console.log('No user ID found in session metadata')
      return { success: false, error: 'No user ID found' }
    }

    // Validate required fields
    if (!sessionData.id || !sessionData.amount_total) {
      console.error('Missing required session data:', {
        id: sessionData.id,
        amount_total: sessionData.amount_total
      })
      return { success: false, error: 'Missing required session data' }
    }

    // Get line items to determine product details
    let lineItems
    try {
      lineItems = await stripe.checkout.sessions.listLineItems(sessionData.id)
    } catch (error) {
      console.error('Error fetching line items:', error)
      // Continue with default values if line items can't be fetched
      lineItems = { data: [] }
    }

    const productName = lineItems.data[0]?.description || 'Unknown Product'

    // Determine payment type
    const paymentType =
      sessionData.mode === 'subscription' ? 'subscription' : 'payment'

    // Calculate amount in cents
    const amountCents = sessionData.amount_total || 0

    const transactionData = {
      id: sessionData.id,
      user_id: userId,
      stripe_session_id: sessionData.id,
      stripe_payment_intent_id: sessionData.payment_intent,
      amount_cents: amountCents,
      currency: sessionData.currency || 'usd',
      status: sessionData.payment_status === 'paid' ? 'succeeded' : 'pending',
      payment_type: paymentType,
      product_name: productName,
      product_description: lineItems.data[0]?.description || null,
      created_at: new Date(sessionData.created * 1000).toISOString(),
      updated_at: new Date().toISOString()
    }

    const { error } = await supabaseAdmin
      .from('payment_transactions')
      .upsert(transactionData, {
        onConflict: 'id'
      })

    if (error) {
      console.error('Error storing payment transaction:', error)

      // Retry logic for database errors
      if (retryCount < maxRetries && error.code === 'PGRST301') {
        console.log(
          `Retrying payment transaction storage (attempt ${retryCount + 1}/${maxRetries})`
        )
        await new Promise(resolve =>
          setTimeout(resolve, 1000 * (retryCount + 1))
        ) // Exponential backoff
        return await storePaymentTransaction(sessionData, retryCount + 1)
      }

      return { success: false, error: error.message }
    } else {
      console.log('Payment transaction stored successfully:', sessionData.id)
      return { success: true }
    }
  } catch (error) {
    console.error('Exception storing payment transaction:', error)

    // Retry logic for network/other errors
    if (retryCount < maxRetries) {
      console.log(
        `Retrying payment transaction storage (attempt ${retryCount + 1}/${maxRetries})`
      )
      await new Promise(resolve => setTimeout(resolve, 1000 * (retryCount + 1))) // Exponential backoff
      return await storePaymentTransaction(sessionData, retryCount + 1)
    }

    return { success: false, error: error.message }
  }
}

// Helper function to update payment transaction status with retry logic
async function updatePaymentTransactionStatus(
  paymentIntentId,
  status,
  retryCount = 0
) {
  const maxRetries = 3

  try {
    if (!paymentIntentId || !status) {
      console.error('Missing required parameters for status update:', {
        paymentIntentId,
        status
      })
      return { success: false, error: 'Missing required parameters' }
    }

    const { error } = await supabaseAdmin
      .from('payment_transactions')
      .update({
        status: status,
        updated_at: new Date().toISOString()
      })
      .eq('stripe_payment_intent_id', paymentIntentId)

    if (error) {
      console.error('Error updating payment transaction status:', error)

      // Retry logic for database errors
      if (retryCount < maxRetries && error.code === 'PGRST301') {
        console.log(
          `Retrying payment transaction status update (attempt ${retryCount + 1}/${maxRetries})`
        )
        await new Promise(resolve =>
          setTimeout(resolve, 1000 * (retryCount + 1))
        ) // Exponential backoff
        return await updatePaymentTransactionStatus(
          paymentIntentId,
          status,
          retryCount + 1
        )
      }

      return { success: false, error: error.message }
    } else {
      console.log(
        'Payment transaction status updated successfully:',
        paymentIntentId
      )
      return { success: true }
    }
  } catch (error) {
    console.error('Exception updating payment transaction status:', error)

    // Retry logic for network/other errors
    if (retryCount < maxRetries) {
      console.log(
        `Retrying payment transaction status update (attempt ${retryCount + 1}/${maxRetries})`
      )
      await new Promise(resolve => setTimeout(resolve, 1000 * (retryCount + 1))) // Exponential backoff
      return await updatePaymentTransactionStatus(
        paymentIntentId,
        status,
        retryCount + 1
      )
    }

    return { success: false, error: error.message }
  }
}

export async function POST(req) {
  let event

  try {
    event = stripe.webhooks.constructEvent(
      await req.text(),
      (await headers()).get('stripe-signature'),
      process.env.STRIPE_WEBHOOK_SECRET
    )
  } catch (err) {
    const errorMessage = err.message
    // On error, log and return the error message.
    if (err) console.log(err)
    console.log(`Error message: ${errorMessage}`)
    return NextResponse.json(
      { message: `Webhook Error: ${errorMessage}` },
      { status: 400 }
    )
  }

  const permittedEvents = [
    'checkout.session.completed',
    'payment_intent.succeeded',
    'payment_intent.payment_failed'
  ]

  if (permittedEvents.includes(event.type)) {
    let data

    try {
      switch (event.type) {
        case 'checkout.session.completed':
          data = event.data.object
          console.log(`CheckoutSession status: ${data.payment_status}`)

          // Store payment transaction in database
          await storePaymentTransaction(data)
          break

        case 'payment_intent.succeeded':
          data = event.data.object
          console.log(`PaymentIntent succeeded: ${data.id}`)

          // Update payment transaction status
          await updatePaymentTransactionStatus(data.id, 'succeeded')
          break

        case 'payment_intent.payment_failed':
          data = event.data.object
          console.log(`PaymentIntent failed: ${data.id}`)

          // Update payment transaction status
          await updatePaymentTransactionStatus(data.id, 'failed')
          break

        default:
          throw new Error(`Unhandled event: ${event.type}`)
      }
    } catch (error) {
      console.log(error)
      return NextResponse.json(
        { message: 'Webhook handler failed' },
        { status: 500 }
      )
    }
  }
  // Return a response to acknowledge receipt of the event.
  return NextResponse.json({ message: 'Received' }, { status: 200 })
}
