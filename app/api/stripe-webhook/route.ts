import { createClient, SupabaseClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import Stripe from 'stripe'

function getStripe() {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error('STRIPE_SECRET_KEY is required')
  }
  return new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2025-09-30.clover'
  })
}

function getSupabase() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error('Supabase configuration is required')
  }
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  )
}

export async function POST(req: Request) {
  const stripe = getStripe()
  const supabase = getSupabase()
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

  // Handle successful checkout session completion
  if (type === 'checkout.session.completed') {
    const session = data.object as Stripe.Checkout.Session

    // Check if this is a registration flow (new user signup with payment)
    if (session.metadata?.registration_flow === 'true') {
      await handleRegistrationCompletion(session, stripe, supabase)
    }
    // Check if this is an upgrade flow (existing user upgrading)
    else if (session.metadata?.upgrade_flow === 'true') {
      await handleUpgradeCompletion(session, stripe, supabase)
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
      paid_at:
        invoice.status_transitions?.paid_at &&
        typeof invoice.status_transitions.paid_at === 'number'
          ? new Date(invoice.status_transitions.paid_at * 1000).toISOString()
          : new Date().toISOString()
    })
  }

  // Handle subscription updates
  if (type === 'customer.subscription.updated') {
    const subscription = data.object as Stripe.Subscription
    await handleSubscriptionUpdate(subscription, supabase)
  }

  // Handle subscription cancellation
  if (type === 'customer.subscription.deleted') {
    const subscription = data.object as Stripe.Subscription
    await handleSubscriptionCancellation(subscription, supabase)
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
async function handleRegistrationCompletion(
  session: Stripe.Checkout.Session,
  stripe: Stripe,
  supabase: SupabaseClient
) {
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

    console.log(`✅ Created Supabase user ${userId} for email ${email}`)

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
      console.error('❌ Profile creation error:', profileError)
    } else {
      console.log(`✅ Created profile for user ${userId}`)
    }

    // Ensure Stripe customer has user_id in metadata
    if (session.customer) {
      const customer = await stripe.customers.retrieve(
        session.customer as string
      )
      if (customer && typeof customer === 'object' && !customer.deleted) {
        if (
          !customer.metadata?.user_id ||
          customer.metadata.user_id !== userId
        ) {
          await stripe.customers.update(session.customer as string, {
            metadata: {
              ...customer.metadata,
              user_id: userId,
              supabase_user_id: userId
            }
          })
          console.log(
            `✅ Updated Stripe customer metadata with user_id ${userId}`
          )
        }
      }
    }

    // Get subscription details from Stripe if subscription exists
    let subscriptionPeriodStart = new Date().toISOString()
    let subscriptionPeriodEnd = new Date(
      Date.now() + 30 * 24 * 60 * 60 * 1000
    ).toISOString()
    let subscriptionStatus = 'active'
    let priceId = session.metadata?.stripe_price_id || ''

    if (session.subscription) {
      try {
        const subscriptionId =
          typeof session.subscription === 'string'
            ? session.subscription
            : session.subscription.id || ''

        if (subscriptionId) {
          const subscriptionObj =
            await stripe.subscriptions.retrieve(subscriptionId)
          const periodStart = (subscriptionObj as any).current_period_start
          const periodEnd = (subscriptionObj as any).current_period_end

          if (periodStart && typeof periodStart === 'number') {
            subscriptionPeriodStart = new Date(periodStart * 1000).toISOString()
          }
          if (periodEnd && typeof periodEnd === 'number') {
            subscriptionPeriodEnd = new Date(periodEnd * 1000).toISOString()
          }
          subscriptionStatus = (subscriptionObj as any).status || 'active'
          priceId =
            (subscriptionObj as any).items?.data?.[0]?.price?.id || priceId
        }
      } catch (subError) {
        console.error('Error retrieving subscription:', subError)
        // Use defaults if subscription retrieval fails
      }
    }

    // Create subscription record (ALWAYS linked to user_id)
    const subscriptionData = {
      user_id: userId, // CRITICAL: Always link subscription to Supabase user
      plan_id: plan_id,
      stripe_customer_id: session.customer as string,
      stripe_subscription_id: session.subscription
        ? typeof session.subscription === 'string'
          ? session.subscription
          : session.subscription.id || ''
        : null,
      stripe_price_id: priceId,
      status: subscriptionStatus,
      current_period_start: subscriptionPeriodStart,
      current_period_end: subscriptionPeriodEnd
    }

    const { error: subscriptionError } = await supabase
      .from('user_subscriptions')
      .insert(subscriptionData)

    if (subscriptionError) {
      console.error('❌ Subscription creation error:', subscriptionError)
    } else {
      console.log(
        `✅ Subscription created for user ${userId} with plan ${plan_id}`
      )
    }

    // Record payment transaction (ALWAYS linked to user_id)
    const { error: paymentError } = await supabase
      .from('payment_transactions')
      .insert({
        id: session.id,
        user_id: userId, // CRITICAL: Always link payment to Supabase user
        stripe_session_id: session.id,
        stripe_payment_intent_id: session.payment_intent as string,
        amount_cents: session.amount_total || 0,
        currency: session.currency || 'usd',
        status: 'succeeded',
        payment_type:
          session.mode === 'subscription' ? 'subscription' : 'payment',
        product_name:
          session.metadata?.product_name || `Registration - ${plan_id}`,
        product_description:
          session.metadata?.product_description ||
          'Account registration with subscription',
        plan_id: plan_id // Add plan_id for better tracking
      })

    if (paymentError) {
      console.error('❌ Payment transaction creation error:', paymentError)
    } else {
      console.log(`✅ Payment transaction recorded for user ${userId}`)
    }

    console.log(
      `✅ Registration completed for user ${userId} with plan ${plan_id}`
    )
  } catch (error) {
    console.error('Error handling registration completion:', error)
  }
}

// Helper function to handle subscription updates
async function handleSubscriptionUpdate(
  subscription: Stripe.Subscription,
  supabase: SupabaseClient
) {
  try {
    const sub = subscription as any
    const periodStart = sub.current_period_start
    const periodEnd = sub.current_period_end
    const canceledAt = sub.canceled_at

    const { error } = await supabase
      .from('user_subscriptions')
      .update({
        status: sub.status || 'active',
        current_period_start:
          periodStart && typeof periodStart === 'number'
            ? new Date(periodStart * 1000).toISOString()
            : new Date().toISOString(),
        current_period_end:
          periodEnd && typeof periodEnd === 'number'
            ? new Date(periodEnd * 1000).toISOString()
            : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        cancel_at_period_end: sub.cancel_at_period_end || false,
        canceled_at:
          canceledAt && typeof canceledAt === 'number'
            ? new Date(canceledAt * 1000).toISOString()
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

// Helper function to handle upgrade completion
async function handleUpgradeCompletion(
  session: Stripe.Checkout.Session,
  stripe: Stripe,
  supabase: SupabaseClient
) {
  try {
    const userId = session.metadata?.user_id
    const planId = session.metadata?.plan_id

    if (!userId || !planId) {
      console.error('❌ Missing user_id or plan_id in upgrade metadata')
      console.error('Session metadata:', session.metadata)
      return
    }

    // CRITICAL: Verify user exists in Supabase before processing payment
    const { data: user, error: userError } =
      await supabase.auth.admin.getUserById(userId)
    if (userError || !user) {
      console.error(
        `❌ User ${userId} not found in Supabase. Cannot process payment.`
      )
      console.error('User error:', userError)
      return
    }

    console.log(
      `✅ Verified user ${userId} exists in Supabase before processing upgrade`
    )

    // Get the subscription details from Stripe
    const subscriptionId = session.subscription as string
    if (!subscriptionId) {
      console.error('No subscription ID in checkout session')
      return
    }

    const subscriptionObj = await stripe.subscriptions.retrieve(subscriptionId)
    const sub = subscriptionObj as any
    const priceId = sub.items?.data?.[0]?.price?.id || ''

    // Safely convert timestamps to dates
    const periodStart = sub.current_period_start
    const periodEnd = sub.current_period_end
    const canceledAt = sub.canceled_at

    // Update or create subscription record
    const subscriptionData = {
      user_id: userId,
      plan_id: planId,
      stripe_customer_id: session.customer as string,
      stripe_subscription_id: subscriptionId,
      stripe_price_id: priceId,
      status: sub.status || 'active',
      current_period_start:
        periodStart && typeof periodStart === 'number'
          ? new Date(periodStart * 1000).toISOString()
          : new Date().toISOString(),
      current_period_end:
        periodEnd && typeof periodEnd === 'number'
          ? new Date(periodEnd * 1000).toISOString()
          : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      cancel_at_period_end: sub.cancel_at_period_end || false,
      canceled_at:
        canceledAt && typeof canceledAt === 'number'
          ? new Date(canceledAt * 1000).toISOString()
          : null,
      updated_at: new Date().toISOString()
    }

    // Check if subscription record exists
    const { data: existingSubscription } = await supabase
      .from('user_subscriptions')
      .select('id')
      .eq('user_id', userId)
      .single()

    if (existingSubscription) {
      // Update existing subscription
      const { error: updateError } = await supabase
        .from('user_subscriptions')
        .update(subscriptionData)
        .eq('user_id', userId)

      if (updateError) {
        console.error('Error updating subscription:', updateError)
      } else {
        console.log(
          `✅ Subscription updated for user ${userId} to plan ${planId}`
        )
      }
    } else {
      // Create new subscription record
      const { error: insertError } = await supabase
        .from('user_subscriptions')
        .insert(subscriptionData)

      if (insertError) {
        console.error('Error creating subscription:', insertError)
      } else {
        console.log(
          `✅ Subscription created for user ${userId} with plan ${planId}`
        )
      }
    }

    // Record payment transaction (ALWAYS linked to user_id)
    const { error: paymentError } = await supabase
      .from('payment_transactions')
      .insert({
        id: session.id,
        user_id: userId, // CRITICAL: Always link payment to Supabase user
        stripe_session_id: session.id,
        stripe_payment_intent_id: session.payment_intent as string,
        amount_cents: session.amount_total || 0,
        currency: session.currency || 'usd',
        status: 'succeeded',
        payment_type:
          session.mode === 'subscription' ? 'subscription' : 'payment',
        product_name: `Upgrade to ${planId}`,
        product_description: `Subscription upgrade`,
        plan_id: planId // Add plan_id for better tracking
      })

    if (paymentError) {
      console.error('❌ Payment transaction creation error:', paymentError)
    } else {
      console.log(`✅ Payment transaction recorded for user ${userId}`)
    }

    // Ensure Stripe customer metadata is up to date
    if (session.customer) {
      const customer = await stripe.customers.retrieve(
        session.customer as string
      )
      if (customer && typeof customer === 'object' && !customer.deleted) {
        if (
          !customer.metadata?.user_id ||
          customer.metadata.user_id !== userId
        ) {
          await stripe.customers.update(session.customer as string, {
            metadata: {
              ...customer.metadata,
              user_id: userId,
              supabase_user_id: userId
            }
          })
          console.log(
            `✅ Updated Stripe customer metadata with user_id ${userId}`
          )
        }
      }
    }
  } catch (error) {
    console.error('Error handling upgrade completion:', error)
  }
}

// Helper function to handle subscription cancellation
async function handleSubscriptionCancellation(
  subscription: Stripe.Subscription,
  supabase: SupabaseClient
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
