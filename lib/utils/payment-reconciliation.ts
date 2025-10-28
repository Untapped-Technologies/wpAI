import { stripe } from '@/lib/stripe'
import { supabaseAdmin } from '@/lib/supabase/supabaseAdmin'

/**
 * Payment Reconciliation Utility
 * This function compares Stripe payment data with our database
 * and identifies any discrepancies or missing payments
 */
export async function reconcilePaymentData(userId?: string) {
  try {
    console.log('Starting payment reconciliation...')

    const reconciliationResults = {
      totalUsersProcessed: 0,
      discrepanciesFound: 0,
      missingPayments: 0,
      statusMismatches: 0,
      errors: [] as string[]
    }

    // Get all users or specific user
    let usersQuery = supabaseAdmin.from('user_profiles').select('id, email')

    if (userId) {
      usersQuery = usersQuery.eq('id', userId)
    }

    const { data: users, error: usersError } = await usersQuery

    if (usersError) {
      throw new Error(`Failed to fetch users: ${usersError.message}`)
    }

    if (!users || users.length === 0) {
      console.log('No users found for reconciliation')
      return reconciliationResults
    }

    reconciliationResults.totalUsersProcessed = users.length

    // Process each user
    for (const user of users) {
      try {
        if (!user.email) {
          reconciliationResults.errors.push(
            `User ${user.id} has no email address`
          )
          continue
        }

        // Find Stripe customer
        const customers = await stripe.customers.list({
          email: user.email,
          limit: 1
        })

        if (customers.data.length === 0) {
          console.log(`No Stripe customer found for user ${user.id}`)
          continue
        }

        const customer = customers.data[0]

        // Get all payment intents from Stripe
        const paymentIntents = await stripe.paymentIntents.list({
          customer: customer.id,
          limit: 100
        })

        // Get all transactions from our database
        const { data: dbTransactions, error: dbError } = await supabaseAdmin
          .from('payment_transactions')
          .select('*')
          .eq('user_id', user.id)

        if (dbError) {
          reconciliationResults.errors.push(
            `Failed to fetch DB transactions for user ${user.id}: ${dbError.message}`
          )
          continue
        }

        // Create maps for easier comparison
        const stripePayments = new Map()
        const dbPayments = new Map()

        paymentIntents.data.forEach(payment => {
          stripePayments.set(payment.id, {
            id: payment.id,
            amount: payment.amount,
            currency: payment.currency,
            status: payment.status,
            created: payment.created
          })
        })

        dbTransactions?.forEach(transaction => {
          dbPayments.set(transaction.stripe_payment_intent_id, {
            id: transaction.stripe_payment_intent_id,
            amount: transaction.amount_cents,
            currency: transaction.currency,
            status: transaction.status,
            created: new Date(transaction.created_at).getTime() / 1000
          })
        })

        // Find missing payments in database
        for (const [stripeId, stripePayment] of stripePayments) {
          if (!dbPayments.has(stripeId)) {
            reconciliationResults.missingPayments++
            console.log(
              `Missing payment in DB: ${stripeId} for user ${user.id}`
            )

            // Optionally auto-sync missing payments
            // await syncMissingPayment(stripePayment, user.id)
          }
        }

        // Find status mismatches
        for (const [stripeId, stripePayment] of stripePayments) {
          const dbPayment = dbPayments.get(stripeId)
          if (dbPayment && stripePayment.status !== dbPayment.status) {
            reconciliationResults.statusMismatches++
            console.log(
              `Status mismatch for payment ${stripeId}: Stripe=${stripePayment.status}, DB=${dbPayment.status}`
            )

            // Optionally auto-correct status
            // await supabaseAdmin
            //   .from('payment_transactions')
            //   .update({ status: stripePayment.status })
            //   .eq('stripe_payment_intent_id', stripeId)
          }
        }
      } catch (userError) {
        reconciliationResults.errors.push(
          `Error processing user ${user.id}: ${userError}`
        )
      }
    }

    console.log('Payment reconciliation completed:', reconciliationResults)
    return reconciliationResults
  } catch (error) {
    console.error('Payment reconciliation failed:', error)
    throw error
  }
}

/**
 * Sync a missing payment from Stripe to database
 */
async function syncMissingPayment(stripePayment: any, userId: string) {
  try {
    const transactionData = {
      id: stripePayment.id,
      user_id: userId,
      stripe_payment_intent_id: stripePayment.id,
      amount_cents: stripePayment.amount,
      currency: stripePayment.currency,
      status: stripePayment.status === 'succeeded' ? 'succeeded' : 'pending',
      payment_type: 'payment', // Default, could be enhanced to detect subscription
      product_name: 'Reconciled Payment',
      product_description: 'Payment synced during reconciliation',
      created_at: new Date(stripePayment.created * 1000).toISOString(),
      updated_at: new Date().toISOString()
    }

    const { error } = await supabaseAdmin
      .from('payment_transactions')
      .upsert(transactionData, {
        onConflict: 'id'
      })

    if (error) {
      throw new Error(`Failed to sync payment: ${error.message}`)
    }

    console.log(`Successfully synced missing payment ${stripePayment.id}`)
  } catch (error) {
    console.error(`Failed to sync payment ${stripePayment.id}:`, error)
    throw error
  }
}
