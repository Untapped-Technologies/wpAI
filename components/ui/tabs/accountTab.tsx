'use client'

import { createClient } from '@/lib/supabase/client'
import { updateUserProfile } from '@/lib/utils/createOrUpdateUserProfile'

const accountTypes = [
  {
    id: 1,
    value: '77503f6f-c160-4cca-9d13-70f08e09fcc4',
    label: 'Citizen'
  },
  {
    id: 2,
    value: '3dad0f25-2b3b-491b-9e82-9f9e71adad6f',
    label: 'Politician'
  },
  {
    id: 3,
    value: 'e20f639b-e615-480c-8c84-abe3d8f8e512',
    label: 'Student'
  }
]

type profileType = {
  formValues: {
    display_name: string
    email: string
    user_type_id: string
  }
  id: string
  value: string
  setOpen: (val: boolean) => void
  setFormValues: (val: string) => void
}

export default function AccountTab({
  id,
  setOpen,
  formValues,
  setFormValues
}: profileType) {
  const supabase = createClient()

  const handleChange = (evt: React.ChangeEvent<HTMLInputElement>): void => {
    evt.preventDefault()
    const { name, value } = evt.target as HTMLInputElement
    setFormValues(prev => ({ ...prev, [name]: value }))
  }

  const handleUserTypeChange = (evt: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = evt.target
    setFormValues(prev => ({ ...prev, [name]: value }))
  }

  const handleSave = async () => {
    setOpen(true)

    await updateUserProfile(supabase, id, {
      display_name: formValues.display_name,
      user_type_id: formValues.user_type_id
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
          name="display_name"
          className="rounded border p-2 focus:outline-none focus:ring-[#254541] focus:ring-1 bg-white text-[#254541]"
          placeholder="John Doe"
          value={formValues.display_name}
          onChange={handleChange}
        />
      </div>

      <div className="flex flex-col gap-2 text-left">
        <label className="text-sm text-[#254541]">Email Address</label>
        <div className="disabled rounded border p-2 bg-white text-[#254541]">
          {formValues.email}
        </div>
      </div>

      <div className="flex flex-col gap-2 text-left">
        <label className="text-sm text-[#254541]">Account Type</label>
        <div className="bg-white text-[#254541]">
          <select
            name="user_type_id"
            value={formValues.user_type_id || ''}
            onChange={handleUserTypeChange}
            className="w-full rounded border p-2 bg-white text-[#254541] focus:outline-none focus:ring-2 focus:ring-[#254541]"
          >
            <option value="" disabled>
              Select account type
            </option>
            {accountTypes.map(type => (
              <option key={type.id} value={type.value}>
                {type.label}
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
