'use client'
import { countries } from '@/components/_constants/pageData/countries'
import { UserType } from '@/components/_constants/pageData/pageTypes'
import { toast } from 'sonner'
import TabHeaderTitle from '../_custom/_common/tabHeaderTitle'

export default function PreferencesTab({
  id,
  prefs,
  setOpen,
  setPrefs,
  userType,
  showSaveToast
}: UserType) {
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

  const handlePostalCodeLookup = async (postalCode: string) => {
    if (!postalCode || postalCode.length < 5) {
      return // Don't look up if postal code is too short (need at least 5 digits)
    }

    try {
      const response = await fetch(
        `/api/location/postal-code?code=${postalCode}`
      )

      // Check if response is OK before parsing
      if (!response.ok) {
        if (response.status === 404) {
          // Postal code not found - silently ignore, user can fill manually
          console.log('Postal code not found in database')
        }
        return
      }

      const result = await response.json()

      if (result.success && result.data) {
        const { city, state, country } = result.data

        // Auto-populate the location fields
        setPrefs({
          ...prefs,
          city: city || prefs.city,
          state: state || prefs.state,
          country: country || prefs.country
        })

        toast.success('Location information auto-filled!')
      }
    } catch (error) {
      console.error('Failed to lookup postal code:', error)
      // Don't show error toast to avoid annoying the user
    }
  }

  const handleSave = async () => {
    setOpen(true)

    try {
      const response = await fetch('/api/user/profile', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          preferences: prefs
        })
      })

      if (!response.ok) {
        throw new Error('Failed to update preferences')
      }

      const result = await response.json()

      if (!result.success) {
        throw new Error('Failed to update preferences')
      }

      showSaveToast('Location')
    } catch (error) {
      console.error('Error updating preferences:', error)
      // Handle error appropriately
    } finally {
      setOpen(false)
    }
  }

  return (
    <div className="space-y-4">
      <TabHeaderTitle title="Location" />

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
          onChange={evt => {
            handleChange(evt)
            // Auto-populate location data when postal code changes
            handlePostalCodeLookup(evt.target.value)
          }}
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
