import { Button } from '@/components/ui'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertCircle, CreditCard } from 'lucide-react'

const PaymentTryAgain = ({ fetchPaymentHistory, error }: any) => {
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

export default PaymentTryAgain
