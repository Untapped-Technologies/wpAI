import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover'
import { Info } from 'lucide-react'

const MembershipInfo = ({
  membership,
  hasPaidSub,
  trialDaysLeft,
  features,
  limits,
  planInfo
}: any) => {
  return (
    <div className="flex items-center gap-2 mt-2">
      <Badge variant="default" className="text-xs uppercase">
        {planInfo?.planId || membership || 'free'} member
      </Badge>
      {!hasPaidSub && trialDaysLeft !== null && (
        <Badge className="text-xs" variant="default">
          {trialDaysLeft} days left in trial
        </Badge>
      )}
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="ghost" size="sm" className="h-6 px-2">
            <Info className="w-3.5 h-3.5 mr-1" /> Plan details
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 text-sm">
          <div className="mb-2 font-semibold">Included features</div>
          {Object.keys(features).length === 0 ? (
            <div className="text-gray-500">No feature data</div>
          ) : (
            <ul className="list-disc pl-5 space-y-1">
              {Object.entries(features).map(([k, v]) => (
                <li key={k} className="capitalize">
                  {k.replaceAll('_', ' ')}: {String(v)}
                </li>
              ))}
            </ul>
          )}
          <div className="mt-3 mb-1 font-semibold">Limits</div>
          {Object.keys(limits).length === 0 ? (
            <div className="text-gray-500">No limits data</div>
          ) : (
            <ul className="list-disc pl-5 space-y-1">
              {Object.entries(limits).map(([k, v]) => (
                <li key={k} className="capitalize">
                  {k.replaceAll('_', ' ')}: {String(v)}
                </li>
              ))}
            </ul>
          )}
        </PopoverContent>
      </Popover>
      {!hasPaidSub && (
        <Button
          size="sm"
          variant="outline"
          onClick={() => window.dispatchEvent(new Event('open-upgrade-modal'))}
        >
          Upgrade
        </Button>
      )}
    </div>
  )
}

export default MembershipInfo
