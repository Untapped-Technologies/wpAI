'use client'
type BioType = {
  bio: string
}

export default function BioTab({ bio }: BioType) {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-[#254541] text-left">Bio</h2>

      <div className="flex flex-col gap-2">
        <textarea
          className="rounded border p-2 bg-white text-[#254541]"
          rows={4}
          placeholder="Tell us a little about yourself..."
          value={bio}
        ></textarea>
      </div>

      <button className="flex justify-start rounded border border-[#254541] bg-[#254541] px-4 py-2 text-white hover:text-[#254541] hover:border-[#254541] hover:bg-white">
        Save
      </button>
    </div>
  )
}
