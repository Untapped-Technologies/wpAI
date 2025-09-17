'use client'

type UserType = {
  user: {
    smsNotifs: boolean
    emailNotifs: boolean
  }
}

export default function NotificationsTab({ user }: UserType) {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-[#254541] text-left">
        Notification Settings
      </h2>

      <div className="flex items-center gap-3 text-[#254541]">
        <input type="checkbox" id="emailNotifs" checked={user.emailNotifs} />
        <label htmlFor="emailNotifs">Email Notifications</label>
      </div>

      <div className="flex items-center gap-3 text-[#254541]">
        <input type="checkbox" id="smsNotifs" checked={user.smsNotifs} />
        <label htmlFor="smsNotifs text-[#254541]">SMS Notifications</label>
      </div>

      <button className="flex justify-start rounded border border-[#254541] bg-[#254541] px-4 py-2 text-white hover:text-[#254541] hover:border-[#254541] hover:bg-white">
        Save
      </button>
    </div>
  )
}
