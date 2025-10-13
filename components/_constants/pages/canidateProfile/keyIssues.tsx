'use client'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { Target } from 'lucide-react'

interface KeyIssuesProps {
  keyIssues: Array<{
    title: string
    content: string
    color: string
    icon: React.ReactNode
  }>
  getColorClasses: (color: string) => {
    bg: string
    text: string
    content: string
    border: string
  }
}

export default function KeyIssues({
  keyIssues,
  getColorClasses
}: KeyIssuesProps) {
  return (
    <Card className="shadow-lg border-0">
      <CardHeader className="bg-white">
        <CardTitle className="flex items-center text-2xl">
          <Target className="w-6 h-6 mr-3" />
          Key Issues
        </CardTitle>
        <CardDescription className="text-lg">
          The top priorities I'll focus on if elected
        </CardDescription>
      </CardHeader>
      <CardContent className="p-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {keyIssues.map((issue, index) => {
            if (!issue.content) return null

            const colors = getColorClasses(issue.color)

            return (
              <div
                key={index}
                className={`${colors.bg} ${colors.border} p-6 rounded-xl border-2 hover:shadow-md transition-shadow`}
              >
                <div className={`flex items-center ${colors.text} mb-3`}>
                  {issue.icon}
                  <h4 className="font-bold ml-2">{issue.title}</h4>
                </div>
                <p className={`${colors.content} leading-relaxed`}>
                  {issue.content}
                </p>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
