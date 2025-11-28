import type { Ad, AdSlot } from '@/lib/types/ads'

/**
 * Ad slots configuration
 * Define all available ad slots across the site
 */
export const AD_SLOTS: Record<string, AdSlot> = {
  homepage_top: {
    id: 'homepage_top',
    name: 'Homepage Top',
    description: 'Top banner on homepage',
    defaultHeight: 250,
    defaultWidth: 728,
    lazyLoad: false // Above the fold, load immediately
  },
  homepage_sidebar_1: {
    id: 'homepage_sidebar_1',
    name: 'Homepage Sidebar 1',
    description: 'First sidebar ad on homepage',
    defaultHeight: 300,
    defaultWidth: 300,
    lazyLoad: true
  },
  homepage_sidebar_2: {
    id: 'homepage_sidebar_2',
    name: 'Homepage Sidebar 2',
    description: 'Second sidebar ad on homepage',
    defaultHeight: 300,
    defaultWidth: 300,
    lazyLoad: true
  },
  article_inline_1: {
    id: 'article_inline_1',
    name: 'Article Inline 1',
    description: 'First inline ad in article content',
    defaultHeight: 250,
    defaultWidth: 728,
    lazyLoad: true
  },
  article_inline_2: {
    id: 'article_inline_2',
    name: 'Article Inline 2',
    description: 'Second inline ad in article content',
    defaultHeight: 250,
    defaultWidth: 728,
    lazyLoad: true
  },
  sidebar_1: {
    id: 'sidebar_1',
    name: 'Sidebar 1',
    description: 'First sidebar ad (general)',
    defaultHeight: 300,
    defaultWidth: 300,
    lazyLoad: true
  },
  sidebar_2: {
    id: 'sidebar_2',
    name: 'Sidebar 2',
    description: 'Second sidebar ad (general)',
    defaultHeight: 300,
    defaultWidth: 300,
    lazyLoad: true
  },
  search_results_top: {
    id: 'search_results_top',
    name: 'Search Results Top',
    description: 'Top ad on search results page',
    defaultHeight: 250,
    defaultWidth: 728,
    lazyLoad: false
  },
  candidate_profile_sidebar: {
    id: 'candidate_profile_sidebar',
    name: 'Candidate Profile Sidebar',
    description: 'Sidebar ad on candidate profile pages',
    defaultHeight: 300,
    defaultWidth: 300,
    lazyLoad: true
  }
}

/**
 * Sample ads data
 * In production, this would come from Supabase or another database
 */
export const SAMPLE_ADS: Ad[] = [
  {
    id: 'house-1',
    slotIds: ['homepage_top', 'article_inline_1'],
    type: 'house',
    title: 'Join WorldPolitics.AI Premium',
    description: 'Get unlimited access to in-depth political analysis and exclusive content.',
    imageUrl: '/images/ads/premium-upgrade.png',
    ctaLabel: 'Upgrade Now',
    destinationUrl: '/pricing',
    active: true,
    priority: 10,
    topics: [],
    countries: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'house-2',
    slotIds: ['homepage_sidebar_1', 'sidebar_1'],
    type: 'house',
    title: 'Explore Trending Topics',
    description: 'Discover what\'s happening in politics right now.',
    imageUrl: '/images/ads/trending-topics.png',
    ctaLabel: 'View Trends',
    destinationUrl: '/trending-topics',
    active: true,
    priority: 8,
    topics: [],
    countries: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'affiliate-1',
    slotIds: ['homepage_sidebar_2', 'sidebar_2', 'candidate_profile_sidebar'],
    type: 'affiliate',
    title: 'Political Science Books',
    description: 'Expand your knowledge with curated political science literature.',
    imageUrl: '/images/ads/political-books.png',
    ctaLabel: 'Shop Now',
    destinationUrl: 'https://example.com/books?ref=worldpolitics',
    trackingId: 'affiliate-books-001',
    active: true,
    priority: 7,
    topics: ['education', 'politics'],
    countries: ['US', 'CA', 'GB'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'house-3',
    slotIds: ['search_results_top'],
    type: 'house',
    title: 'Advanced Search Features',
    description: 'Unlock powerful search capabilities with Premium.',
    imageUrl: '/images/ads/advanced-search.png',
    ctaLabel: 'Learn More',
    destinationUrl: '/pricing',
    active: true,
    priority: 9,
    topics: ['search'],
    countries: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'affiliate-2',
    slotIds: ['article_inline_2'],
    type: 'affiliate',
    title: 'Political News Subscription',
    description: 'Stay informed with premium political news coverage.',
    imageUrl: '/images/ads/news-subscription.png',
    ctaLabel: 'Subscribe',
    destinationUrl: 'https://example.com/news?ref=worldpolitics',
    trackingId: 'affiliate-news-001',
    active: true,
    priority: 6,
    topics: ['news', 'politics'],
    countries: ['US'],
    minWidth: 768, // Only show on tablets and desktops
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'house-4',
    slotIds: ['homepage_sidebar_1', 'sidebar_1'],
    type: 'house',
    title: 'Create Your Candidate Profile',
    description: 'Showcase your political platform and connect with voters.',
    imageUrl: '/images/ads/candidate-profile.png',
    ctaLabel: 'Get Started',
    destinationUrl: '/candidate-onboarding',
    active: true,
    priority: 8,
    topics: ['candidates', 'elections'],
    countries: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
]

/**
 * Get all active ads
 */
export function getActiveAds(): Ad[] {
  const now = new Date().toISOString()
  return SAMPLE_ADS.filter((ad) => {
    if (!ad.active) return false
    if (ad.startAt && ad.startAt > now) return false
    if (ad.endAt && ad.endAt < now) return false
    return true
  })
}

/**
 * Get ads configuration
 * In production, this would fetch from Supabase or another source
 */
export async function getAdsConfig(): Promise<Ad[]> {
  // For now, return sample ads
  // TODO: Replace with Supabase query when ready
  return getActiveAds()
}

