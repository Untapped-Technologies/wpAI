import { getCurrentUserId } from '@/lib/auth/get-current-user'
import { supabaseAdmin } from '@/lib/supabase/supabaseAdmin'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  try {
    // Get user ID using the same pattern as other API routes
    const userId = await getCurrentUserId()

    if (!userId) {
      return NextResponse.json(
        { error: 'User not authenticated' },
        { status: 401 }
      )
    }

    // Fetch payment transactions for the user
    const { data: transactions, error } = await supabaseAdmin
      .from('payment_history')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching payment transactions:', error)

      // Check if the error is because the table doesn't exist
      if (
        error.message.includes('relation "payment_transactions" does not exist')
      ) {
        return NextResponse.json({
          success: true,
          transactions: [],
          message:
            'Payment transactions table not yet created. No payment history available.'
        })
      }

      return NextResponse.json(
        { error: 'Failed to fetch payment history' },
        { status: 500 }
      )
    }

    // Transform the data to include formatted amounts and dates
    const formattedTransactions =
      transactions?.map(transaction => ({
        id: transaction.id,
        amount: transaction.amount / 100, // Convert cents to dollars
        currency: transaction.currency.toUpperCase(),
        status: transaction.status,
        paymentType: transaction.payment_type,
        productName: transaction.product_name,
        productDescription: transaction.product_description,
        createdAt: transaction.created_at,
        updatedAt: transaction.updated_at,
        stripeSessionId: transaction.stripe_session_id,
        stripePaymentIntentId: transaction.stripe_payment_intent_id
      })) || []

    return NextResponse.json({
      success: true,
      transactions: formattedTransactions
    })
  } catch (error) {
    console.error('Error in payment history API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
