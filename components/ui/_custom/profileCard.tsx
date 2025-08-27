export default function ProfileCard({
  title,
  subtitle,
  children
}: {
  title: string
  subtitle?: string
  children: React.ReactNode
}) {
  return (
    <div className="rounded-2xl shadow-md p-6 space-y-3 border border-gray-400">
      <div>
        <h2 className="text-lg font-semibold  text-blue-900">{title}</h2>
        {subtitle && <p className="text-sm  text-blue-800">{subtitle}</p>}
      </div>
      <div>{children}</div>
    </div>
  )
}
