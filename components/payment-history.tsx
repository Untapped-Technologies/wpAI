'use client'

import { Card, CardContent } from '@/components/ui/card'
import { toast } from 'sonner'
import PaymentCardHeader from './_constants/pages/user/payment/paymentCardHeader'
import PaymentLoading from './_constants/pages/user/payment/paymentLoading'
import PaymentNoTransactions from './_constants/pages/user/payment/paymentNoTransactions'
import PaymentTransacations from './_constants/pages/user/payment/paymentTransactions'
import PaymentTryAgain from './_constants/pages/user/payment/paymentTryAgain'


export interface PaymentTransaction {
  id: string
  amount: number
  currency: string
  status: 'pending' | 'succeeded' | 'failed' | 'canceled' | 'refunded'
  paymentType: 'payment' | 'subscription' | 'refund'
  plan_id?: string
  stripe_price_id?: string
  createdAt: string
  updatedAt?: string
  stripePaymentId?: string
  stripePaymentIntentId?: string
  productName?: string
  productDescription?: string
}

interface PaymentHistoryProps {
  transactions: PaymentTransaction[]
  loading: boolean
  error: string | null
  onRefresh: () => void
}

export default function PaymentHistory({
  transactions,
  loading,
  error,
  onRefresh
}: PaymentHistoryProps) {

  const handleDownloadReceipt = async (transaction: PaymentTransaction) => {
    try {
      // This would typically generate a PDF receipt
      // For now, we'll just show a toast
      toast.info('Receipt download feature coming soon!')
    } catch (err) {
      toast.error('Failed to download receipt')
    }
  }

  const handleSyncStripe = async () => {
    try {
      toast.info('Syncing payment data from Stripe...')

      const response = await fetch('/api/user/sync-stripe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      })

      const data = await response.json()

      if (data.success) {
        toast.success(
          `Sync completed! ${data.subscriptionsSynced} subscriptions, ${data.paymentsSynced} payments synced.`
        )
        // Refresh payment history after sync
        setTimeout(() => {
          onRefresh()
          // Dispatch events to refresh other components
          window.dispatchEvent(new CustomEvent('payment-success'))
          window.dispatchEvent(new CustomEvent('sync-complete'))
        }, 1000)
      } else {
        throw new Error(data.error || 'Sync failed')
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to sync'
      toast.error(`Sync failed: ${errorMessage}`)
    }
  }

  if (loading) {
    return <PaymentLoading />
  }

  if (error) {
    return (
      <PaymentTryAgain
        fetchPaymentHistory={onRefresh}
        error={error}
      />
    )
  }

  return (
    <Card className="bg-white border-0 shadow-white">
      <PaymentCardHeader transactions={transactions} />
      <div className="px-6 pt-4 pb-2 flex justify-end">
        <button
          onClick={handleSyncStripe}
          disabled={loading}
          className="text-sm text-blue-600 hover:text-blue-800 disabled:text-gray-400 disabled:cursor-not-allowed"
        >
          {loading ? 'Syncing...' : 'Sync from Stripe'}
        </button>
      </div>
      <CardContent>
        {transactions.length === 0 ? (
          <PaymentNoTransactions />
        ) : (
          <PaymentTransacations
            transactions={transactions}
            handleDownloadReceipt={handleDownloadReceipt}
          />
        )}
      </CardContent>
    </Card>
  )
}
