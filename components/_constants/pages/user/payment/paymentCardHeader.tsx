import { Badge } from '@/components/ui/badge'
import { CardHeader, CardTitle } from '@/components/ui/card'
import { CreditCard } from 'lucide-react'

const PaymentCardHeader = ({ transactions }: any) => {
  return (
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
  )
}

export default PaymentCardHeader
