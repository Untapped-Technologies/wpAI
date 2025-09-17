// app/auth/oauth-callback/page.tsx
'use client'

import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function OAuthCallback() {
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const fetchUserAndRedirect = async () => {
      const supabase = createClient()

      const {
        data: { session },
        error: sessionError
      } = await supabase.auth.getSession()

      if (sessionError || !session?.user) {
        setError('Authentication failed')
        router.push('/auth/login?error=session')
        return
      }

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', session.user.id)
        .single()

      if (profileError || !profile) {
        setError('No profile found')
        router.push('/auth/login?error=profile')
        return
      }

      // Redirect with profile loaded
      router.push('/user/profile')
    }

    fetchUserAndRedirect()
  }, [router])

  return (
    <div className="p-6 text-center">
      <h2 className="text-lg font-bold">Processing login...</h2>
      {error && <p className="text-red-500 mt-4">{error}</p>}
    </div>
  )
}
