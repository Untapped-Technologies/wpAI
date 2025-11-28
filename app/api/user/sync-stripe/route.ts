import { getCurrentUserId } from '@/lib/auth/get-current-user'
import { supabaseAdmin } from '@/lib/supabase/supabaseAdmin'
import { randomUUID } from 'crypto'
import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

const secretKey = process.env.STRIPE_SECRET_KEY
const stripe = new Stripe(secretKey as string, {})

/**
 * Sync user's Stripe data with Supabase
 * This endpoint reconciles Stripe subscriptions, customers, and payments with Supabase records
 */
export async function POST(req: NextRequest) {
  try {
    if (!secretKey) {
      return NextResponse.json(
        { error: 'Stripe secret key is not configured' },
        { status: 500 }
      )
    }

    const userId = await getCurrentUserId()

    if (!userId || userId === 'anonymous') {
      return NextResponse.json(
        { error: 'User not authenticated' },
        { status: 401 }
      )
    }

    // Use admin client to bypass RLS policies
    const { data: userData } =
      await supabaseAdmin.auth.admin.getUserById(userId)
    const userEmail = userData?.user?.email

    if (!userEmail) {
      return NextResponse.json(
        { error: 'User email not found' },
        { status: 400 }
      )
    }

    console.log(`🔄 Starting Stripe sync for user ${userId} (${userEmail})`)

    const syncResults = {
      customerSynced: false,
      subscriptionsSynced: 0,
      paymentsSynced: 0,
      errors: [] as string[]
    }

    // Step 1: Find or create Stripe customer
    let stripeCustomerId: string | null = null

    // Check if user has existing Stripe customer ID in subscription
    const { data: subscription } = await supabaseAdmin
      .from('user_subscriptions')
      .select('stripe_customer_id')
      .eq('user_id', userId)
      .maybeSingle()

    if (subscription?.stripe_customer_id) {
      stripeCustomerId = subscription.stripe_customer_id
      console.log(`✅ Found existing Stripe customer: ${stripeCustomerId}`)
    } else {
      // Search Stripe by email
      const customers = await stripe.customers.list({
        email: userEmail,
        limit: 1
      })

      if (customers.data.length > 0) {
        stripeCustomerId = customers.data[0].id
        console.log(`✅ Found Stripe customer by email: ${stripeCustomerId}`)

        // Update subscription with customer ID if subscription exists
        if (subscription) {
          await supabaseAdmin
            .from('user_subscriptions')
            .update({ stripe_customer_id: stripeCustomerId })
            .eq('user_id', userId)
        } else {
          // Create subscription record
          await supabaseAdmin.from('user_subscriptions').insert({
            user_id: userId,
            plan_id: 'free',
            stripe_customer_id: stripeCustomerId,
            stripe_price_id: '', // Will be updated when subscriptions are synced
            status: 'active',
            current_period_start: new Date().toISOString(),
            current_period_end: new Date(
              Date.now() + 365 * 24 * 60 * 60 * 1000
            ).toISOString()
          })
        }

        // Ensure customer metadata has user_id
        const customer = customers.data[0]
        if (
          !customer.metadata?.user_id ||
          customer.metadata.user_id !== userId
        ) {
          await stripe.customers.update(stripeCustomerId, {
            metadata: {
              ...customer.metadata,
              user_id: userId,
              supabase_user_id: userId
            }
          })
          console.log(`✅ Updated Stripe customer metadata with user_id`)
        }
        syncResults.customerSynced = true
      }
    }

    if (!stripeCustomerId) {
      console.log(
        `⚠️  No Stripe customer found for user ${userId} (${userEmail})`
      )
      // Try one more time to find customer by checking all customers with this email
      const allCustomers = await stripe.customers.list({
        email: userEmail,
        limit: 10
      })

      if (allCustomers.data.length > 0) {
        console.log(
          `✅ Found ${allCustomers.data.length} customer(s) by email search`
        )
        // Use the first one and update metadata
        stripeCustomerId = allCustomers.data[0].id
        const customer = allCustomers.data[0]

        // Update customer metadata if needed
        if (
          !customer.metadata?.user_id ||
          customer.metadata.user_id !== userId
        ) {
          await stripe.customers.update(stripeCustomerId, {
            metadata: {
              ...customer.metadata,
              user_id: userId,
              supabase_user_id: userId
            }
          })
          console.log(
            `✅ Updated Stripe customer ${stripeCustomerId} metadata with user_id ${userId}`
          )
        }

        // Create or update subscription record
        const { data: existingSub } = await supabaseAdmin
          .from('user_subscriptions')
          .select('id, stripe_customer_id')
          .eq('user_id', userId)
          .maybeSingle()

        if (existingSub) {
          await supabaseAdmin
            .from('user_subscriptions')
            .update({ stripe_customer_id: stripeCustomerId })
            .eq('user_id', userId)
        } else {
          await supabaseAdmin.from('user_subscriptions').insert({
            user_id: userId,
            plan_id: 'free',
            stripe_customer_id: stripeCustomerId,
            status: 'active',
            current_period_start: new Date().toISOString(),
            current_period_end: new Date(
              Date.now() + 365 * 24 * 60 * 60 * 1000
            ).toISOString()
          })
        }
        syncResults.customerSynced = true
      } else {
        return NextResponse.json({
          success: true,
          message:
            'No Stripe customer found. User may not have made any payments yet.',
          ...syncResults
        })
      }
    }

    // Step 2: Sync Stripe subscriptions with Supabase
    const stripeSubscriptions = await stripe.subscriptions.list({
      customer: stripeCustomerId,
      limit: 100
    })

    console.log(
      `📋 Found ${stripeSubscriptions.data.length} Stripe subscriptions`
    )

    for (const stripeSub of stripeSubscriptions.data) {
      const priceId = stripeSub.items.data[0]?.price.id || ''
      let planId = stripeSub.metadata?.plan_id || ''

      // Try to get plan from database by price ID first
      const { data: plan } = await supabaseAdmin
        .from('plans')
        .select('id, name')
        .eq('stripe_price_id', priceId)
        .maybeSingle()

      // If plan found in database, use it
      if (plan?.id) {
        planId = plan.id
        console.log(
          `✅ Found plan ${plan.id} (${plan.name}) for price ${priceId}`
        )
      } else if (!planId) {
        // If no plan_id in metadata and no plan in DB, try to infer from price metadata
        const priceMetadata = stripeSub.items.data[0]?.price.metadata
        planId =
          priceMetadata?.plan_id ||
          stripeSub.items.data[0]?.price.nickname ||
          'free'
        console.log(
          `⚠️  No plan found for price ${priceId}, using inferred plan: ${planId}`
        )
      }

      // Normalize plan_id (e.g., "basic annual" -> "basic", "premium monthly" -> "premium")
      if (planId) {
        const originalPlanId = planId
        // Remove interval suffixes and other common suffixes
        const normalized = planId
          .toLowerCase()
          .replace(/\s+(annual|monthly|year|month|plus|tier)$/gi, '')
          .trim()

        // Check if normalized version exists in database
        const { data: normalizedPlan } = await supabaseAdmin
          .from('plans')
          .select('id')
          .eq('id', normalized)
          .maybeSingle()

        if (normalizedPlan?.id) {
          planId = normalizedPlan.id
          console.log(
            `✅ Normalized plan_id from "${originalPlanId}" to "${normalizedPlan.id}"`
          )
        } else {
          // Try to find a matching plan by checking if normalized contains common plan names
          const commonPlans = ['basic', 'premium', 'enterprise', 'free']
          const foundPlan = commonPlans.find(p => normalized.includes(p))
          if (foundPlan) {
            const { data: foundPlanData } = await supabaseAdmin
              .from('plans')
              .select('id')
              .eq('id', foundPlan)
              .maybeSingle()
            if (foundPlanData?.id) {
              planId = foundPlanData.id
              console.log(
                `✅ Matched "${originalPlanId}" to plan "${foundPlanData.id}"`
              )
            }
          }
        }
      }

      const finalPlanId = planId || 'basic' // Default to basic instead of free for paid subscriptions

      // Safely convert timestamps to dates
      const sub = stripeSub as any
      const periodStart = sub.current_period_start
      const periodEnd = sub.current_period_end
      const canceledAt = sub.canceled_at

      const subscriptionData = {
        user_id: userId,
        plan_id: finalPlanId,
        stripe_customer_id: stripeCustomerId,
        stripe_subscription_id: stripeSub.id,
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

      // Check if subscription exists in Supabase
      const { data: existingSub } = await supabaseAdmin
        .from('user_subscriptions')
        .select('id')
        .eq('stripe_subscription_id', stripeSub.id)
        .maybeSingle()

      if (existingSub) {
        // Update existing subscription
        const { error: updateError } = await supabaseAdmin
          .from('user_subscriptions')
          .update(subscriptionData)
          .eq('stripe_subscription_id', stripeSub.id)

        if (updateError) {
          console.error(
            `❌ Error updating subscription ${stripeSub.id}:`,
            updateError
          )
          syncResults.errors.push(
            `Failed to update subscription ${stripeSub.id}`
          )
        } else {
          console.log(`✅ Updated subscription ${stripeSub.id}`)
          syncResults.subscriptionsSynced++
        }
      } else {
        // Check if user has a subscription record (might need to update)
        const { data: userSub } = await supabaseAdmin
          .from('user_subscriptions')
          .select('id, stripe_subscription_id')
          .eq('user_id', userId)
          .maybeSingle()

        if (userSub) {
          // If user has a subscription but it's different from this one, update it
          if (userSub.stripe_subscription_id !== stripeSub.id) {
            // Update existing record with Stripe subscription
            const { error: updateError } = await supabaseAdmin
              .from('user_subscriptions')
              .update(subscriptionData)
              .eq('user_id', userId)

            if (updateError) {
              console.error(`❌ Error updating user subscription:`, updateError)
              syncResults.errors.push('Failed to update user subscription')
            } else {
              console.log(`✅ Updated user subscription with Stripe data`)
              syncResults.subscriptionsSynced++
            }
          } else {
            // Same subscription, just update the data
            const { error: updateError } = await supabaseAdmin
              .from('user_subscriptions')
              .update(subscriptionData)
              .eq('user_id', userId)

            if (updateError) {
              console.error(`❌ Error updating subscription:`, updateError)
              syncResults.errors.push('Failed to update subscription')
            } else {
              console.log(`✅ Updated subscription data`)
              syncResults.subscriptionsSynced++
            }
          }
        } else {
          // No subscription exists for this user, create new one
          console.log(`📝 Attempting to insert subscription with data:`, {
            user_id: subscriptionData.user_id,
            plan_id: subscriptionData.plan_id,
            stripe_subscription_id: subscriptionData.stripe_subscription_id,
            stripe_price_id: subscriptionData.stripe_price_id
          })

          // Double-check that this subscription doesn't exist (by stripe_subscription_id)
          const { data: existingByStripeId } = await supabaseAdmin
            .from('user_subscriptions')
            .select('id')
            .eq(
              'stripe_subscription_id',
              subscriptionData.stripe_subscription_id
            )
            .maybeSingle()

          if (existingByStripeId) {
            // Update existing subscription
            const result = await supabaseAdmin
              .from('user_subscriptions')
              .update(subscriptionData)
              .eq(
                'stripe_subscription_id',
                subscriptionData.stripe_subscription_id
              )
              .select()

            if (result.error) {
              console.error(`❌ Error updating subscription:`, result.error)
              syncResults.errors.push(
                `Failed to update subscription: ${result.error.message}`
              )
            } else {
              console.log(
                `✅ Updated existing subscription by stripe_subscription_id`
              )
              syncResults.subscriptionsSynced++
            }
          } else {
            // Insert new subscription
            const result = await supabaseAdmin
              .from('user_subscriptions')
              .insert(subscriptionData)
              .select()

            if (result.error) {
              console.error(`❌ Error creating subscription:`, result.error)
              console.error(
                `   Error details:`,
                JSON.stringify(result.error, null, 2)
              )
              console.error(
                `   Subscription data:`,
                JSON.stringify(subscriptionData, null, 2)
              )
              syncResults.errors.push(
                `Failed to create subscription: ${result.error.message}`
              )
            } else {
              console.log(`✅ Created subscription record:`, result.data)
              syncResults.subscriptionsSynced++
            }
          }
        }
      }
    }

    // Step 3: Sync payment transactions from payment intents
    let paymentIntents
    try {
      paymentIntents = await stripe.paymentIntents.list({
        customer: stripeCustomerId,
        limit: 100
      })
      console.log(`💳 Found ${paymentIntents.data.length} payment intents`)
    } catch (error) {
      console.error('❌ Error fetching payment intents:', error)
      paymentIntents = { data: [] }
    }

    // Skip payment intents - we'll sync them via checkout sessions instead
    // Payment intents are linked to checkout sessions, so we handle them there
    console.log(
      `💳 Skipping direct payment intent sync (will sync via checkout sessions)`
    )

    // Step 4: Sync checkout sessions (for payments made via checkout)
    let checkoutSessions
    try {
      checkoutSessions = await stripe.checkout.sessions.list({
        customer: stripeCustomerId,
        limit: 100
      })
      console.log(`🛒 Found ${checkoutSessions.data.length} checkout sessions`)
    } catch (error) {
      console.error('❌ Error fetching checkout sessions:', error)
      checkoutSessions = { data: [] }
    }

    for (const session of checkoutSessions.data) {
      if (session.payment_status !== 'paid') continue

      // Check if payment transaction already exists
      const { data: existingPayment } = await supabaseAdmin
        .from('payment_transactions')
        .select('id')
        .eq('stripe_session_id', session.id)
        .maybeSingle()

      // Get payment intent - it might be a string or object
      let paymentIntentId: string | null = null
      if (session.payment_intent) {
        paymentIntentId =
          typeof session.payment_intent === 'string'
            ? session.payment_intent
            : session.payment_intent.id || null
      }

      // If no payment intent in session, try to find it from payment intents list
      if (!paymentIntentId) {
        try {
          const paymentIntents = await stripe.paymentIntents.list({
            customer: stripeCustomerId,
            limit: 100
          })
          // Find payment intent that matches this session's amount and date
          const matchingIntent = paymentIntents.data.find(
            pi =>
              pi.amount === (session.amount_total || 0) &&
              Math.abs(pi.created - session.created) < 60 // Within 60 seconds
          )
          if (matchingIntent) {
            paymentIntentId = matchingIntent.id
            console.log(
              `✅ Found matching payment intent ${paymentIntentId} for session ${session.id}`
            )
          }
        } catch (e) {
          // Continue without payment intent
        }
      }

      if (!existingPayment && session.amount_total) {
        // Generate UUID for id field (database expects UUID, not TEXT)
        // Store session.id in stripe_session_id for reference
        const transactionId = randomUUID()

        const paymentData: any = {
          id: transactionId, // UUID for database
          user_id: userId,
          stripe_session_id: session.id, // Store session ID here for reference
          stripe_payment_intent_id: paymentIntentId,
          amount_cents: session.amount_total || 0,
          currency: session.currency || 'usd',
          status: 'succeeded',
          payment_type:
            session.mode === 'subscription' ? 'subscription' : 'payment',
          product_name: session.metadata?.product_name || 'Subscription',
          product_description: session.metadata?.product_description || ''
        }

        // Add plan_id if available (for newer migrations)
        if (session.metadata?.plan_id) {
          let planId = session.metadata.plan_id
          // Normalize plan_id (e.g., "basic annual" -> "basic")
          const normalized = planId
            .toLowerCase()
            .replace(/\s+(annual|monthly|year|month)$/i, '')
            .trim()
          // Check if normalized version exists in database
          const { data: normalizedPlan } = await supabaseAdmin
            .from('plans')
            .select('id')
            .eq('id', normalized)
            .maybeSingle()

          paymentData.plan_id = normalizedPlan?.id || planId
        }

        console.log(`📝 Attempting to insert payment with data:`, {
          id: paymentData.id,
          user_id: paymentData.user_id,
          plan_id: paymentData.plan_id,
          amount_cents: paymentData.amount_cents
        })

        const { error: insertError, data: insertedData } = await supabaseAdmin
          .from('payment_transactions')
          .insert(paymentData)
          .select()

        if (insertError) {
          console.error(
            `❌ Error inserting checkout session ${session.id}:`,
            insertError
          )
          console.error(
            `   Error details:`,
            JSON.stringify(insertError, null, 2)
          )
          console.error(
            `   Payment data:`,
            JSON.stringify(paymentData, null, 2)
          )
          syncResults.errors.push(
            `Failed to sync checkout session ${session.id}: ${insertError.message}`
          )
        } else {
          console.log(`✅ Synced checkout session ${session.id}:`, insertedData)
          console.log(`   User ID: ${userId}, Payment ID: ${paymentData.id}`)
          syncResults.paymentsSynced++
        }
      }
    }

    console.log(`✅ Sync completed for user ${userId}`)
    console.log(
      `   - Customer: ${syncResults.customerSynced ? 'Synced' : 'Already exists'}`
    )
    console.log(`   - Subscriptions: ${syncResults.subscriptionsSynced} synced`)
    console.log(`   - Payments: ${syncResults.paymentsSynced} synced`)
    if (syncResults.errors.length > 0) {
      console.log(`   - Errors: ${syncResults.errors.length}`)
    }

    return NextResponse.json({
      success: true,
      message: 'Stripe data synced successfully',
      ...syncResults
    })
  } catch (error: any) {
    console.error('❌ Error syncing Stripe data:', error)
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to sync Stripe data',
        details: error
      },
      { status: 500 }
    )
  }
}
