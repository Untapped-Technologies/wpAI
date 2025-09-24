import PageLayout from '@/components/_constants/pages/pageLayout'
import PricingCard from '@/components/_constants/pricing/pricingCard'
import { pricingData } from '@/components/_constants/pricing/pricingData'

const Pricing = () => {
  return (
    <PageLayout title="Pricing">
      {pricingData.map(data => (
        <PricingCard key={data.id} data={data} />
      ))}
    </PageLayout>
  )
}

export default Pricing
