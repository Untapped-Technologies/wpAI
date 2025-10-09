'use client'

import { createClient } from '@/lib/supabase/client'
import {
  checkDatabaseSchema,
  checkUserProfile
} from '@/lib/utils/checkDatabase'
import { useEffect, useState } from 'react'

export default function DebugDatabasePage() {
  const [results, setResults] = useState<any>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const runChecks = async () => {
      const supabase = createClient()

      // Check current user
      const {
        data: { user },
        error: userError
      } = await supabase.auth.getUser()

      const checks = {
        user: user
          ? { success: true, data: user }
          : { success: false, error: userError },
        databaseSchema: await checkDatabaseSchema(),
        userProfile: user
          ? await checkUserProfile(user.id)
          : { success: false, error: 'No user' }
      }

      setResults(checks)
      setLoading(false)
    }

    runChecks()
  }, [])

  if (loading) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">Database Debug</h1>
        <p>Running checks...</p>
      </div>
    )
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Database Debug Results</h1>

      <div className="space-y-6">
        <div className="bg-gray-100 p-4 rounded">
          <h2 className="text-lg font-semibold mb-2">Current User</h2>
          <pre className="text-sm overflow-auto">
            {JSON.stringify(results.user, null, 2)}
          </pre>
        </div>

        <div className="bg-gray-100 p-4 rounded">
          <h2 className="text-lg font-semibold mb-2">Database Schema Check</h2>
          <pre className="text-sm overflow-auto">
            {JSON.stringify(results.databaseSchema, null, 2)}
          </pre>
        </div>

        <div className="bg-gray-100 p-4 rounded">
          <h2 className="text-lg font-semibold mb-2">User Profile Check</h2>
          <pre className="text-sm overflow-auto">
            {JSON.stringify(results.userProfile, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  )
}
