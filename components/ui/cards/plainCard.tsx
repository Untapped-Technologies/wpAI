// components/ui/Card.tsx
import { ReactNode } from 'react'

type CardProps = {
  header?: ReactNode
  children: ReactNode
  footer?: ReactNode
  classes?: string
}

export default function PlainCard({
  header,
  children,
  footer,
  classes
}: CardProps) {
  return (
    <div
      className={`h-full bg-white dark:bg-neutral-800 flex flex-col ${classes}`}
    >
      {header && <div className="text-left ml-1 py-2 text-xl">{header}</div>}

      <div className="flex-1 overflow-auto min-h-52">{children}</div>

      {footer && <div className="text-left mt-10">{footer}</div>}
    </div>
  )
}
