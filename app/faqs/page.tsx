import PageLayout from '@/components/_constants/pages/pageLayout'

const faqData = [
  {
    id: 1,
    question: 'What is WorldPolitics.ai?',
    answer:
      'WorldPolitics.ai is an AI-powered political intelligence platform that provides real-time, unbiased insights into U.S. and global political developments.'
  },
  {
    id: 2,
    question: 'Who is WorldPolitics.ai for?',
    answer:
      'The platform serves voters, educators, journalists, policymakers, students, and globally minded citizens who want factual, transparent, and digestible political analysis.'
  },
  {
    id: 3,
    question: 'How is the content generated?',
    answer:
      'Our AI scans and summarizes verified news sources, legislative records, government statements, and academic resources. All AI outputs are reviewed using structured models to maintain accuracy.'
  },
  {
    id: 4,
    question: 'Is the information partisan or biased?',
    answer:
      'No. We are committed to factual, nonpartisan presentation. Our algorithms are designed to research and present multiple perspectives and back all insights with citations.'
  },
  {
    id: 5,
    question: 'How often is the content updated?',
    answer:
      'Continuously. Our system refreshes data throughout the day, ensuring current legislative developments and global shifts are reflected in real time.'
  },
  {
    id: 6,
    question: 'Can I use WorldPolitics.ai in my classroom or news publication?',
    answer:
      'Yes! We encourage educational and journalistic use. Attribution is required. For partnerships or custom integrations, contact partners@worldpolitics.ai.'
  },
  {
    id: 7,
    question: 'How is my data used?',
    answer:
      'We respect your privacy. Only essential usage data is collected, and it is never sold or used for advertising purposes. See our full Privacy Policy for details.'
  },
  {
    id: 8,
    question: 'How can I report an error or suggest an improvement?',
    answer:
      'We welcome feedback. Email us at support@worldpolitics.ai or use the in-platform “Report an Issue” feature.'
  }
]

export default function FAQsPage() {
  return (
    <PageLayout title="F.A.Q.">
      <div className="text-left space-y-6">
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
