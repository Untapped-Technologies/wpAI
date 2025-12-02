'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'

import { Badge } from '@/components/ui/badge'

type TopicFilterProps = {
  availableTopics: string[]
  selectedTopics: string[]
}

export function TopicFilter({
  availableTopics,
  selectedTopics
}: TopicFilterProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const handleToggleTopic = (topic: string) => {
    const params = new URLSearchParams(searchParams.toString())

    const current = params.get('topics')
    const currentTopics = current
      ? current.split(',').filter(Boolean)
      : ([] as string[])

    const exists = currentTopics.includes(topic)
    const nextTopics = exists
      ? currentTopics.filter(t => t !== topic)
      : [...currentTopics, topic]

    if (nextTopics.length === 0) {
      params.delete('topics')
    } else {
      params.set('topics', nextTopics.join(','))
      // Reset to first page when filters change
      params.set('page', '1')
    }

    router.replace(`${pathname}?${params.toString()}`)
  }

  if (!availableTopics.length) return null

  return (
    <div className="space-y-2">
      <div className="text-sm font-medium text-slate-800">Topics</div>
      <div className="flex flex-wrap gap-2">
        {availableTopics.map(topic => {
          const isActive = selectedTopics.includes(topic)
          return (
            <button
              key={topic}
              type="button"
              onClick={() => handleToggleTopic(topic)}
              className="focus:outline-none"
            >
              <Badge
                variant={isActive ? 'default' : 'secondary'}
                className={
                  isActive
                    ? 'bg-[#254541] text-white border-[#254541]'
                    : 'bg-slate-100 text-slate-800 border-slate-200 hover:bg-slate-200'
                }
              >
                {topic}
              </Badge>
            </button>
          )
        })}
      </div>
    </div>
  )
}



