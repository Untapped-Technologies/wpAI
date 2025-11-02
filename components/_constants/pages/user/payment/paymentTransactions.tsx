import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import { formatCurrency, formatDate } from '@/lib/utils/utils'
import { Download } from 'lucide-react'

type TransactionType = {
  transactions: any
  handleDownloadReceipt: any
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

const PaymentTransacations = ({
  transactions,
  handleDownloadReceipt
}: TransactionType) => {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Status</TableHead>
            <TableHead>Plan</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Type</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.map((transaction: any) => (
            <TableRow key={transaction.id}>
              <TableCell>
                <div className="flex items-center gap-2">
                  {getStatusBadge(transaction.status)}
                </div>
              </TableCell>
              <TableCell className="font-medium">
                <div className="flex flex-col">
                  <span className="uppercase text-sm">
                    {transaction.plan_id || 'N/A'}
                  </span>
                  {transaction.stripe_price_id && (
                    <span className="text-xs text-muted-foreground">
                      {formatDate(transaction.createdAt)}
                    </span>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <span className="font-semibold">
                  {formatCurrency({ value: transaction.amount / 100 })}
                </span>
                <span className="text-xs text-muted-foreground ml-1">
                  {transaction.currency}
                </span>
              </TableCell>
              <TableCell>
                <Badge variant="outline" className="text-xs">
                  {transaction.paymentType === 'subscription'
                    ? 'Subscription'
                    : transaction.paymentType === 'refund'
                      ? 'Refund'
                      : 'One-time'}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDownloadReceipt(transaction)}
                    disabled={transaction.status !== 'succeeded'}
                  >
                    <Download className="w-4 h-4 mr-1" />
                    Receipt
                  </Button>
                  {/* {transaction.stripePaymentId && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        if (transaction.stripePaymentId) {
                          window.open(
                            `https://dashboard.stripe.com/test/payments/${transaction.stripePaymentId}`,
                            '_blank'
                          )
                        }
                      }}
                    >
                      <ExternalLink className="w-4 h-4 mr-1" />
                      View
                    </Button>
                  )} */}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

export default PaymentTransacations
