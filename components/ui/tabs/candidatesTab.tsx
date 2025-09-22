'use client'
import { createClient } from '@/lib/supabase/client'
import { updateUserProfile } from '@/lib/utils/createOrUpdateUserProfile'

type PrefType = {
  city: string
  state: string
  country: string
  postalCode: string
  timezone: string
  smsNotifs: boolean
  emailNotifs: boolean
}

type UserType = {
  id: string
  setOpen: (val: boolean) => void
  setPrefs: (val: PrefType) => void
  prefs: PrefType
}

export default function CandidatesTab({
  id,
  prefs,
  setOpen,
  setPrefs
}: UserType) {
  const supabase = createClient()

  interface ChangeEvent {
    preventDefault: () => void
    target: {
      name: string
      value: string
    }
  }

  const handleChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    const { name, type, value, checked } = evt.target

    setPrefs(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleSave = async () => {
    setOpen(true)
    await updateUserProfile(supabase, id, {
      preferences: prefs
    })
    setOpen(false)
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-[#254541] text-left">
        Candidates
      </h2>
      <div className="text-black">Candidate information goes here</div>
    </div>
  )
}
