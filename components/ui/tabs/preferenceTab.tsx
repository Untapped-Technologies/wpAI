'use client'

import CountrySelect from '../countrySelect'

export default function PreferencesTab() {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-[#254541] text-left">
        Preferences
      </h2>

      <div className="flex flex-col gap-2">
        <input
          type="text"
          className="rounded border p-2 focus:outline-none focus:ring-[#254541] focus:ring-1 bg-white"
          placeholder="City"
        />
      </div>

      <div className="flex flex-col gap-2">
        <input
          type="text"
          className="rounded border p-2 focus:outline-none focus:ring-[#254541] focus:ring-1 bg-white"
          placeholder="State"
        />
      </div>

      <div className="flex flex-col gap-2">
        <input
          type="text"
          className="rounded border p-2 focus:outline-none focus:ring-[#254541] focus:ring-1 bg-white"
          placeholder="Postal Code"
        />
      </div>

      <div className="flex flex-col gap-2">
        <CountrySelect onChange={() => console.log('you go')} />
      </div>

      <button className="flex justify-start rounded border border-[#254541] bg-[#254541] px-4 py-2 text-white hover:text-[#254541] hover:border-[#254541] hover:bg-white">
        Save
      </button>
    </div>
  )
}
