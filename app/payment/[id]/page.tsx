import PaymentClient from '@/components/_constants/payment/paymentClient'
import { cn } from '@/lib/utils'

export default async function PaymentPage({
  params
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  return (
    <div
      className={cn(
        'relative flex h-full min-w-0 flex-1 flex-col',
        'items-center justify-center'
      )}
      data-testid="full-chat"
    >
      <div className="min-h-screen p-4 md:p-10 overflow-auto">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Top Profile Card */}
          <div className="relative max-w-4xl sm:mx-auto sm:max-w-xl sm:text-center md:max-w-4xl">
            <h2 className="mb-6 text-center font-sans text-3xl font-bold tracking-tight dark:text-white sm:text-4xl sm:leading-none">
              WorldPolitics AI <span className="text-[#006A4E]">Purchase</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-6">
            <PaymentClient id={id} />
          </div>
        </div>
      </div>
    </div>
  )
}
