export interface RssSource {
  id: string
  name: string
  url: string
  enabled: boolean
  category?: string
  icon?: string
}

export interface RawRssItem {
  title: string
  url: string
  summary?: string
  publishedAt?: string
  imageUrl?: string
  link?: string
  description?: string
  content?: string
  pubDate?: string
  guid?: string
  author?: string
  category?: string | string[]
  [key: string]: unknown
}

export interface NormalizedArticle {
  sourceName: string
  externalId: string | null
  title: string
  url: string
  summary: string | null
  author: string | null
  publishedAt: Date | null
  mainImageUrl: string | null
  country: string | null
  state: string | null
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
