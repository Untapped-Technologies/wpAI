import type { NormalizedArticle, RawRssItem, RssSource } from './types.js'

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
