'use client'
import { PrefType, UserType } from '@/components/_constants/pageData/pageTypes'
import TabHeaderTitle from '../_custom/_common/tabHeaderTitle'

export default function NotificationsTab({
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

    interface SetPrefs {
      (prev: PrefType): PrefType
    }

    setPrefs({
      ...prefs,
      [name]: type === 'checkbox' ? checked : value
    })
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
        throw new Error('Failed to update notifications')
      }

      const result = await response.json()

      if (!result.success) {
        throw new Error('Failed to update notifications')
      }

      showSaveToast('Notifications')
    } catch (error) {
      console.error('Error updating notifications:', error)
      // Handle error appropriately
    } finally {
      setOpen(false)
    }
  }

  return (
    <div className="space-y-4">
      <TabHeaderTitle title="Notification Settings" />

      <div className="flex items-center gap-3 text-[#254541]">
        <input
          type="checkbox"
          id="emailNotifs"
          name="emailNotifs"
          checked={prefs.emailNotifs}
          onChange={handleChange}
        />
        <label htmlFor="emailNotifs">Email Notifications</label>
      </div>

      {/* <div className="flex items-center gap-3 text-[#254541]">
        <input
          type="checkbox"
          id="smsNotifs"
          name="smsNotifs"
          checked={prefs.smsNotifs}
          onChange={handleChange}
        />
        <label htmlFor="smsNotifs text-[#254541]">SMS Notifications</label>
      </div> */}

      <button
        className="flex justify-start rounded border border-[#254541] bg-[#254541] px-4 py-2 text-white hover:text-[#254541] hover:border-[#254541] hover:bg-white"
        onClick={handleSave}
      >
        Save
      </button>
    </div>
  )
}
