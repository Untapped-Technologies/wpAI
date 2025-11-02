'use client'

import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { AlertCircle, CheckCircle, Clock, XCircle } from 'lucide-react'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import PaymentCardHeader from './_constants/pages/user/payment/paymentCardHeader'
import PaymentLoading from './_constants/pages/user/payment/paymentLoading'
import PaymentNoTransactions from './_constants/pages/user/payment/paymentNoTransactions'
import PaymentTransacations from './_constants/pages/user/payment/paymentTransactions'
import PaymentTryAgain from './_constants/pages/user/payment/paymentTryAgain'

interface PaymentTransaction {
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
}

interface PaymentHistoryProps {
  userId: string
}

export default function PaymentHistory({ userId }: PaymentHistoryProps) {
  const [transactions, setTransactions] = useState<PaymentTransaction[]>([])

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchPaymentHistory()
  }, [userId])

  const fetchPaymentHistory = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/user/payment-history')

      if (!response.ok) {
        throw new Error('Failed to fetch payment history')
      }

      const data = await response.json()

      if (data.success) {
        setTransactions(data.transactions)
        if (data.message) {
          console.log(data.message)
        }
      } else {
        throw new Error(data.error || 'Failed to fetch payment history')
      }
    } catch (err) {
      console.error('Error fetching payment history:', err)
      setError(
        err instanceof Error ? err.message : 'Failed to fetch payment history'
      )
      toast.error('Failed to load payment history')
    } finally {
      setLoading(false)
    }
  }

  const handleDownloadReceipt = async (transaction: PaymentTransaction) => {
    try {
      // This would typically generate a PDF receipt
      // For now, we'll just show a toast
      toast.info('Receipt download feature coming soon!')
    } catch (err) {
      toast.error('Failed to download receipt')
    }
  }

  if (loading) {
    return <PaymentLoading />
  }

  if (error) {
    return (
      <PaymentTryAgain
        fetchPaymentHistory={fetchPaymentHistory}
        error={error}
      />
    )
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'succeeded':
        return <CheckCircle className="w-4 h-4 text-green-600" />
      case 'failed':
        return <XCircle className="w-4 h-4 text-red-600" />
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-600" />
      case 'canceled':
      case 'refunded':
        return <AlertCircle className="w-4 h-4 text-gray-600" />
      default:
        return <Clock className="w-4 h-4 text-gray-600" />
    }
  }

  const getStatusBadge = (status: string) => {
    const variants = {
      succeeded: 'default',
      failed: 'destructive',
      pending: 'secondary',
      canceled: 'outline',
      refunded: 'outline'
    } as const

    return (
      <Badge variant={variants[status as keyof typeof variants] || 'outline'}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    )
  }

  return (
    <Card className="bg-white border-0 shadow-white">
      <PaymentCardHeader transactions={transactions} />
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
