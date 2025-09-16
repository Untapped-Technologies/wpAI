import { faqData } from '@/components/_constants/pageData/pageData'
import PageLayout from '@/components/_constants/pages/pageLayout'

export default function FAQsPage() {
  return (
    <PageLayout title="F.A.Q.">
      <div className="text-left space-y-6  text-[#203c39]">
        {faqData.map(faq => (
          <div key={faq.id}>
            <p className="font-semibold">Q: {faq.question}</p>
            <p>A: {faq.answer}</p>
          </div>
        ))}
      </div>
    </PageLayout>
  )
}
