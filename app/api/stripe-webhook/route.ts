import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-09-30.clover'
})
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: Request) {
  const sig = req.headers.get('stripe-signature')
  const body = await req.text() // must use raw body
  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig!,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err: any) {
    console.error('❌ Webhook signature verification failed:', err.message)
    return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 })
  }

  const { type, data } = event

  // Handle successful checkout session completion (for registration flow)
  if (type === 'checkout.session.completed') {
    const session = data.object as Stripe.Checkout.Session

    // Check if this is a registration flow
    if (session.metadata?.registration_flow === 'true') {
      await handleRegistrationCompletion(session)
    }
  }

  // Handle successful payment
  if (type === 'invoice.payment_succeeded') {
    const invoice = data.object as Stripe.Invoice & {
      payment_intent?: string | Stripe.PaymentIntent
      subscription?: string | Stripe.Subscription
    }

    const paymentIntentId =
      typeof invoice.payment_intent === 'string'
        ? invoice.payment_intent
        : (invoice.payment_intent?.id ?? null)

    const subscriptionId =
      typeof invoice.subscription === 'string'
        ? invoice.subscription
        : (invoice.subscription?.id ?? null)

    await supabase.from('payment_history').insert({
      user_id: invoice.metadata?.user_id ?? null,
      plan_id: invoice.metadata?.plan_id ?? null,
      stripe_payment_id: paymentIntentId,
      stripe_subscription_id: subscriptionId,
      amount: (invoice.amount_paid ?? 0) / 100,
      currency: invoice.currency,
      status: 'succeeded',
      invoice_url: invoice.hosted_invoice_url ?? null,
      paid_at: invoice.status_transitions?.paid_at
        ? new Date(invoice.status_transitions.paid_at * 1000).toISOString()
        : new Date().toISOString()
    })
  }

  // Handle subscription updates
  if (type === 'customer.subscription.updated') {
    const subscription = data.object as Stripe.Subscription
    await handleSubscriptionUpdate(subscription)
  }

  // Handle subscription cancellation
  if (type === 'customer.subscription.deleted') {
    const subscription = data.object as Stripe.Subscription
    await handleSubscriptionCancellation(subscription)
  }

  if (type === 'charge.refunded') {
    const charge = data.object as Stripe.Charge

    await supabase.from('payment_history').insert({
      stripe_payment_id: charge.id,
      amount: -charge.amount_refunded / 100,
      currency: charge.currency,
      status: 'refunded',
      payment_type: 'refund'
    })
  }

  return new NextResponse(JSON.stringify({ received: true }), { status: 200 })
}

// Helper function to handle registration completion
async function handleRegistrationCompletion(session: Stripe.Checkout.Session) {
  try {
    const { email, password_hash, user_type, plan_id } = session.metadata || {}

    if (!email || !password_hash || !user_type || !plan_id) {
      console.error('Missing required metadata for registration completion')
      return
    }

    // Create user account in Supabase Auth
    const { data: authData, error: authError } =
      await supabase.auth.admin.createUser({
        email,
        password: password_hash, // Note: In production, you should hash this properly
        email_confirm: true, // Auto-confirm email since payment was successful
        user_metadata: {
          registration_source: 'stripe_checkout',
          plan_id,
          user_type
        }
      })

    if (authError || !authData.user) {
      console.error('Failed to create user account:', authError)
      return
    }

    const userId = authData.user.id

    // Create user profile
    const { error: profileError } = await supabase.from('profiles').insert({
      user_id: userId,
      email: email,
      display_name: email.split('@')[0],
      user_type_id: user_type,
      preferences: {},
      updated_at: new Date().toISOString()
    })

    if (profileError) {
      console.error('Profile creation error:', profileError)
    }

    // Create subscription record
    const subscriptionData = {
      user_id: userId,
      plan_id: plan_id,
      stripe_customer_id: session.customer as string,
      stripe_subscription_id: session.subscription as string,
      stripe_price_id: session.metadata?.stripe_price_id || '',
      status: 'active',
      current_period_start: session.subscription_details?.billing_cycle_anchor
        ? new Date(
            session.subscription_details.billing_cycle_anchor * 1000
          ).toISOString()
        : new Date().toISOString(),
      current_period_end: session.subscription_details?.billing_cycle_anchor
        ? new Date(
            (session.subscription_details.billing_cycle_anchor +
              30 * 24 * 60 * 60) *
              1000
          ).toISOString()
        : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
    }

    const { error: subscriptionError } = await supabase
      .from('user_subscriptions')
      .insert(subscriptionData)

    if (subscriptionError) {
      console.error('Subscription creation error:', subscriptionError)
    }

    // Record payment transaction
    const { error: paymentError } = await supabase
      .from('payment_transactions')
      .insert({
        id: session.id,
        user_id: userId,
        stripe_session_id: session.id,
        stripe_payment_intent_id: session.payment_intent as string,
        amount_cents: session.amount_total || 0,
        currency: session.currency || 'usd',
        status: 'succeeded',
        payment_type:
          session.mode === 'subscription' ? 'subscription' : 'payment',
        product_name: session.metadata?.product_name || 'Subscription',
        product_description: session.metadata?.product_description || ''
      })

    if (paymentError) {
      console.error('Payment transaction creation error:', paymentError)
    }

    console.log(
      `✅ Registration completed for user ${userId} with plan ${plan_id}`
    )
  } catch (error) {
    console.error('Error handling registration completion:', error)
  }
}

// Helper function to handle subscription updates
async function handleSubscriptionUpdate(subscription: Stripe.Subscription) {
  try {
    const { error } = await supabase
      .from('user_subscriptions')
      .update({
        status: subscription.status,
        current_period_start: new Date(
          subscription.current_period_start * 1000
        ).toISOString(),
        current_period_end: new Date(
          subscription.current_period_end * 1000
        ).toISOString(),
        cancel_at_period_end: subscription.cancel_at_period_end,
        canceled_at: subscription.canceled_at
          ? new Date(subscription.canceled_at * 1000).toISOString()
          : null,
        updated_at: new Date().toISOString()
      })
      .eq('stripe_subscription_id', subscription.id)

    if (error) {
      console.error('Error updating subscription:', error)
    } else {
      console.log(`✅ Subscription ${subscription.id} updated`)
    }
  } catch (error) {
    console.error('Error handling subscription update:', error)
  }
}

// Helper function to handle subscription cancellation
async function handleSubscriptionCancellation(
  subscription: Stripe.Subscription
) {
  try {
    const { error } = await supabase
      .from('user_subscriptions')
      .update({
        status: 'canceled',
        canceled_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('stripe_subscription_id', subscription.id)

    if (error) {
      console.error('Error canceling subscription:', error)
    } else {
      console.log(`✅ Subscription ${subscription.id} canceled`)
    }
  } catch (error) {
    console.error('Error handling subscription cancellation:', error)
  }
}
