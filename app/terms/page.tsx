import { termsData } from '@/components/_constants/pageData/pageData'
import HomeFooter from '@/components/_constants/pages/home/homeFooter'
import HomeNavigation from '@/components/_constants/pages/home/homeNavigation'
import MainHeader from '@/components/_constants/pages/mainHeader'

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 w-full">
      <HomeNavigation />
      <div className="max-w-4xl mx-auto mb-8">
        <MainHeader title="Terms of Use" />
        <div className="text-left space-y-4 text-[#203c39]">
          {termsData.map(item => (
            <div key={item.id}>
              <h2 className="text-lg font-semibold mb-2">{item.title}</h2>
              {item.details}
            </div>
          ))}
        </div>
      </div>
      <HomeFooter />
    </div>
  )
}
