'use client'

import { lazy, Suspense, useMemo } from 'react'

// Lazy load Chat component to avoid blocking initial page load
const Chat = lazy(() =>
  import('@/components/chat').then(mod => ({ default: mod.Chat }))
)

// Fast ID generation without importing heavy 'ai' package
function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
}

// Minimal loading fallback for instant page render
function ChatLoadingFallback() {
  return (
    <div className="flex h-full min-w-0 flex-1 flex-col items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
        <p className="mt-4 text-sm text-muted-foreground">Loading chat...</p>
      </div>
    </div>
  )
}

export default function NewPrompt() {
  // Generate ID on client side - don't block server rendering
  const id = useMemo(() => generateId(), [])

  // Lazy load Chat component with Suspense for instant page render
  return (
    <Suspense fallback={<ChatLoadingFallback />}>
      <Chat id={id} />
    </Suspense>
  )
}
