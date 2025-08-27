import PlainCard from '@/components/ui/cards/plainCard'
import CountrySelect from '@/components/ui/countrySelect'
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime'

type CitizenType = {
  router: AppRouterInstance
  handleCountryChange: () => void
}

const Step1Citizen = ({ router, handleCountryChange }: CitizenType) => {
  return (
    <PlainCard
      classes="w-[800px] h-96"
      header={'Step 1: Country'}
      footer={
        <button
          className="mt-6 text-sm underline"
          onClick={() => router.push('/')}
        >
          Skip for now
        </button>
      }
    >
      <CountrySelect onChange={handleCountryChange} />
    </PlainCard>
  )
}

export default Step1Citizen
