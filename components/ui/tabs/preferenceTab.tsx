'use client'
import { countries } from '@/components/_constants/pageData/countries'
import { UserType } from '@/components/_constants/pageData/pageTypes'
import { createClient } from '@/lib/supabase/client'
import { updateUserProfile } from '@/lib/utils/createOrUpdateUserProfile'

export default function PreferencesTab({
  id,
  prefs,
  setOpen,
  setPrefs,
  userType
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

    setPrefs({
      ...prefs,
      [name]: type === 'checkbox' ? checked : value
    })
  }

  const handleCountryChange = (evt: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = evt.target
    setPrefs({ ...prefs, [name]: value })
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
        Location
      </h2>

      <div className="flex flex-col gap-2 text-left">
        <label className="text-sm text-[#254541]">City</label>
        <input
          type="text"
          className="rounded border p-2 focus:outline-none focus:ring-[#254541] focus:ring-1 bg-white text-[#254541]"
          placeholder="City"
          name="city"
          value={prefs.city}
          onChange={handleChange}
        />
      </div>

      <div className="flex flex-col gap-2 text-left">
        <label className="text-sm text-[#254541]">State</label>
        <input
          type="text"
          className="rounded border p-2 focus:outline-none focus:ring-[#254541] focus:ring-1 bg-white text-[#254541]"
          placeholder="State"
          name="state"
          value={prefs.state}
          onChange={handleChange}
        />
      </div>

      <div className="flex flex-col gap-2 text-left">
        <label className="text-sm text-[#254541]">Postal Code</label>
        <input
          type="text"
          className="rounded border p-2 focus:outline-none focus:ring-[#254541] focus:ring-1 bg-white text-[#254541]"
          placeholder="Postal Code"
          name="postalCode"
          value={prefs.postalCode}
          onChange={handleChange}
        />
      </div>

      <div className="flex flex-col gap-2 text-left">
        <label className="text-sm text-[#254541]">Country</label>
        <div className="bg-white text-[#254541]">
          <select
            name="country"
            value={prefs.country || ''}
            onChange={handleCountryChange}
            className="w-full rounded border p-2 bg-white text-[#254541] focus:outline-none focus:ring-2 focus:ring-[#254541]"
          >
            <option value="" disabled>
              Select Country
            </option>
            {countries.map(type => (
              <option key={type.code} value={type.code}>
                {type.name}
              </option>
            ))}
          </select>
        </div>
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
