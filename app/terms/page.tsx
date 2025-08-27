import { termsData } from '@/components/_constants/pageData/pageData'
import PageLayout from '@/components/_constants/pages/pageLayout'

export default function TermsPage() {
  return (
    <PageLayout title="Terms of Use">
      <div className="text-left space-y-4">
        {termsData.map(item => (
          <div key={item.id}>
            <h2 className="text-lg font-semibold mb-2">{item.title}</h2>
            {item.details}
          </div>
        ))}
      </div>
    </PageLayout>
  )
}
