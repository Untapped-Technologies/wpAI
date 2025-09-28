'use client'
import { createClient } from '@/lib/supabase/client' // adjust to your path
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function LogoutPage() {
  const router = useRouter()

  useEffect(() => {
    const logout = async () => {
      const supabase = createClient()

      // Clear chat history
      try {
        await fetch('/api/chats', { method: 'DELETE' })
      } catch (error) {
        console.error('Failed to clear chat history:', error)
      }

      // Clear sidebar cookie
      if (typeof document !== 'undefined') {
        document.cookie =
          'sidebar:state=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
      }

      // Sign out from Supabase
      await supabase.auth.signOut()

      // Dispatch events to reset sidebar components
      window.dispatchEvent(new CustomEvent('chat-history-updated'))
      window.dispatchEvent(new CustomEvent('sidebar-reset'))

      // Force a full page reload to ensure sidebar updates
      window.location.href = '/auth/login'
    }

    logout()
  }, [router])
  return
  // return <p>Logging you out...</p>
}
