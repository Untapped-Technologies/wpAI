import AuthAwareFooter from '@/components/auth-aware-footer'
import AuthAwareNavigation from '@/components/auth-aware-navigation'
import MainHeader from '@/components/_constants/pages/mainHeader'
import { ArticleCard } from '@/components/articles/ArticleCard'
import { CountryFilter } from '@/components/articles/CountryFilter'
import { PaginationControls } from '@/components/articles/PaginationControls'
import { TopicFilter } from '@/components/articles/TopicFilter'
import {
  ArticleFilters,
  fetchArticleFilterOptions,
  fetchArticlesWithRelations
} from '@/lib/articles/queries'

type RawSearchParams = {
  [key: string]: string | string[] | undefined
}

function parseArticleFilters(searchParams: RawSearchParams): ArticleFilters {
  const pageParam = searchParams.page
  const topicsParam = searchParams.topics
  const countryParam = searchParams.country
  const stateParam = searchParams.state

  const page =
    typeof pageParam === 'string' ? Number.parseInt(pageParam, 10) || 1 : 1

  const topicsValue =
    typeof topicsParam === 'string'
      ? topicsParam
      : Array.isArray(topicsParam)
        ? topicsParam[0]
        : ''

  const topics =
    topicsValue
      .split(',')
      .map(t => t.trim())
      .filter(Boolean) ?? []

  const country =
    typeof countryParam === 'string' && countryParam.length > 0
      ? countryParam
      : undefined

  const state =
    typeof stateParam === 'string' && stateParam.length > 0
      ? stateParam
      : undefined

  return {
    page,
    pageSize: 20,
    topics,
    country,
    state
  }
}

export default async function ArticlesPage(props: {
  searchParams: Promise<RawSearchParams>
}) {
  const searchParams = await props.searchParams
  const filters = parseArticleFilters(searchParams)

  const [articlesResult, filterOptions] = await Promise.all([
    fetchArticlesWithRelations(filters),
    fetchArticleFilterOptions()
  ])

  const selectedTopics = filters.topics ?? []
  const selectedCountry = filters.country
  const selectedState = filters.state

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 w-full">
      <AuthAwareNavigation />

      <main className="mx-auto max-w-6xl px-4 pb-12 pt-6 sm:px-6 lg:px-8">
        <MainHeader title="Articles" subTitle="Explore the latest political analysis and reporting from trusted sources." />

        <section className="mt-4 rounded-xl bg-white/80 p-4 shadow-sm ring-1 ring-slate-200 sm:p-6 space-y-6">
          <div className="grid gap-6 md:grid-cols-[2fr,3fr] items-start">
            <TopicFilter
              availableTopics={filterOptions.topics}
              selectedTopics={selectedTopics}
            />

            <CountryFilter
              countries={filterOptions.countries}
              statesByCountry={filterOptions.statesByCountry}
              selectedCountry={selectedCountry}
              selectedState={selectedState}
            />
          </div>
        </section>

        <section className="mt-8 space-y-6">
          {articlesResult.articles.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-300 bg-white/60 p-10 text-center text-slate-600">
              <p className="text-base font-medium">
                No articles found for the selected filters.
              </p>
              <p className="mt-2 text-sm">
                Try broadening your topic, country, or state selection.
              </p>
            </div>
          ) : (
            <>
              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {articlesResult.articles.map(article => (
                  <ArticleCard key={article.id} article={article} />
                ))}
              </div>

              <PaginationControls
                page={articlesResult.page}
                totalPages={articlesResult.totalPages}
              />
            </>
          )}
        </section>
      </main>

      <AuthAwareFooter />
    </div>
  )
}



