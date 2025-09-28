import { Fingerprint, Home } from 'lucide-react'

export const faqData = [
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

export const privacyData = [
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

export const termsData = [
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

export const cardImages = [
  {
    id: 1,
    image: 'visa.webp',
    alt: 'Visa Logo'
  },
  {
    id: 2,
    image: 'american-express.webp',
    alt: 'American Express Logo'
  },
  {
    id: 3,
    image: 'master.webp',
    alt: 'Mastercard Logo'
  }
]

export const menuItems = [
  {
    id: 1,
    title: 'Your Feed',
    href: '/trending-topics',
    icon: <Home size={24} />
  },
  {
    id: 2,
    title: 'Account Info',
    href: '/user/profile',
    icon: <Fingerprint size={24} />
  }
  // {
  //   id: 3,
  //   title: 'Manage Account',
  //   href: '/',
  //   icon: <Cog size={24} />,
  //   expandIcon: true
  // }
  // {
  //   id: 4,
  //   title: 'Notifications',
  //   href: '/',
  //   icon: <Bell size={24} />,
  //   expandIcon: true
  // }
]
