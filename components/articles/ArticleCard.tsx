import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { ArticleWithRelations } from '@/lib/articles/queries'
import { Globe2, MapPin, Newspaper } from 'lucide-react'

type ArticleCardProps = {
  article: ArticleWithRelations
}

function truncate(text: string | null, maxLength: number): string {
  if (!text) return ''
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength - 1).trimEnd() + '…'
}

export function ArticleCard({ article }: ArticleCardProps) {
  const publishedDate = article.publishedAt
    ? new Date(article.publishedAt).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    : null
  const imgUrl = article.imageUrl;

  return (
    <Card className="flex flex-col overflow-hidden bg-white/80 backdrop-blur border-slate-200 shadow-sm hover:shadow-md transition-shadow">
      {imgUrl ? (
        <div className="relative w-full aspect-video overflow-hidden">
          <img
            src={imgUrl}
            alt={article.title}
            className="h-full w-full object-cover"
            loading="lazy"
          />
        </div>
      ) : (
        <div className="flex h-full w-full aspect-video items-center justify-center bg-slate-100 text-slate-400">
          <Newspaper className="h-10 w-10" />
        </div>
      )}

      <CardHeader className="space-y-3">
        <div className="flex flex-wrap gap-2">
          {article.topics.map(topic => (
            <Badge
              key={topic}
              variant="secondary"
              className="bg-emerald-50 text-emerald-800 border-emerald-100"
            >
              {topic}
            </Badge>
          ))}
        </div>
        <CardTitle className="text-xl font-semibold text-slate-900 line-clamp-2">
          {article.title}
        </CardTitle>
      </CardHeader>

      <CardContent className="flex-1 space-y-4 pt-0">
        {article.summary && (
          <p className="text-sm text-slate-700 leading-relaxed line-clamp-4">
            {truncate(article.summary, 180)}
          </p>
        )}

        <div className="flex flex-wrap gap-3 text-xs text-slate-600">
          {(article.country || article.state) && (
            <div className="inline-flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5 text-slate-500" />
              <span className="font-medium">
                {article.state && article.country
                  ? `${article.state}, ${article.country}`
                  : article.state || article.country}
              </span>
            </div>
          )}

          {article.sourceName && (
            <div className="inline-flex items-center gap-1.5">
              <Newspaper className="h-3.5 w-3.5 text-slate-500" />
              <span>{article.sourceName}</span>
            </div>
          )}

          {publishedDate && (
            <div className="inline-flex items-center gap-1.5">
              <Globe2 className="h-3.5 w-3.5 text-slate-500" />
              <span>{publishedDate}</span>
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter className="mt-auto flex justify-between items-center gap-2">
        <div className="text-xs text-slate-500">
          {article.url && new URL(article.url).hostname}
        </div>

        <Button
          asChild
          size="sm"
          className="ml-auto bg-[#254541] hover:bg-[#1d3530]"
        >
          <a href={article.url ?? '#'} target="_blank" rel="noopener noreferrer">
            Read More
          </a>
        </Button>
      </CardFooter>
    </Card>
  )
}



