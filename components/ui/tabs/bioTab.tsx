'use client'

export default function BioTab() {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-[#254541] text-left">Bio</h2>

      <div className="flex flex-col gap-2">
        <label className="text-sm text-[#254541] text-left">Short Bio</label>
        <textarea
          className="rounded border p-2"
          rows={4}
          placeholder="Tell us a little about yourself..."
        ></textarea>
      </div>

      <button className="rounded border border-[#254541] bg-[#254541] px-4 py-2 text-white hover:text-[#254541] hover:border-[#254541] hover:bg-white">
        Save
      </button>
    </div>
  )
}
