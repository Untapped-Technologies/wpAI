'use client'

export default function AccountTab() {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-left text-[#254541]">
        Account Information
      </h2>

      <div className="flex flex-col gap-2 text-left">
        <label className="text-sm text-[#254541]">Name</label>
        <input
          type="text"
          className="rounded border p-2 focus:outline-none focus:ring-[#254541] focus:ring-1"
          placeholder="John Doe"
        />
      </div>

      <div className="flex flex-col gap-2 text-left">
        <label className="text-sm text-[#254541]">Email Address</label>
        <input
          type="email"
          className="rounded border p-2 focus:outline-none focus:ring-[#254541] focus:ring-1"
          placeholder="john@example.com"
        />
      </div>

      <button className="rounded border border-[#254541] bg-[#254541] px-4 py-2 text-white hover:text-[#254541] hover:border-[#254541] hover:bg-white">
        Save
      </button>
    </div>
  )
}
