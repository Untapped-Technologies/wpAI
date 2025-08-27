import PageLayout from '@/components/_constants/pages/pageLayout'
const termsData = [
  {
    id: 1,
    title: '1. Acceptance of Terms',
    details: (
      <p>
        By accessing or using WorldPolitics.ai (the &ldquo;Platform&ldquo;), you
        agree to be bound by these Terms of Use. If you do not agree, please do
        not use the Platform.
      </p>
    )
  },
  {
    id: 2,
    title: '2. Platform Description',
    details: (
      <p>
        WorldPolitics.ai provides AI-generated political analysis, insights, and
        visualizations based on public records, verified news, and academic
        sources. While we aim for accuracy, we do not guarantee the completeness
        or correctness of the content.
      </p>
    )
  },
  {
    id: 3,
    title: '3. Permitted Use',
    details: (
      <p>
        The Platform is provided for informational and educational use only. You
        may not use the content or tools for commercial purposes, redistribute
        the content, or modify it in any form without prior written permission.
        All data and insights are intended for personal and professional
        internal use only.
      </p>
    )
  },
  {
    id: 4,
    title: '4. User Conduct',
    details: (
      <div>
        <p>Users may not:</p>
        <ul className="list-disc list-inside space-y-1">
          <li>
            Use the platform for any unlawful, deceptive, or harmful purposes
          </li>
          <li>Reproduce, republish, distribute, or exploit platform content</li>
          <li>
            Attempt to interfere with the functionality or security of the
            Platform
          </li>
          <li>
            Use automated systems to extract data or content from the Platform
          </li>
        </ul>
      </div>
    )
  },
  {
    id: 5,
    title: '5. Intellectual Property',
    details: (
      <p>
        All content, technology, algorithms, branding, and trademarks on the
        Platform are the property of{' '}
        <span className="font-bold">WorldPolitics.ai</span> or its licensors and
        may not be copied, imitated, or used without express written consent.
      </p>
    )
  },
  {
    id: 6,
    title: '6. Updates to the Platform and Terms',
    details: (
      <p>
        We reserve the right to update or modify the Platform and these Terms of
        Use at any time. Changes will be effective immediately upon posting.
        Your continued use of the Platform constitutes acceptance of the revised
        Terms. Users are encouraged to review the Terms periodically.
      </p>
    )
  },
  {
    id: 7,
    title: '7. Account Termination',
    details: (
      <p>
        We reserve the right to suspend or terminate access to the Platform at
        our sole discretion, with or without notice, for any reason including
        but not limited to violations of these Terms of Use.
      </p>
    )
  }
]

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
