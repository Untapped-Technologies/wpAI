'use client'

import CountrySelect from '../countrySelect'

export default function PreferencesTab() {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-[#254541] text-left">
        Preferences
      </h2>

      <div className="flex flex-col gap-2">
        <label className="text-sm text-[#254541] text-left">Country</label>
        <CountrySelect onChange={() => console.log('you go')} />
      </div>

      <button className="rounded border border-[#254541] bg-[#254541] px-4 py-2 text-white hover:text-[#254541] hover:border-[#254541] hover:bg-white">
        Save
      </button>
    </div>
  )
}
