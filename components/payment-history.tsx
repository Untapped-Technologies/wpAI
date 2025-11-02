'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  AlertCircle,
  Calendar,
  CheckCircle,
  Clock,
  CreditCard,
  DollarSign,
  Download,
  ExternalLink,
  XCircle
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

interface PaymentTransaction {
  id: string
  amount: number
  currency: string
  status: 'pending' | 'succeeded' | 'failed' | 'canceled'
  paymentType: 'payment' | 'subscription'
  productName: string
  productDescription?: string
  createdAt: string
  updatedAt: string
  stripeSessionId?: string
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'succeeded':
        return <CheckCircle className="w-4 h-4 text-green-600" />
      case 'failed':
        return <XCircle className="w-4 h-4 text-red-600" />
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-600" />
      case 'canceled':
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
      canceled: 'outline'
    } as const

    return (
      <Badge variant={variants[status as keyof typeof variants] || 'outline'}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    )
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatAmount = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.toUpperCase()
    }).format(amount)
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

  const handleViewInStripe = (transaction: PaymentTransaction) => {
    if (transaction.stripeSessionId) {
      // Open Stripe dashboard or customer portal
      window.open(
        `https://dashboard.stripe.com/test/sessions/${transaction.stripeSessionId}`,
        '_blank'
      )
    }
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <CreditCard className="w-5 h-5 mr-2" />
            Payment History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-600">
              Loading payment history...
            </span>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <CreditCard className="w-5 h-5 mr-2" />
            Payment History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={fetchPaymentHistory} variant="outline">
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <CreditCard className="w-5 h-5 mr-2" />
            Payment History
          </div>
          <Badge variant="outline">
            {transactions.length} transaction
            {transactions.length !== 1 ? 's' : ''}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {transactions.length === 0 ? (
          <div className="text-center py-8">
            <CreditCard className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No Payment History
            </h3>
            <p className="text-gray-600 mb-4">
              You haven't made any payments yet. Your payment history will
              appear here once you make a purchase.
            </p>
            <Button
              onClick={() => {
                window.dispatchEvent(new Event('open-upgrade-modal'))
              }}
            >
              View Pricing Plans
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {transactions.map(transaction => (
              <Card
                key={transaction.id}
                className="border-l-4 border-l-blue-500"
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        {getStatusIcon(transaction.status)}
                        <h3 className="font-semibold text-gray-900">
                          {transaction.productName}
                        </h3>
                        {getStatusBadge(transaction.status)}
                      </div>

                      {transaction.productDescription && (
                        <p className="text-gray-600 text-sm mb-2">
                          {transaction.productDescription}
                        </p>
                      )}

                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <DollarSign className="w-4 h-4" />
                          <span className="font-medium text-gray-900">
                            {formatAmount(
                              transaction.amount,
                              transaction.currency
                            )}
                          </span>
                        </div>

                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>{formatDate(transaction.createdAt)}</span>
                        </div>

                        <Badge variant="outline" className="text-xs">
                          {transaction.paymentType === 'subscription'
                            ? 'Subscription'
                            : 'One-time'}
                        </Badge>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 ml-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDownloadReceipt(transaction)}
                        disabled={transaction.status !== 'succeeded'}
                      >
                        <Download className="w-4 h-4 mr-1" />
                        Receipt
                      </Button>

                      {transaction.stripeSessionId && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewInStripe(transaction)}
                        >
                          <ExternalLink className="w-4 h-4 mr-1" />
                          Stripe
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
