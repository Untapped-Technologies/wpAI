export type AdType = 'house' | 'affiliate' | 'external'

export type Ad = {
  id: string // unique ad id
  slotIds: string[] // which slots this ad can appear in
  type: AdType
  title: string
  description?: string
  imageUrl?: string
  ctaLabel?: string
  destinationUrl?: string // where the user ends up
  trackingId?: string // optional for affiliate tracking or internal metrics
  active: boolean
  priority?: number // higher = more likely to show
  topics?: string[] // e.g. ['elections', 'economy']
  countries?: string[] // ISO country codes to include or exclude
  startAt?: string // ISO date string
  endAt?: string // ISO date string
  createdAt: string
  updatedAt: string
  // Additional targeting options
  minWidth?: number // minimum viewport width in pixels
  maxWidth?: number // maximum viewport width in pixels
  // External ad network configuration (for future use)
  externalConfig?: {
    network: string // e.g., 'adsense', 'media.net'
    adUnitId?: string
    scriptUrl?: string
    [key: string]: unknown // allow additional network-specific config
  }
}

export type AdSlot = {
  id: string
  name: string
  description?: string
  defaultHeight?: number // default height in pixels for layout stability
  defaultWidth?: number // default width in pixels
  lazyLoad?: boolean // whether to lazy load ads in this slot
}

export type AdContext = {
  slotId: string
  page?: string // current page path
  topics?: string[] // current page topics
  country?: string // user's country (ISO code)
  viewportWidth?: number // current viewport width
  userId?: string // optional user ID for targeting
}

export type AdAnalyticsEvent = {
  adId: string
  slotId: string
  eventType: 'impression' | 'click'
  timestamp: string
  page?: string
  userId?: string
  userAgent?: string
  referrer?: string
}

