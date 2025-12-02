'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'

import { Button } from '@/components/ui/button'

type PaginationControlsProps = {
  page: number
  totalPages: number
}

export function PaginationControls({ page, totalPages }: PaginationControlsProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  if (totalPages <= 1) return null

  const setPage = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('page', String(newPage))
    router.replace(`${pathname}?${params.toString()}`)
  }

  const canPrev = page > 1
  const canNext = page < totalPages

  return (
    <div className="mt-6 flex items-center justify-between gap-4 border-t border-slate-200 pt-4">
      <div className="text-sm text-slate-600">
        Page <span className="font-semibold">{page}</span> of{' '}
        <span className="font-semibold">{totalPages}</span>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          disabled={!canPrev}
          onClick={() => canPrev && setPage(page - 1)}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          disabled={!canNext}
          onClick={() => canNext && setPage(page + 1)}
        >
          Next
        </Button>
      </div>
    </div>
  )
}



