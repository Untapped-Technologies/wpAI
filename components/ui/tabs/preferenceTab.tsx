'use client'

import CountrySelect from '../countrySelect'

type UserType = {
  user: {
    city: string
    state: string
    postalCode: string
    country: string
  }
}

export default function PreferencesTab({ user }: UserType) {
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
          value={user.city}
        />
      </div>

      <div className="flex flex-col gap-2">
        <input
          type="text"
          className="rounded border p-2 focus:outline-none focus:ring-[#254541] focus:ring-1 bg-white text-[#254541]"
          placeholder="State"
          value={user.state}
        />
      </div>

      <div className="flex flex-col gap-2">
        <input
          type="text"
          className="rounded border p-2 focus:outline-none focus:ring-[#254541] focus:ring-1 bg-white text-[#254541]"
          placeholder="Postal Code"
          value={user.postalCode}
        />
      </div>

      <div className="flex flex-col gap-2">
        <CountrySelect
          onChange={() => console.log('you go')}
          value={user.country}
          className={'text-[#254541]'}
        />
      </div>

      <button className="flex justify-start rounded border border-[#254541] bg-[#254541] px-4 py-2 text-white hover:text-[#254541] hover:border-[#254541] hover:bg-white text-[#254541]">
        Save
      </button>
    </div>
  )
}
