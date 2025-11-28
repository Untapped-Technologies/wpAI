import { headers } from 'next/headers'
import { getAdsConfig } from '@/lib/config/ads'
import { getUserCountry } from '@/lib/utils/ads'
import { AdSlot } from './ad-slot'
import type { AdContext } from '@/lib/types/ads'

interface AdSlotServerProps {
  slotId: string
  className?: string
  context?: Partial<AdContext>
  height?: number
  width?: number
}

/**
 * Server component wrapper for AdSlot
 * Fetches ads configuration and passes it to the client component
 */
export async function AdSlotServer({
  slotId,
  className,
  context,
  height,
  width
}: AdSlotServerProps) {
  const headersList = await headers()
  const country = getUserCountry(headersList)
  
  // Fetch ads configuration
  const ads = await getAdsConfig()

  // Merge server-side context (country from headers)
  const mergedContext: Partial<AdContext> = {
    ...context,
    country: context?.country || country
  }

  return (
    <AdSlot
      slotId={slotId}
      className={className}
      context={mergedContext}
      ads={ads}
      height={height}
      width={width}
    />
  )
}

