import { privacyData } from '@/components/_constants/pageData/pageData'
import PageLayout from '@/components/_constants/pages/pageLayout'

export default function PrivacyPage() {
  return (
    <PageLayout title="Privacy Policy">
      <div className="text-left space-y-4 text-[#203c39]">
        {privacyData.map(item => (
          <div key={item.id}>
            <h2 className="text-lg font-semibold mb-2">{item.title}</h2>
            {item.description}
            {item.listdetails && (
              <ul className="list-inside space-y-1">
                {item.listdetails.map((lItem, ind) => (
                  <li key={ind}>
                    <h2 className="font-bold py-2">{lItem.type}</h2>
                    <p>{lItem.description}</p>
                  </li>
                ))}
              </ul>
            )}
            {item.listItems && (
              <ul className="list-disc list-inside space-y-1">
                {item.listItems.map((lItem, ind) => (
                  <li key={ind}>{lItem}</li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </PageLayout>
  )
}
