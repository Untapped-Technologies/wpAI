import { Switch } from '@/components/ui/switch'

type Interval = {
  interval: string
  setInterval: any
}

const PricingHeader = ({ interval, setInterval }: Interval) => {
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
          <span
            className={`text-sm ${interval === 'annual' ? 'font-semibold text-slate-900' : 'text-slate-600'}`}
          >
            Annual
          </span>
        </div>
      </div>
    </section>
  )
}

export default PricingHeader
