'use client'

import { Fragment, ReactNode, useState } from 'react'

type TabItem = {
  label: string
  icon?: ReactNode
  content: ReactNode
}

type TabsProps = {
  tabs: TabItem[]
  userType: string
}

export default function Tabs({ tabs, userType }: TabsProps) {
  const [activeIndex, setActiveIndex] = useState(0)

  return (
    <div className="w-[800px]">
      <div className="flex gap-4 border-b">
        {tabs.map((tab, index) => (
          <Fragment key={index}>
            {tab.label === 'Candidates' &&
              userType === '3dad0f25-2b3b-491b-9e82-9f9e71adad6f' && (
                <button
                  key={index}
                  className={`flex items-center gap-1 px-4 py-2 text-sm font-medium ${
                    index === activeIndex
                      ? 'border-b-2 border-[#254541] text-[#254541]'
                      : 'text-gray-500 hover:text-gray-800'
                  }`}
                  onClick={() => setActiveIndex(index)}
                >
                  {tab.icon && tab.icon}
                  {tab.label}
                </button>
              )}
            {tab.label !== 'Candidates' && (
              <button
                key={index + tab.label}
                className={`flex items-center gap-1 px-4 py-2 text-sm font-medium ${
                  index === activeIndex
                    ? 'border-b-2 border-[#254541] text-[#254541]'
                    : 'text-gray-500 hover:text-gray-800'
                }`}
                onClick={() => setActiveIndex(index)}
              >
                {tab.icon && tab.icon}
                {tab.label}
              </button>
            )}
          </Fragment>
        ))}
      </div>

      <div className="mt-4">{tabs[activeIndex].content}</div>
    </div>
  )
}
