'use client'
import { createClient } from '@/lib/supabase/client'
import { updateUserProfile } from '@/lib/utils/createOrUpdateUserProfile'

type BioType = {
  bio: string
  id: string
  setOpen: (val: boolean) => void
  setBio: (val: string) => void
}

export default function BioTab({ bio, setOpen, id, setBio }: BioType) {
  const supabase = createClient()

  interface ChangeEvent {
    preventDefault: () => void
    target: {
      value: string
    }
  }

  const handleChange = (evt: ChangeEvent) => {
    evt.preventDefault()
    setBio(evt.target.value)
  }

  const handleSave = async () => {
    setOpen(true)
    await updateUserProfile(supabase, id, {
      bio: bio
    })
    setOpen(false)
  }
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-[#254541] text-left">Bio</h2>

      <div className="flex flex-col gap-2">
        <textarea
          className="rounded border p-2 bg-white text-[#254541]"
          rows={4}
          placeholder="Tell us a little about yourself..."
          value={bio}
          onChange={handleChange}
        ></textarea>
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
