import { termsData } from '@/components/_constants/pageData/pageData'
import MainHeader from '@/components/_constants/pages/mainHeader'
import AuthAwareFooter from '@/components/auth-aware-footer'
import AuthAwareNavigation from '@/components/auth-aware-navigation'

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 w-full">
      <AuthAwareNavigation />
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
      <AuthAwareFooter />
    </div>
  )
}
