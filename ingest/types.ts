export interface RssSource {
  id: string
  name: string
  url: string
  enabled: boolean
  category?: string
}

export interface RawRssItem {
  title?: string
  link?: string
  description?: string
  content?: string
  pubDate?: string
  guid?: string
  author?: string
  category?: string | string[]
  imageUrl?: string
  [key: string]: unknown
}

export interface NormalizedArticle {
  id: string
  title: string
  url: string
  content: string
  publishedAt: Date
  author?: string
  category?: string
  imageUrl?: string
  sourceId: string
  sourceName: string
  hash: string
}

export interface FetchRssOptions {
  timeout?: number
  maxItems?: number
}

export interface UploadImageOptions {
  bucket?: string
  folder?: string
}

export interface SaveToSupabaseOptions {
  table?: string
  upsert?: boolean
}
