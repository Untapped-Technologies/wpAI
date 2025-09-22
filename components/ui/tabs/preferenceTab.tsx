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

export default function PreferencesTab({
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
        Preferences
      </h2>

      <div className="flex flex-col gap-2">
        <input
          type="text"
          className="rounded border p-2 focus:outline-none focus:ring-[#254541] focus:ring-1 bg-white text-[#254541]"
          placeholder="City"
          name="city"
          value={prefs.city}
          onChange={handleChange}
        />
      </div>

      <div className="flex flex-col gap-2">
        <input
          type="text"
          className="rounded border p-2 focus:outline-none focus:ring-[#254541] focus:ring-1 bg-white text-[#254541]"
          placeholder="State"
          name="state"
          value={prefs.state}
          onChange={handleChange}
        />
      </div>

      <div className="flex flex-col gap-2">
        <input
          type="text"
          className="rounded border p-2 focus:outline-none focus:ring-[#254541] focus:ring-1 bg-white text-[#254541]"
          placeholder="Postal Code"
          name="postalCode"
          value={prefs.postalCode}
          onChange={handleChange}
        />
      </div>

      <div className="flex flex-col gap-2">
        <input
          type="text"
          className="rounded border p-2 focus:outline-none focus:ring-[#254541] focus:ring-1 bg-white text-[#254541]"
          value={prefs.country}
          name="country"
          onChange={handleChange}
        />
      </div>

      <button
        className="flex justify-start rounded border border-[#254541] bg-[#254541] px-4 py-2 text-white hover:text-[#254541] hover:border-[#254541] hover:bg-white"
        onClick={handleSave}
      >
        Save
      </button>
    </div>
  )
}
