import { Badge } from '@/components/ui/badge'
import SimpleButton from '@/components/ui/buttons/simpleButton'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { formatCurrency } from '@/lib/utils/utils'
import { CheckCircle } from 'lucide-react'

const PricingCard = ({ plan, popular, handleCheckout }: any) => {
  return (
    <Card
      className={`border-2 transition-colors duration-300 flex flex-col ${
        plan.id === popular
          ? 'border-[#203c39] relative'
          : 'border-slate-200 hover:border-[#203c39]'
      }`}
    >
      {plan.id === popular && (
        <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-[#203c39] text-white">
          Most Popular
        </Badge>
      )}

      <CardHeader className="text-center">
        <CardTitle className="text-xl">{plan.title}</CardTitle>
        <div className="text-3xl font-bold text-[#203c39] mb-2">
          {formatCurrency({ value: plan.price })}
          {plan.timeframe && (
            <span className="text-lg font-normal">/{plan.timeframe}</span>
          )}
        </div>
        {plan.subtitle && (
          <CardDescription className="text-sm">{plan.subtitle}</CardDescription>
        )}
        {plan.trialButton && (
          <Badge
            variant="outline"
            className="mt-2 text-xs flex justify-center p-2 bg-gray-200"
          >
            10 Day Free Trial
          </Badge>
        )}
      </CardHeader>

      <CardContent className="flex flex-col h-full">
        <ul className="space-y-3 mb-6">
          {plan.features.map((feature: any) => (
            <li key={feature.fid} className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
              <span className="text-sm">{feature.feature}</span>
            </li>
          ))}
        </ul>

        <div className="mt-auto">
          <SimpleButton
            classes={`w-full ${
              plan.id === popular
                ? 'bg-[#203c39] hover:bg-[#203c39]/90 text-white'
                : 'variant-outline'
            }`}
            handleClick={() =>
              handleCheckout(plan.stripe_price_id, plan.paymentType)
            }
            label="Start Free Trial"
          />

          {plan.trial && (
            <p className="mt-2 text-xs text-center text-slate-500">
              Cancel anytime
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export default PricingCard
