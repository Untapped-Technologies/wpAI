import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { CheckCircle } from 'lucide-react'
import Link from 'next/link'

const EntPricingCard = ({ pricingEnterprise }: any) => {
  return (
    <Card
      key={pricingEnterprise.id}
      className={`m-auto p-4 border-2 transition-colors duration-300 max-w-2xl mt-8 justify-center items-center flex border-slate-200 hover:border-[#203c39]`}
    >
      {/* Enterprise Pricing */}
      <CardHeader className="text-center">
        <CardTitle className="text-xl">{pricingEnterprise.title}</CardTitle>
        <div className="text-3xl font-bold text-[#203c39] mb-2">
          {pricingEnterprise.price}
          {pricingEnterprise.timeframe && (
            <span className="text-lg font-normal">
              /{pricingEnterprise.timeframe}
            </span>
          )}
        </div>
        {pricingEnterprise.subtitle && (
          <CardDescription className="text-sm">
            {pricingEnterprise.subtitle}
          </CardDescription>
        )}
      </CardHeader>

      <CardContent className="pt-4">
        <ul className="space-y-3 mb-6">
          {pricingEnterprise.features.map((feature: any) => (
            <li key={feature.fid} className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
              <span className="text-sm">{feature.feature}</span>
            </li>
          ))}
        </ul>

        <Button
          asChild
          className={`w-full ${
            pricingEnterprise.id === 2
              ? 'bg-[#203c39] hover:bg-[#203c39]/90 text-white'
              : 'variant-outline'
          }`}
          variant={pricingEnterprise.id === 2 ? 'default' : 'outline'}
        >
          <Link
            href={
              pricingEnterprise.url === '#' ? '/contact' : pricingEnterprise.url
            }
          >
            {pricingEnterprise.trial ? 'Start Free Trial' : 'Contact Sales'}
          </Link>
        </Button>
      </CardContent>
    </Card>
  )
}

export default EntPricingCard
