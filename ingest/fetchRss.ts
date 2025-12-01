import Parser from 'rss-parser'
import type { RawRssItem } from './types.js'

const parser = new Parser({
  customFields: {
    item: ['enclosure'],
  },
})

export async function fetchRssFeed(url: string): Promise<RawRssItem[]> {
  try {
    const feed = await parser.parseURL(url)

    if (!feed.items || feed.items.length === 0) {
      return []
    }

    const rawItems = feed.items
      .map((item) => {
        // Extract image URL from enclosure or media:content
        let imageUrl: string | undefined
        if (item.enclosure?.url && item.enclosure?.type?.startsWith('image/')) {
          imageUrl = item.enclosure.url
        } else {
          // Handle custom fields that may not be in the type definition
          const itemAny = item as unknown as Record<string, unknown>
          if (itemAny['media:content'] || itemAny['media:thumbnail']) {
            const mediaContent = itemAny['media:content'] as
              | { $?: { url?: string } }
              | undefined
            const mediaThumbnail = itemAny['media:thumbnail'] as
              | { $?: { url?: string } }
              | undefined
            imageUrl =
              mediaContent?.$?.url || mediaThumbnail?.$?.url || undefined
          } else if (itemAny['itunes:image']) {
            const itunesImage = itemAny['itunes:image'] as {
              $?: { href?: string }
            }
            imageUrl = itunesImage?.$?.href
          }
        }

        // Map RSS item to RawRssItem format
        const rawItem: RawRssItem = {
          title: item.title || '',
          url: item.link || '',
          summary: item.contentSnippet || item.content || undefined,
          publishedAt: item.pubDate || item.isoDate || undefined,
          imageUrl,
        }

        // Only return items with required fields
        if (!rawItem.title || !rawItem.url) {
          return null
        }

        return rawItem
      })
      .filter((item): item is RawRssItem => item !== null)

    return rawItems
  } catch (error) {
    console.error(`Error fetching RSS feed from ${url}:`, error)
    throw new Error(`Failed to fetch RSS feed from ${url}: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}
