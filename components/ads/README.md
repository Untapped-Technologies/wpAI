# Ads Components - Usage Examples

## Basic Usage

### Homepage with Top Banner Ad

```tsx
import { AdSlotServer } from '@/components/ads'

export default function HomePage() {
  return (
    <div>
      <AdSlotServer slotId="homepage_top" />
      {/* Rest of your content */}
    </div>
  )
}
```

### Sidebar with Multiple Ads

```tsx
import { AdSlotServer } from '@/components/ads'

export default function Sidebar() {
  return (
    <aside>
      <AdSlotServer slotId="sidebar_1" />
      <AdSlotServer slotId="sidebar_2" />
    </aside>
  )
}
```

### Article with Inline Ads

```tsx
import { AdSlotServer } from '@/components/ads'

export default function ArticlePage() {
  return (
    <article>
      <h1>Article Title</h1>
      <p>First paragraph...</p>
      
      <AdSlotServer slotId="article_inline_1" className="my-8" />
      
      <p>More content...</p>
      
      <AdSlotServer slotId="article_inline_2" className="my-8" />
      
      <p>Final paragraph...</p>
    </article>
  )
}
```

### With Custom Context (Topic Targeting)

```tsx
import { AdSlotServer } from '@/components/ads'

export default function ElectionsPage() {
  return (
    <div>
      <AdSlotServer 
        slotId="homepage_top"
        context={{
          topics: ['elections', 'politics']
        }}
      />
    </div>
  )
}
```

### With Custom Dimensions

```tsx
import { AdSlotServer } from '@/components/ads'

export default function CustomAdPage() {
  return (
    <div>
      <AdSlotServer 
        slotId="homepage_top"
        height={300}
        width={728}
        className="mx-auto"
      />
    </div>
  )
}
```

## Advanced: Client-Side Control

If you need more control, use the client component directly:

```tsx
'use client'
import { AdSlot } from '@/components/ads'
import { getAdsConfig } from '@/lib/config/ads'

export default async function CustomAdPage() {
  const ads = await getAdsConfig()
  
  return (
    <div>
      <AdSlot
        slotId="homepage_top"
        ads={ads}
        context={{
          topics: ['politics'],
          country: 'US'
        }}
      />
    </div>
  )
}
```

