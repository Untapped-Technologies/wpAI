import PageLayout from '@/components/_constants/pages/pageLayout'
const privacyData = [
  {
    id: 1,
    title: '1. Information We Collect',
    listdetails: [
      {
        type: 'Personal Information',
        description:
          'We may collect names, email addresses, IP addresses, and other relevant identifiers when users register, interact with features, or subscribe to services.'
      },
      {
        type: 'Usage Data',
        description:
          'We collect anonymous data and analytics regarding user interactions, preferences, and behaviors to optimize platform performance and improve user experience.'
      },
      {
        type: 'Compliance',
        description:
          'All data collection practices comply with applicable privacy laws including the General Data Protection Regulation (GDPR) and the California Consumer Privacy Act (CCPA).'
      }
    ]
  },
  {
    id: 2,
    title: '2. How We Use Data',
    listItems: [
      'To personalize user experiences and content delivery',
      'To analyze and improve platform functionality and content accuracy',
      'To communicate platform updates, insights, and opportunities (with user consent)'
    ]
  },
  {
    id: 3,
    title: '3. Third-Party Services',
    description:
      'We may engage reputable third-party service providers to support core platform functions.',
    listItems: [
      'Analytics services (e.g., Google Analytics) to monitor and improve user engagement',
      'AI model providers to support real-time political analysis'
    ],
    note: 'All partners operate under strict confidentiality agreements and are contractually obligated to comply with our data protection standards.'
  },
  {
    id: 4,
    title: '4. Data Sharing and Security',
    listItems: [
      'We do not sell, rent, or redistribute user data under any circumstances.',
      'User data is stored securely using industry-standard encryption, firewalls, and access control protocols. Access is limited to authorized personnel only, as required by law.'
    ]
  },
  {
    id: 5,
    title: '5. User Rights and Choices',
    listItems: [
      'Request access to personal data collected',
      'Request correction or deletion of their personal data',
      'Opt-out of non-essential data tracking and marketing communications'
    ],
    contact: 'privacy@worldpolitics.ai',
    note: 'All requests will be honored in compliance with GDPR, CCPA, and other applicable laws.'
  },
  {
    id: 6,
    title: '6. International Users',
    description:
      'WorldPolitics.ai is accessible globally. By using the Platform, users outside the United States acknowledge that their information may be processed and stored in the United States or other jurisdictions.',
    note: 'We provide localized compliance measures and translated materials where necessary, and will respect local laws governing user privacy to the extent applicable.'
  }
]

export default function PrivacyPage() {
  return (
    <PageLayout title="Privacy Policy">
      <div className="text-left space-y-4">
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
