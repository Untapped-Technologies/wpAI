'use client'

import { createClient } from '@/lib/supabase/client'
import { updateUserProfile } from '@/lib/utils/createOrUpdateUserProfile'

type profileType = {
  name: string
  email: string
  id: string
  setUserName: (val: string) => void
  setOpen: (val: boolean) => void
}

export default function AccountTab({
  email,
  name,
  id,
  setUserName,
  setOpen
}: profileType) {
  const supabase = createClient()

  const handleChange = evt => {
    evt.preventDefault()
    setUserName(evt.target.value)
  }

  const handleSave = async () => {
    setOpen(true)
    await updateUserProfile(supabase, id, {
      display_name: name
    })
    setOpen(false)
  }
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-left text-[#254541]">
        Account Information
      </h2>

      <div className="flex flex-col gap-2 text-left">
        <label className="text-sm text-[#254541]">Name</label>
        <input
          type="text"
          className="rounded border p-2 focus:outline-none focus:ring-[#254541] focus:ring-1 bg-white text-[#254541]"
          placeholder="John Doe"
          value={name}
          onChange={evt => handleChange(evt)}
        />
      </div>

      <div className="flex flex-col gap-2 text-left">
        <label className="text-sm text-[#254541]">Email Address</label>
        <div className="disabled rounded border p-2 bg-white text-[#254541]">
          {email}
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
