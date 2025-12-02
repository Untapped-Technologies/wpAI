import Parser from 'rss-parser'
import type { RawRssItem } from './types.js'

const parser = new Parser({
  customFields: {
    item: ['enclosure'],
    feed: ['image'],
  },
})

export async function fetchRssFeed(url: string): Promise<RawRssItem[]> {
  try {
    const feed = await parser.parseURL(url)

    if (!feed.items || feed.items.length === 0) {
      return []
    }

    // Extract channel-level image as fallback
    // RSS 2.0 spec: <image><url>...</url><title>...</title><link>...</link></image>
    // This format is used by feeds like Al Jazeera and BBC World News
    let channelImageUrl: string | undefined
    const feedAny = feed as unknown as Record<string, unknown>
    
    // Try to extract image URL from feed.image
    if (feed.image) {
      const image = feed.image as { url?: string } | string | undefined
      if (typeof image === 'string') {
        channelImageUrl = image
      } else if (image && typeof image === 'object') {
        // RSS 2.0 image element has url, title, and link properties
        if ('url' in image && typeof image.url === 'string') {
          channelImageUrl = image.url
        }
      }
    }
    
    // Also check feedAny in case image is in custom fields or parsed differently
    if (!channelImageUrl && feedAny.image) {
      const image = feedAny.image as { url?: string } | string | undefined
      if (typeof image === 'string') {
        channelImageUrl = image
      } else if (image && typeof image === 'object') {
        // Handle various possible structures
        if ('url' in image && typeof image.url === 'string') {
          channelImageUrl = image.url
        } else if ('$' in image) {
          // Some parsers wrap attributes in $ object
          const attrs = (image as { $?: { url?: string } }).$
          channelImageUrl = attrs?.url
        }
      }
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

        // Fallback to channel-level image if no item-level image found
        if (!imageUrl && channelImageUrl) {
          imageUrl = channelImageUrl
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
