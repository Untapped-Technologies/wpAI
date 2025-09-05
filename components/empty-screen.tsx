import { ArrowRight } from 'lucide-react'

import { Button } from '@/components/ui/button'

const exampleMessages = [
  {
    heading: 'Biden vs Trump on Climate Policy',
    message:
      "Compare Biden and Trump's positions on climate change and clean energy."
  },
  {
    heading: 'What is the Green New Deal?',
    message:
      'What is the Green New Deal and which politicians supported or opposed it?'
  },
  {
    heading: 'Gun Control: Who Supports What?',
    message:
      'Which politicians support stronger gun control laws and how have they voted?'
  },
  {
    heading: 'Roe v. Wade Aftermath',
    message:
      'How have different states and politicians responded since the overturning of Roe v. Wade?'
  },
  {
    heading: 'Student Loan Forgiveness Debate',
    message:
      'What are the key political arguments for and against student loan forgiveness?'
  }
]

export function EmptyScreen({
  submitMessage,
  className
}: {
  submitMessage: (message: string) => void
  className?: string
}) {
  return (
    <div className={`mx-auto w-full transition-all ${className}`}>
      <div className="bg-background p-2">
        <div className="mt-2 flex flex-col items-start space-y-2 mb-4">
          {exampleMessages.map((message, index) => (
            <Button
              key={index}
              variant="link"
              className="h-auto p-0 text-base"
              name={message.message}
              onClick={async () => {
                submitMessage(message.message)
              }}
            >
              <ArrowRight size={16} className="mr-2 text-muted-foreground" />
              {message.heading}
            </Button>
          ))}
        </div>
      </div>
    </div>
  )
}
