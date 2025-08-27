import { Check } from 'lucide-react'
import Link from 'next/link'

type Feature = {
  fid: number
  feature: string
  description: string
}

type DataType = {
  data: {
    id: number
    title: string
    subtitle: string
    price: string
    timeframe: string
    features: Feature[]
    url: string
  }
}

const PricingCard = ({ data }: DataType) => {
  return (
    <div className="py-16 dark:bg-black lg:py-8" id="pricing">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="border-[#006A4E] border-2 rounded-xl fade-in">
            <div className="inner-card relative overflow-hidden transition-transform duration-300 ">
              <div className="p-8 lg:flex lg:items-start lg:space-x-8 dark:bg-black">
                <div className="mb-8 text-center lg:w-2/5 lg:text-left lg:mb-0">
                  <h3 className="mb-2 text-3xl font-bold text-[#006A4E]">
                    {data.title}
                  </h3>
                  <p className="mb-6 dark:text-gray-300">{data.subtitle}</p>

                  <div className="flex items-baseline justify-center mb-4 lg:justify-start">
                    <span className="text-3xl font-extrabold dark:text-gray-100">
                      {data.price}
                    </span>
                    <span className="ml-2 dark:text-gray-400">
                      /{data.timeframe}
                    </span>
                  </div>

                  <p className="inline-block px-4 py-2 mb-8 text-sm font-semibold text-white bg-green-800 rounded-full">
                    10 Day Free Trial
                  </p>

                  <Link
                    href={`/payment/${data.id}`}
                    className="block px-8 py-4 text-lg text-center font-semibold text-white transition duration-300 ease-in-out transform bg-green-800 rounded-lg shadow-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-200 focus:ring-opacity-50 hover:shadow-md "
                  >
                    Start Your Free Trial
                  </Link>
                  <p className="mt-3 text-sm dark:text-gray-400">
                    Cancel anytime
                  </p>
                </div>

                <div className="lg:w-3/5">
                  <h4 className="hidden mb-6 text-xl font-semibold dark:text-gray-300 lg:block text-left indent-10">
                    Whats Included:
                  </h4>
                  <div className="space-y-4 text-left">
                    {data.features.map(feat => (
                      <div className="flex items-start" key={feat.fid}>
                        <Check
                          size={20}
                          className="flex-shrink-0 w-6 h-6 mr-3 text-green-700 mt-0.5"
                        />
                        <div>
                          <span className="font-semibold dark:text-gray-300 text-gray-800">
                            {feat.feature}
                          </span>
                          <p className="text-sm dark:text-gray-400 text-gray-500">
                            {feat.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PricingCard
