import { Button } from '@/components/ui/button'
import { CreditCard } from 'lucide-react'

const PaymentNoTransactions = () => {
  return (
    <div className="text-center py-8">
      <CreditCard className="w-12 h-12 text-gray-400 mx-auto mb-4" />
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        No Payment History
      </h3>
      <p className="text-gray-600 mb-4">
        You haven't made any payments yet. Your payment history will appear here
        once you make a purchase.
      </p>
      <Button
        onClick={() => {
          window.dispatchEvent(new Event('open-upgrade-modal'))
        }}
      >
        View Pricing Plans
      </Button>
    </div>
  )
}

export default PaymentNoTransactions
