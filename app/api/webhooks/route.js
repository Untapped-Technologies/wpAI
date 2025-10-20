import { headers } from 'next/headers'
import { NextResponse } from 'next/server'

import { stripe } from '../../../lib/stripe'
import { supabaseAdmin } from '../../../lib/supabase/supabaseAdmin'

// Helper function to store payment transaction
async function storePaymentTransaction(sessionData) {
  try {
    // Extract user ID from metadata or customer email
    const userId = sessionData.metadata?.user_id || sessionData.customer_email

    if (!userId) {
      console.log('No user ID found in session metadata')
      return
    }

    // Get line items to determine product details
    const lineItems = await stripe.checkout.sessions.listLineItems(
      sessionData.id
    )
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
      product_description: lineItems.data[0]?.description || null
    }

    const { error } = await supabaseAdmin
      .from('payment_transactions')
      .upsert(transactionData, {
        onConflict: 'id'
      })

    if (error) {
      console.error('Error storing payment transaction:', error)
    } else {
      console.log('Payment transaction stored successfully:', sessionData.id)
    }
  } catch (error) {
    console.error('Exception storing payment transaction:', error)
  }
}

// Helper function to update payment transaction status
async function updatePaymentTransactionStatus(paymentIntentId, status) {
  try {
    const { error } = await supabaseAdmin
      .from('payment_transactions')
      .update({
        status: status,
        stripe_payment_intent_id: paymentIntentId
      })
      .eq('stripe_payment_intent_id', paymentIntentId)

    if (error) {
      console.error('Error updating payment transaction status:', error)
    } else {
      console.log(
        'Payment transaction status updated successfully:',
        paymentIntentId,
        status
      )
    }
  } catch (error) {
    console.error('Exception updating payment transaction status:', error)
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
