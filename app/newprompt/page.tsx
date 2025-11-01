'use client'

import { useMemo } from 'react'

import { Chat } from '@/components/chat'

// Fast ID generation without importing heavy 'ai' package
function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
}

export default function NewPrompt() {
  // Generate ID on client side - don't block server rendering
  const id = useMemo(() => generateId(), [])
  
  // Don't block on models - let Chat component load them on client side
  return <Chat id={id} />
}
