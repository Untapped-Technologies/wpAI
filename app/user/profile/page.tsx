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
import { toast } from 'sonner'

export default function UserProfilePage() {
  const [profile, setProfile] = useState<any>(null)
  const [userEmail, setUserEmail] = useState<any>(null)
  const [userName, setUserName] = useState<any>(null)
  const [userBio, setBio] = useState<any>(null)
  const [userID, setUserID] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [open, setOpen] = useState(false)

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
      setUserID(session.user.id)
      setUserName(data.display_name)
      setBio(data.bio)
      setProfile(data)
      setLoading(false)
    }

    fetchProfile()
  }, [router])

  const tabs = [
    {
      label: 'Account',
      icon: <UserIcon size={16} />,
      content: (
        <AccountTab
          name={userName}
          email={userEmail}
          id={userID}
          setUserName={setUserName}
          setOpen={setOpen}
        />
      )
    },
    {
      label: 'Notifications',
      icon: <BellIcon size={16} />,
      content: <NotificationsTab user={profile?.preferences} />
    },
    {
      label: 'Bio',
      icon: <PencilIcon size={16} />,
      content: (
        <BioTab bio={userBio} id={userID} setOpen={setOpen} setBio={setBio} />
      )
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
      {open ? toast('Updates Saved') : null}
    </PageLayout>
  )
}
