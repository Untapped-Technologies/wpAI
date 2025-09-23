import PageLayout from '@/components/_constants/pages/pageLayout'
import PricingCard from '@/components/_constants/pricing/pricingCard'
import { pricingData } from '@/components/_constants/pricing/pricingData'

const Pricing = () => {
  return (
    <PageLayout title="Pricing">
      <PricingCard data={pricingData} />
    </PageLayout>
  )
}

export default Pricing
