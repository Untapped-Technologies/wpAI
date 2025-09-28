import { faqData } from '@/components/_constants/pageData/pageData'
import MainHeader from '@/components/_constants/pages/mainHeader'
import AuthAwareFooter from '@/components/auth-aware-footer'
import AuthAwareNavigation from '@/components/auth-aware-navigation'

export default function FAQsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 w-full">
      <AuthAwareNavigation />
      <div className="max-w-4xl mx-auto mb-8">
        <MainHeader title="F.A.Qs" />
        <div className="text-left space-y-6  text-[#203c39]">
          {faqData.map(faq => (
            <div key={faq.id}>
              <p className="font-semibold">Q: {faq.question}</p>
              <p>A: {faq.answer}</p>
            </div>
          ))}
        </div>
      </div>
      <AuthAwareFooter />
    </div>
  )
}
