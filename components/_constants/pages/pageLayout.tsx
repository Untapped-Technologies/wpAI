import { cn } from '@/lib/utils'
import { ReactNode } from 'react'

type PageLayoutType = {
  title: string
  children: ReactNode
}

const PageLayout = ({ title, children }: PageLayoutType) => {
  return (
    <div
      className={cn(
        'relative pt-20 flex h-full min-w-0 flex-1 flex-col overflow-auto',
        'items-center bg-gradient-to-b from-[#254541] to-[#192f2c]'
      )}
      data-testid="full-chat"
    >
      <div className="max-w-4xl py-10 rounded-xl bg-white flex flex-col gap-4 text-center">
        <div>
          <img src="/images/logos/logo.png" className="w-56 h-auto mx-auto" />
        </div>

        <div className="h-auto py-2 items-center text-left bg-gradient-to-r from-[#254541] via-white to-[#254541] from-20% via-50% to-80% text-gray-300 uppercase pl-12">
          {title}
        </div>
        <div className="grid grid-cols-1 gap-6 px-12">{children}</div>
      </div>
    </div>
  )
}

export default PageLayout
