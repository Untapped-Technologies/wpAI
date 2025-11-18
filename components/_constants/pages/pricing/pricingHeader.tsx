import { Switch } from '@/components/ui/switch'

type Interval = {
  interval: string
  setInterval: any
  savingsPercentage?: number | null
}

const PricingHeader = ({ interval, setInterval, savingsPercentage }: Interval) => {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-4">
          <h1 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-4">
            Choose Your Plan
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Start free and upgrade as your needs grow. All plans include access
            to our core political intelligence platform.
          </p>
        </div>
        <div className="flex items-center justify-center gap-3 mt-6">
          <span
            className={`text-sm ${interval === 'month' ? 'font-semibold text-slate-900' : 'text-slate-600'}`}
          >
            Monthly
          </span>
          <Switch
            checked={interval === 'annual'}
            onCheckedChange={(checked: boolean) =>
              setInterval(checked ? 'annual' : 'month')
            }
            aria-label="Toggle annual billing"
          />
          <div className="flex items-center gap-2">
            <span
              className={`text-sm ${interval === 'annual' ? 'font-semibold text-slate-900' : 'text-slate-600'}`}
            >
              Annual
            </span>
            {interval === 'annual' && savingsPercentage !== null && savingsPercentage !== undefined && (
              <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded-full">
                Save {savingsPercentage}%
              </span>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

export default PricingHeader
