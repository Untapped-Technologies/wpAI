'use client'

import { userTypes } from '@/components/_constants/pageData/userTypes'
import { profileType } from '@/components/_constants/pages/signUp/signupTypes'
import { createClient } from '@/lib/supabase/client'
import { updateUserProfile } from '@/lib/utils/createOrUpdateUserProfile'
import SelectType from '../_custom/_common/selectType'
import TabHeaderTitle from '../_custom/_common/tabHeaderTitle'

export default function AccountTab({
  id,
  setOpen,
  formValues,
  setFormValues,
  showSaveToast
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
    showSaveToast('Account Info')
    setOpen(false)
  }
  return (
    <div className="space-y-4">
      <TabHeaderTitle title="Account Information" />

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
      <SelectType
        formValues={formValues}
        handleUserTypeChange={handleUserTypeChange}
        userTypes={userTypes}
      />
      <button
        className="flex justify-start rounded border border-[#254541] bg-[#254541] px-4 py-2 text-white hover:text-[#254541] hover:border-[#254541] hover:bg-white"
        onClick={handleSave}
      >
        Save
      </button>
    </div>
  )
}
