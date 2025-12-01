import type { FetchRssOptions, RawRssItem, RssSource } from './types.js'

export async function fetchRssFeed(
  source: RssSource,
  options?: FetchRssOptions
): Promise<RawRssItem[]> {
  return []
}

export async function fetchAllRssFeeds(
  sources: RssSource[],
  options?: FetchRssOptions
): Promise<Map<string, RawRssItem[]>> {
  return new Map()
}
