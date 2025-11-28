import type { Ad, AdContext } from '@/lib/types/ads'

/**
 * Select the best ad for a given slot and context
 * Uses priority, targeting, and randomization for selection
 */
export function selectAdForSlot(
  ads: Ad[],
  slotId: string,
  context?: AdContext
): Ad | null {
  // Filter ads that can appear in this slot
  const eligibleAds = ads.filter((ad) => {
    if (!ad.active) return false
    if (!ad.slotIds.includes(slotId)) return false

    // Check date range
    const now = new Date().toISOString()
    if (ad.startAt && ad.startAt > now) return false
    if (ad.endAt && ad.endAt < now) return false

    // Check viewport width targeting
    if (context?.viewportWidth) {
      if (ad.minWidth && context.viewportWidth < ad.minWidth) return false
      if (ad.maxWidth && context.viewportWidth > ad.maxWidth) return false
    }

    // Check country targeting
    if (context?.country && ad.countries && ad.countries.length > 0) {
      if (!ad.countries.includes(context.country)) return false
    }

    // Check topic targeting
    if (context?.topics && ad.topics && ad.topics.length > 0) {
      const hasMatchingTopic = context.topics.some((topic) =>
        ad.topics?.includes(topic)
      )
      if (!hasMatchingTopic) return false
    }

    return true
  })

  if (eligibleAds.length === 0) return null

  // Sort by priority (higher first), then randomize within same priority
  const sortedAds = eligibleAds.sort((a, b) => {
    const priorityA = a.priority ?? 0
    const priorityB = b.priority ?? 0
    if (priorityA !== priorityB) {
      return priorityB - priorityA
    }
    // Randomize within same priority
    return Math.random() - 0.5
  })

  // Select from top priority tier (ads with same highest priority)
  const topPriority = sortedAds[0].priority ?? 0
  const topTierAds = sortedAds.filter(
    (ad) => (ad.priority ?? 0) === topPriority
  )

  // Random selection from top tier
  return topTierAds[Math.floor(Math.random() * topTierAds.length)]
}

/**
 * Build tracking URL with query parameters
 */
export function buildTrackingUrl(
  ad: Ad,
  slotId: string,
  baseUrl?: string
): string {
  const url = new URL(ad.destinationUrl || '#', baseUrl || 'https://worldpolitics.ai')
  
  // Add tracking parameters
  url.searchParams.set('utm_source', 'worldpolitics')
  url.searchParams.set('utm_medium', 'ad')
  url.searchParams.set('utm_campaign', ad.id)
  url.searchParams.set('ad_slot', slotId)
  
  if (ad.trackingId) {
    url.searchParams.set('tracking_id', ad.trackingId)
  }
  
  return url.toString()
}

/**
 * Check if ad should be lazy loaded based on slot configuration
 */
export function shouldLazyLoad(slotId: string, lazyLoad?: boolean): boolean {
  // Default to lazy loading for better performance
  return lazyLoad !== false
}

/**
 * Get user's country from headers or context
 * This is a simple implementation - you may want to enhance this
 */
export function getUserCountry(headers?: Headers): string | undefined {
  // In a real implementation, you might:
  // 1. Check Cloudflare headers (CF-IPCountry)
  // 2. Use a geolocation service
  // 3. Check user preferences
  if (headers) {
    const country = headers.get('cf-ipcountry') || headers.get('x-country-code')
    return country || undefined
  }
  return undefined
}

/**
 * Get viewport width from client-side
 * This should be called client-side only
 */
export function getViewportWidth(): number {
  if (typeof window === 'undefined') return 1920 // Default to desktop
  return window.innerWidth
}

