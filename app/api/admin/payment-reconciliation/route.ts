import { getCurrentUserId } from '@/lib/auth/get-current-user'
import { reconcilePaymentData } from '@/lib/utils/payment-reconciliation'
import { NextRequest, NextResponse } from 'next/server'

/**
 * API endpoint to trigger payment reconciliation
 * Can be called manually or by a cron job
 */
export async function POST(req: NextRequest) {
  try {
    // Check if user is authenticated (for manual triggers)
    const userId = await getCurrentUserId()

    // Get query parameters
    const { searchParams } = new URL(req.url)
    const reconcileAll = searchParams.get('all') === 'true'
    const specificUserId = searchParams.get('userId')

    // Determine which users to reconcile
    let targetUserId: string | undefined = undefined

    if (reconcileAll) {
      // Reconcile all users (admin only - you might want to add admin check here)
      targetUserId = undefined
    } else if (specificUserId) {
      // Reconcile specific user
      targetUserId = specificUserId
    } else if (userId) {
      // Reconcile current user only
      targetUserId = userId
    } else {
      return NextResponse.json(
        { error: 'User not authenticated and no specific user provided' },
        { status: 401 }
      )
    }

    console.log(
      `Starting payment reconciliation for ${targetUserId ? 'user: ' + targetUserId : 'all users'}`
    )

    const results = await reconcilePaymentData(targetUserId)

    return NextResponse.json({
      success: true,
      message: 'Payment reconciliation completed',
      results
    })
  } catch (error) {
    console.error('Payment reconciliation API error:', error)
    return NextResponse.json(
      {
        error: 'Payment reconciliation failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

/**
 * GET endpoint to check reconciliation status
 */
export async function GET(req: NextRequest) {
  try {
    const userId = await getCurrentUserId()

    if (!userId) {
      return NextResponse.json(
        { error: 'User not authenticated' },
        { status: 401 }
      )
    }

    // Get recent reconciliation results (you could store these in a table)
    // For now, just return basic info
    return NextResponse.json({
      success: true,
      message: 'Payment reconciliation is available',
      endpoints: {
        reconcile: 'POST /api/admin/payment-reconciliation',
        syncStripe: 'POST /api/user/payment-history/sync-stripe'
      }
    })
  } catch (error) {
    console.error('Payment reconciliation status check error:', error)
    return NextResponse.json(
      { error: 'Failed to check reconciliation status' },
      { status: 500 }
    )
  }
}
