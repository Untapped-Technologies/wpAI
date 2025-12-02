import type { NormalizedArticle, RawRssItem, RssSource } from './types.js'
import { extractState } from './utils/extractState.js'

/**
 * Normalizes a raw RSS item into a standardized article format
 * @param item - The raw RSS item to normalize
 * @param sourceName - The name of the RSS source
 * @returns A normalized article object
 */
export function normalizeRssItem(
  item: RawRssItem,
  sourceName: string
): NormalizedArticle {
  // Parse publishedAt to Date, fallback to null
  let publishedAt: Date | null = null
  const dateString = item.publishedAt || item.pubDate
  if (dateString) {
    const parsedDate = new Date(dateString)
    if (!isNaN(parsedDate.getTime())) {
      publishedAt = parsedDate
    }
  }

  // Get summary: use summary/contentSnippet/description/content, fallback to title
  const summary =
    item.summary ||
    (item as { contentSnippet?: string }).contentSnippet ||
    item.description ||
    item.content ||
    item.title ||
    null

  // externalId = URL (use link if url is missing)
  const externalId = item.url || item.link || null

  // Infer mainImageUrl from various sources
  let mainImageUrl: string | null = null

  // Check imageUrl field first
  if (item.imageUrl) {
    mainImageUrl = item.imageUrl
  } else {
    // Check for enclosure (common in RSS feeds)
    const itemAny = item as unknown as Record<string, unknown>
    const enclosure = itemAny.enclosure as
      | { url?: string; type?: string }
      | undefined
    if (enclosure?.url && enclosure?.type?.startsWith('image/')) {
      mainImageUrl = enclosure.url
    } else {
      // Check for media:content or media:thumbnail
      const mediaContent = itemAny['media:content'] as
        | { $?: { url?: string } }
        | undefined
      const mediaThumbnail = itemAny['media:thumbnail'] as
        | { $?: { url?: string } }
        | undefined
      if (mediaContent?.$?.url) {
        mainImageUrl = mediaContent.$.url
      } else if (mediaThumbnail?.$?.url) {
        mainImageUrl = mediaThumbnail.$.url
      } else if (itemAny['itunes:image']) {
        // Check for iTunes image
        const itunesImage = itemAny['itunes:image'] as {
          $?: { href?: string }
        }
        if (itunesImage?.$?.href) {
          mainImageUrl = itunesImage.$.href
        }
      }
    }
  }

  // Infer country = 'US' for now
  const country = 'US'

  // Extract state from title + summary + content
  const contentText = [
    item.title || '',
    summary || '',
    item.content || ''
  ].join(' ')
  const state = extractState(contentText)

  return {
    sourceName,
    externalId,
    title: item.title || '',
    url: item.url || item.link || '',
    summary: summary || null,
    author: item.author || null,
    publishedAt,
    mainImageUrl,
    country,
    state,
  }
}

export function normalizeArticle(
  item: RawRssItem,
  source: RssSource
): NormalizedArticle | null {
  return null
}

export function normalizeArticles(
  items: RawRssItem[],
  source: RssSource
): NormalizedArticle[] {
  return []
}

export function generateArticleHash(article: NormalizedArticle): string {
  return ''
}
