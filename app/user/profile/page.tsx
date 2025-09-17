'use client'

import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

import PageLayout from '@/components/_constants/pages/pageLayout'
import Tabs from '@/components/ui/tabs'
import AccountTab from '@/components/ui/tabs/accountTab'
import BioTab from '@/components/ui/tabs/bioTab'
import NotificationsTab from '@/components/ui/tabs/notificationsTab'
import PreferencesTab from '@/components/ui/tabs/preferenceTab'
import { BellIcon, PencilIcon, SettingsIcon, UserIcon } from 'lucide-react'

export default function UserProfilePage() {
  const [profile, setProfile] = useState<any>(null)
  const [userEmail, setUserEmail] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const fetchProfile = async () => {
      const supabase = createClient()

      const {
        data: { session }
      } = await supabase.auth.getSession()

      if (!session?.user) {
        router.push('/auth/login')
        return
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', session.user.id)
        .single()

      if (error || !data) {
        console.error('Profile fetch error:', error)
        router.push('/auth/login')
        return
      }
      setUserEmail(session.user.email)
      setProfile(data)
      setLoading(false)
    }

    fetchProfile()
  }, [router])

  const tabs = [
    {
      label: 'Account',
      icon: <UserIcon size={16} />,
      content: <AccountTab name={profile?.display_name} email={userEmail} />
    },
    {
      label: 'Notifications',
      icon: <BellIcon size={16} />,
      content: <NotificationsTab user={profile?.preferences} />
    },
    {
      label: 'Bio',
      icon: <PencilIcon size={16} />,
      content: <BioTab bio={profile?.bio} />
    },
    {
      label: 'Preferences',
      icon: <SettingsIcon size={16} />,
      content: <PreferencesTab user={profile?.preferences} />
    }
  ]
  return (
    <PageLayout title="User Profile">
      <Tabs tabs={tabs} />
    </PageLayout>
  )
}
