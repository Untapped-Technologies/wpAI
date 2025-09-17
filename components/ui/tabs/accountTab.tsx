'use client'

type profileType = {
  name: string
  email: string
}

export default function AccountTab({ email, name }: profileType) {
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
        />
      </div>

      <div className="flex flex-col gap-2 text-left">
        <label className="text-sm text-[#254541]">Email Address</label>
        <input
          type="email"
          className="rounded border p-2 focus:outline-none focus:ring-[#254541] focus:ring-1 bg-white text-[#254541]"
          placeholder="john@example.com"
          value={email}
        />
      </div>

      <button className="flex justify-start rounded border border-[#254541] bg-[#254541] px-4 py-2 text-white hover:text-[#254541] hover:border-[#254541] hover:bg-white">
        Save
      </button>
    </div>
  )
}
