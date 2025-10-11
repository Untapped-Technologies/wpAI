'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

import { userTypes } from '@/components/_constants/pageData/userTypes'
import MainHeader from '@/components/_constants/pages/mainHeader'
import AccountTab from '@/components/ui/tabs/accountTab'
import BioTab from '@/components/ui/tabs/bioTab'
import CandidatesTab from '@/components/ui/tabs/candidatesTab'
import Tabs from '@/components/ui/tabs/index'
import NotificationsTab from '@/components/ui/tabs/notificationsTab'
import PreferencesTab from '@/components/ui/tabs/preferenceTab'
import { BellIcon, Landmark, MapPin, PencilIcon, UserIcon } from 'lucide-react'
import { toast } from 'sonner'

export default function UserProfilePage() {
  const [profile, setProfile] = useState<any>(null)
  const [userBio, setBio] = useState<any>(null)
  const [userID, setUserID] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [open, setOpen] = useState(false)
  const [formValues, setFormValues] = useState({
    display_name: '',
    email: '',
    user_type_id: ''
  })
  const [prefs, setPrefs] = useState({
    city: '',
    state: '',
    country: 'US',
    postalCode: '',
    timezone: '',
    smsNotifs: true,
    emailNotifs: true,
    avatar: ''
  })

  const router = useRouter()

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch('/api/user/profile')

        if (!response.ok) {
          if (response.status === 401) {
            router.push('/auth/login')
            return
          }
          throw new Error('Failed to fetch profile')
        }

        const result = await response.json()

        if (!result.success) {
          throw new Error('Failed to get profile data')
        }

        const data = result.data

        setFormValues({ ...formValues, ...data })
        setFormValues({
          ...formValues,
          email: data.email || '',
          display_name: data.display_name,
          user_type_id: data.user_type_id
        })
        setUserID(data.user_id)
        setBio(data.bio)
        setPrefs(data.preferences || {})
        setProfile(data)
        setLoading(false)
      } catch (error) {
        console.error('Error fetching profile:', error)
        router.push('/auth/login')
      }
    }

    fetchProfile()
  }, [router])

  function showSaveToast(val: string) {
    toast.success(`${val} Saved`)
  }

  const tabs = [
    {
      label: 'Account',
      icon: <UserIcon size={16} />,
      content: (
        <AccountTab
          formValues={formValues}
          id={userID}
          setOpen={setOpen}
          setFormValues={setFormValues}
          value={profile}
          userTypes={userTypes}
          showSaveToast={showSaveToast}
        />
      )
    },
    {
      label: 'Notifications',
      icon: <BellIcon size={16} />,
      content: (
        <NotificationsTab
          prefs={prefs}
          id={userID}
          setOpen={setOpen}
          setPrefs={setPrefs}
          userType=""
          showSaveToast={showSaveToast}
        />
      )
    },
    {
      label: 'Bio',
      icon: <PencilIcon size={16} />,
      content: (
        <BioTab
          bio={userBio}
          id={userID}
          setOpen={setOpen}
          setBio={setBio}
          showSaveToast={showSaveToast}
        />
      )
    },
    {
      label: 'Location',
      icon: <MapPin size={16} />,
      content: (
        <PreferencesTab
          prefs={prefs}
          id={userID}
          setOpen={setOpen}
          setPrefs={setPrefs}
          userType=""
          showSaveToast={showSaveToast}
        />
      )
    },
    {
      label: 'Candidates',
      icon: <Landmark size={16} />,
      content: (
        <CandidatesTab
          id={userID}
          setOpen={setOpen}
          setPrefs={setPrefs}
          prefs={prefs}
          userType="Pol"
          showSaveToast={showSaveToast}
        />
      )
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 w-full">
      <div className="max-w-4xl mx-auto mb-8">
        <MainHeader title="User Profile" />
        <Tabs tabs={tabs} userType={formValues.user_type_id} />
      </div>
    </div>
  )
}
