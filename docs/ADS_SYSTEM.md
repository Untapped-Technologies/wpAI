# Ads System Documentation

A reusable, config-driven ads system for Next.js applications.

## Overview

The ads system supports:
- **House ads**: Internal promotions (e.g., upgrade to Premium)
- **Affiliate ads**: External affiliate links with tracking
- **External ads**: Third-party ad networks (AdSense, Media.net, etc.) - ready for future integration

## Features

- ✅ Config-driven (easy to manage ads without code changes)
- ✅ Slot-based system (define ad slots, assign ads to slots)
- ✅ Targeting support (topics, countries, viewport width, date ranges)
- ✅ Lazy loading for better performance
- ✅ SSR-safe components
- ✅ Analytics tracking (impressions and clicks)
- ✅ Fixed height wrappers to prevent layout shift
- ✅ Priority-based ad selection

## Quick Start

### 1. Add an Ad Slot to a Page

```tsx
import { AdSlotServer } from '@/components/ads'

export default function HomePage() {
  return (
    <div>
      <h1>Welcome</h1>
      
      {/* Add ad slot */}
      <AdSlotServer slotId="homepage_top" />
      
      {/* Rest of your content */}
    </div>
  )
}
```

### 2. Configure Ads

Edit `lib/config/ads.ts` to add or modify ads:

```typescript
{
  id: 'my-ad-1',
  slotIds: ['homepage_top', 'sidebar_1'],
  type: 'house',
  title: 'My Ad Title',
  description: 'Ad description here',
  imageUrl: '/images/ads/my-ad.png',
  ctaLabel: 'Click Here',
  destinationUrl: '/pricing',
  active: true,
  priority: 10,
  topics: ['politics'],
  countries: ['US', 'CA'],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
}
```

## Available Ad Slots

- `homepage_top` - Top banner on homepage
- `homepage_sidebar_1` - First sidebar ad on homepage
- `homepage_sidebar_2` - Second sidebar ad on homepage
- `article_inline_1` - First inline ad in article content
- `article_inline_2` - Second inline ad in article content
- `sidebar_1` - First sidebar ad (general)
- `sidebar_2` - Second sidebar ad (general)
- `search_results_top` - Top ad on search results page
- `candidate_profile_sidebar` - Sidebar ad on candidate profile pages

## Component API

### AdSlotServer (Recommended)

Server component that fetches ads and handles server-side context:

```tsx
<AdSlotServer
  slotId="homepage_top"
  className="my-custom-class"
  context={{
    topics: ['elections'],
    country: 'US'
  }}
  height={250}
  width={728}
/>
```

### AdSlot (Client Component)

Use directly if you need client-side control:

```tsx
'use client'
import { AdSlot } from '@/components/ads'
import { getAdsConfig } from '@/lib/config/ads'

const ads = await getAdsConfig()

<AdSlot
  slotId="homepage_top"
  ads={ads}
  context={{ topics: ['politics'] }}
/>
```

## Ad Configuration

### Required Fields

- `id`: Unique identifier
- `slotIds`: Array of slot IDs where this ad can appear
- `type`: `'house' | 'affiliate' | 'external'`
- `title`: Ad title
- `active`: Boolean to enable/disable ad
- `createdAt`: ISO date string
- `updatedAt`: ISO date string

### Optional Fields

- `description`: Ad description text
- `imageUrl`: Path to ad image
- `ctaLabel`: Call-to-action button text
- `destinationUrl`: Where the ad links to
- `trackingId`: Affiliate tracking ID
- `priority`: Number (higher = more likely to show)
- `topics`: Array of topic strings for targeting
- `countries`: Array of ISO country codes for targeting
- `startAt`: ISO date string (when ad should start showing)
- `endAt`: ISO date string (when ad should stop showing)
- `minWidth`: Minimum viewport width in pixels
- `maxWidth`: Maximum viewport width in pixels

## Targeting Examples

### Topic Targeting

Show ad only on pages with specific topics:

```typescript
{
  topics: ['elections', 'politics'],
  // Ad will only show if context includes these topics
}
```

### Country Targeting

Show ad only in specific countries:

```typescript
{
  countries: ['US', 'CA', 'GB'],
  // Ad will only show for users in these countries
}
```

### Date Range Targeting

Show ad only during specific date range:

```typescript
{
  startAt: '2024-01-01T00:00:00Z',
  endAt: '2024-12-31T23:59:59Z',
}
```

### Responsive Targeting

Show ad only on certain screen sizes:

```typescript
{
  minWidth: 768, // Only show on tablets and desktops
  maxWidth: 1920, // Don't show on ultra-wide screens
}
```

## Analytics

The system automatically tracks:
- **Impressions**: When an ad is viewed
- **Clicks**: When an ad is clicked

Analytics are sent to:
- `/api/ads/impression` - Track ad views
- `/api/ads/click` - Track ad clicks

### Future: Supabase Integration

To store analytics in Supabase, create a table:

```sql
CREATE TABLE ad_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ad_id TEXT NOT NULL,
  slot_id TEXT NOT NULL,
  event_type TEXT NOT NULL CHECK (event_type IN ('impression', 'click')),
  timestamp TIMESTAMPTZ NOT NULL,
  page TEXT,
  user_id UUID REFERENCES auth.users(id),
  user_agent TEXT,
  referrer TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_ad_analytics_ad_id ON ad_analytics(ad_id);
CREATE INDEX idx_ad_analytics_slot_id ON ad_analytics(slot_id);
CREATE INDEX idx_ad_analytics_timestamp ON ad_analytics(timestamp);
```

Then update the API routes to insert into this table.

## Adding New Ad Slots

1. Add slot definition to `lib/config/ads.ts`:

```typescript
export const AD_SLOTS: Record<string, AdSlot> = {
  // ... existing slots
  my_new_slot: {
    id: 'my_new_slot',
    name: 'My New Slot',
    description: 'Description of where this slot appears',
    defaultHeight: 300,
    defaultWidth: 300,
    lazyLoad: true
  }
}
```

2. Use the slot in your components:

```tsx
<AdSlotServer slotId="my_new_slot" />
```

## Migration to Supabase

To move from config file to Supabase:

1. Create `ads` table in Supabase:

```sql
CREATE TABLE ads (
  id TEXT PRIMARY KEY,
  slot_ids TEXT[] NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('house', 'affiliate', 'external')),
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  cta_label TEXT,
  destination_url TEXT,
  tracking_id TEXT,
  active BOOLEAN NOT NULL DEFAULT true,
  priority INTEGER DEFAULT 0,
  topics TEXT[],
  countries TEXT[],
  start_at TIMESTAMPTZ,
  end_at TIMESTAMPTZ,
  min_width INTEGER,
  max_width INTEGER,
  external_config JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

2. Update `lib/config/ads.ts` to fetch from Supabase:

```typescript
export async function getAdsConfig(): Promise<Ad[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('ads')
    .select('*')
    .eq('active', true)
  
  if (error) throw error
  return data || []
}
```

## Best Practices

1. **Use AdSlotServer** for most cases - it handles server-side context automatically
2. **Set default heights** to prevent layout shift
3. **Use lazy loading** for below-the-fold ads
4. **Test targeting** in development before deploying
5. **Monitor analytics** to optimize ad performance
6. **Use priority** to control which ads show more often
7. **Keep images optimized** - use Next.js Image component (already included)

## Future Enhancements

- [ ] Supabase integration for ads storage
- [ ] A/B testing support
- [ ] Frequency capping (limit impressions per user)
- [ ] Ad rotation algorithms
- [ ] Real-time analytics dashboard
- [ ] Ad preview/editor interface
- [ ] External ad network integrations (AdSense, Media.net)

