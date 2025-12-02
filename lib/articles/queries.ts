import { createClient } from '@/lib/supabase/server'

export type ArticleWithRelations = {
  id: string
  title: string
  summary: string | null
  imageUrl?: string
  topics: string[]
  country: string | null
  state: string | null
  publishedAt: string | null
  sourceName: string | null
  url: string | null
}

export type ArticleFilters = {
  topics?: string[]
  country?: string
  state?: string
  page?: number
  pageSize?: number
}

export type ArticleFilterOptions = {
  topics: string[]
  countries: string[]
  statesByCountry: Record<string, string[]>
}

export type PaginatedArticlesResult = {
  articles: ArticleWithRelations[]
  page: number
  pageSize: number
  total: number
  totalPages: number
}

const DEFAULT_PAGE_SIZE = 20

function buildArticleImageUrl(mainImagePath: string | null): string | undefined {
  if (!mainImagePath) return undefined

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  if (!supabaseUrl) return undefined

  try {
    const url = new URL(supabaseUrl)
    return `${url.origin}/storage/v1/object/public/article-media/${mainImagePath}`
  } catch {
    return undefined
  }
}

export async function fetchArticlesWithRelations(
  filters: ArticleFilters = {}
): Promise<PaginatedArticlesResult> {
  const supabase = await createClient()

  const page = filters.page && filters.page > 0 ? filters.page : 1
  const pageSize = filters.pageSize && filters.pageSize > 0 ? filters.pageSize : DEFAULT_PAGE_SIZE
  const from = (page - 1) * pageSize
  const to = from + pageSize - 1

  let query = supabase
    .from('articles')
    .select(
      `
        id,
        title,
        summary,
        main_image_storage_path,
        country,
        state,
        url,
        published_at,
        source_id,
        article_topics ( topic ),
        sources ( name )
      `,
      { count: 'exact' }
    )
    .order('published_at', { ascending: false })

  if (filters.country) {
    query = query.eq('country', filters.country)
  }

  if (filters.state) {
    query = query.eq('state', filters.state)
  }

  if (filters.topics && filters.topics.length > 0) {
    // Filter on joined article_topics table by topic
    query = query.in('article_topics.topic', filters.topics)
  }

  const { data, error, count } = await query.range(from, to)

  if (error) {
    console.error('Error fetching articles:', error)
    throw error
  }

  const rawArticles = (data ?? []) as any[]

  const articles: ArticleWithRelations[] = rawArticles.map(row => {
    const topics =
      Array.isArray(row.article_topics) && row.article_topics.length > 0
        ? row.article_topics
            .map((t: { topic?: string | null }) => t.topic)
            .filter((t: string | null | undefined): t is string => !!t)
        : []

    const sourceName =
      row.sources && typeof row.sources === 'object' ? row.sources.name ?? null : null

    return {
      id: row.id,
      title: row.title,
      summary: row.summary ?? null,
      imageUrl: buildArticleImageUrl(row.main_image_storage_path ?? null),
      topics,
      country: row.country ?? null,
      state: row.state ?? null,
      publishedAt: row.published_at ?? null,
      sourceName,
      url: row.url ?? null
    }
  })

  const safeCount = typeof count === 'number' ? count : articles.length
  const totalPages = Math.max(1, Math.ceil(safeCount / pageSize))

  return {
    articles,
    page,
    pageSize,
    total: safeCount,
    totalPages
  }
}

export async function fetchArticleFilterOptions(): Promise<ArticleFilterOptions> {
  const supabase = await createClient()

  const [topicsRes, locationsRes] = await Promise.all([
    supabase.from('article_topics').select('topic'),
    supabase.from('articles').select('country, state')
  ])

  if (topicsRes.error) {
    console.error('Error fetching article topics:', topicsRes.error)
  }

  if (locationsRes.error) {
    console.error('Error fetching article locations:', locationsRes.error)
  }

  const topicsSet = new Set<string>()
  const countriesSet = new Set<string>()
  const statesByCountry: Record<string, Set<string>> = {}

  ;(topicsRes.data ?? []).forEach(row => {
    if (row && typeof row.topic === 'string' && row.topic.trim().length > 0) {
      topicsSet.add(row.topic.trim())
    }
  })

  ;(locationsRes.data ?? []).forEach(row => {
    const country = row.country as string | null
    const state = row.state as string | null

    if (country && country.trim().length > 0) {
      const trimmedCountry = country.trim()
      countriesSet.add(trimmedCountry)

      if (state && state.trim().length > 0) {
        if (!statesByCountry[trimmedCountry]) {
          statesByCountry[trimmedCountry] = new Set<string>()
        }
        statesByCountry[trimmedCountry].add(state.trim())
      }
    }
  })

  return {
    topics: Array.from(topicsSet).sort((a, b) => a.localeCompare(b)),
    countries: Array.from(countriesSet).sort((a, b) => a.localeCompare(b)),
    statesByCountry: Object.fromEntries(
      Object.entries(statesByCountry).map(([country, states]) => [
        country,
        Array.from(states as Set<string>).sort((a, b) => a.localeCompare(b))
      ])
    )
  }
}



