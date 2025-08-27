const termsData = [
  {
    id: 1,
    title: 'Use of Services',
    details:
      'Our tools and data are for informational and professional use. Redistribution or commercial resale is not allowed.'
  },
  {
    id: 2,
    title: 'No User-Generated Content',
    details:
      'We do not allow uploading or sharing of external user content. All tools and data are provided as-is.'
  },
  {
    id: 3,
    title: 'Acceptable Use',
    type: 'list',
    details: [
      'Use our platform for misinformation or manipulation',
      'Violate any local, state, or federal law using our services',
      'Attempt to reverse-engineer or replicate our AI models'
    ]
  },
  {
    id: 4,
    title: 'Disclaimers',
    details:
      'While we strive for accuracy, we cannot guarantee completeness or correctness. Use of insights or tools is at your own discretion.'
  },
  {
    id: 5,
    title: 'Termination',
    details: 'We may suspend access for misuse, abuse, or legal non-compliance.'
  },
  {
    id: 6,
    title: 'Governing Law',
    details:
      'These terms are governed by the laws of the United States. We reserve the right to update these terms as our services evolve.'
  }
]

const TermsContent = () => {
  return (
    <>
      {termsData.map(term => (
        <section className="mb-8" key={term.id}>
          <h2 className="text-2xl font-bold dark:text-white mb-4 flex items-center">
            {term.title}
          </h2>
          {term.type === 'list' ? (
            <ul className="list-disc list-inside pl-4 dark:text-indigo-200 space-y-2 text-left indent-6">
              {term.details.map((dets, ndx) => (
                <li key={ndx}>{dets}</li>
              ))}
            </ul>
          ) : (
            <p className="dark:text-indigo-200 leading-relaxed text-left ml-10">
              {term.details}
            </p>
          )}
        </section>
      ))}
    </>
  )
}

export default TermsContent
