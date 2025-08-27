import { SiInstagram, SiMeta, SiX, SiYoutube } from 'react-icons/si'

export const profileCategories = [
  {
    id: 'cat-1',
    title: 'Governance & Public Trust',
    subtitle:
      'Transparency, accountability, and ethical leadership at all levels.',
    areas: [
      {
        title: 'Transparency and Accountability',
        url: '#'
      },
      {
        title: 'Government Spending and Budgeting',
        url: '#'
      },
      {
        title: 'Constituent Services and Community Engagement',
        url: '#'
      },
      {
        title: 'Ethics and Anti-Corruption Measures',
        url: '#'
      }
    ]
  },
  {
    id: 'cat-2',
    title: 'Economy & Jobs',
    subtitle:
      'Driving economic development, creating jobs, and supporting workers.',
    areas: [
      {
        title: 'Unemployment and Job Creation',
        url: '#'
      },
      {
        title: 'Minimum Wage and Living Wage',
        url: '#'
      },
      {
        title: 'Small Business Support',
        url: '#'
      },
      {
        title: 'Economic Development & Infrastructure Investment',
        url: '#'
      }
    ]
  },
  {
    id: 'cat-3',
    title: 'Health & Public Safety',
    subtitle: 'Ensuring access to quality healthcare and a safe community.',
    areas: [
      {
        title: 'Healthcare Access and Affordability',
        url: '#'
      },
      {
        title: 'Mental Health Resources',
        url: '#'
      },
      {
        title: 'Emergency Preparedness',
        url: '#'
      },
      {
        title: 'Crime Rates and Public Safety',
        url: '#'
      }
    ]
  },
  {
    id: 'cat-4',
    title: 'Education & Youth',
    subtitle: 'Improving public education and supporting the next generation.',
    areas: [
      {
        title: 'Public Education Funding',
        url: '#'
      },
      {
        title: 'Curriculum Standards',
        url: '#'
      },
      {
        title: 'Student Loans and College Affordability',
        url: '#'
      },
      {
        title: 'After-School and Youth Programs',
        url: '#'
      }
    ]
  },
  {
    id: 'cat-5',
    title: 'Environment & Sustainability',
    subtitle:
      'Protecting natural resources and preparing for climate challenges.',
    areas: [
      {
        title: 'Climate Change Action',
        url: '#'
      },
      {
        title: 'Clean Water and Air',
        url: '#'
      },
      {
        title: 'Natural Disaster Mitigation',
        url: '#'
      },
      {
        title: 'Energy Policy',
        url: '#'
      }
    ]
  },
  {
    id: 'cat-6',
    title: 'Democracy & Civil Rights',
    subtitle: 'Protecting the rights and freedoms of all citizens.',
    areas: [
      {
        title: 'Voting Rights and Access',
        url: '#'
      },
      {
        title: 'Redistricting and Representation',
        url: '#'
      },
      {
        title: 'LGBTQ+ Rights, Racial Equity, Gender Equality',
        url: '#'
      },
      {
        title: 'Police Reform and Criminal Justice',
        url: '#'
      }
    ]
  },
  {
    id: 'cat-7',
    title: 'Immigration & Border Policy',
    subtitle: 'Balancing national security with fair immigration practices.',
    areas: [
      {
        title: 'Pathways to Citizenship',
        url: '#'
      },
      {
        title: 'Border Security and Asylum Policy',
        url: '#'
      },
      {
        title: 'Support for Refugees and DACA Recipients',
        url: '#'
      }
    ]
  },
  {
    id: 'cat-8',
    title: 'Gun Policy & Safety',
    subtitle: 'Addressing gun violence while preserving constitutional rights.',
    areas: [
      {
        title: 'Gun Control vs Gun Rights',
        url: '#'
      },
      {
        title: 'School Safety and Red Flag Laws',
        url: '#'
      },
      {
        title: 'Community Gun Violence Reduction',
        url: '#'
      }
    ]
  },
  {
    id: 'cat-9',
    title: 'Housing & Cost of Living',
    subtitle: 'Making housing more affordable and reducing homelessness.',
    areas: [
      {
        title: 'Affordable Housing Initiatives',
        url: '#'
      },
      {
        title: 'Rent Stabilization',
        url: '#'
      },
      {
        title: 'Property Taxes and Housing Vouchers',
        url: '#'
      },
      {
        title: 'Homelessness Services',
        url: '#'
      }
    ]
  },
  {
    id: 'cat-10',
    title: 'Technology & Infrastructure',
    subtitle:
      'Modernizing public infrastructure and bridging the digital divide.',
    areas: [
      {
        title: 'Broadband Access / Digital Divide',
        url: '#'
      },
      {
        title: 'Smart Cities / Innovation',
        url: '#'
      },
      {
        title: 'Cybersecurity and Data Privacy',
        url: '#'
      },
      {
        title: 'Public Transportation Modernization',
        url: '#'
      }
    ]
  },
  {
    id: 'cat-11',
    title: 'Foreign Policy & National Security',
    subtitle:
      'Maintaining global partnerships and protecting national interests.',
    areas: [
      {
        title: 'International Alliances and Trade',
        url: '#'
      },
      {
        title: 'Defense Spending',
        url: '#'
      },
      {
        title: 'Counterterrorism and Cybersecurity',
        url: '#'
      }
    ]
  },
  {
    id: 'cat-12',
    title: 'Taxation & Fiscal Policy',
    subtitle: 'Creating fair and sustainable tax policies.',
    areas: [
      {
        title: 'Property, Sales, and Income Tax Structure',
        url: '#'
      },
      {
        title: 'Corporate Tax Reform',
        url: '#'
      },
      {
        title: 'Federal vs. State Spending Priorities',
        url: '#'
      }
    ]
  }
]

export const samplePolitician = {
  id: 'pol-001',
  name: 'Jordan Avery',
  title: 'U.S. Senator',
  image: '/images/avatar.jpg',
  affiliation: {
    party: 'Independent',
    state: 'California',
    district: 'Los Angeles',
    chamber: 'Senate'
  },
  socialMedia: [
    {
      id: 'meta',
      title: 'meta',
      link: '#',
      icon: <SiMeta size={32} />
    },
    {
      id: 'instagram',
      title: 'instagram',
      link: '#',
      icon: <SiInstagram size={32} />
    },
    {
      id: 'twitter',
      title: 'twitter',
      link: '#',
      icon: <SiX size={32} />
    },
    {
      id: 'youtube',
      title: 'youtube',
      link: '#',
      icon: <SiYoutube size={32} />
    }
  ],
  about:
    'Jordan Avery is a dedicated public servant with a focus on pragmatic policy solutions and bipartisan collaboration. With a background in law and community advocacy, Avery has championed legislation centered on economic equity, environmental resilience, and transparent governance.'
}

export const projects = [
  {
    id: 1,
    title: 'Project 1',
    link: '#'
  },
  {
    id: 2,
    title: 'Project 2',
    link: '#'
  },
  {
    id: 3,
    title: 'Project 3',
    link: '#'
  }
]

export const activities = [
  {
    id: 1,
    title: 'Activity 1',
    link: '#'
  },
  {
    id: 2,
    title: 'Activity 2',
    link: '#'
  },
  {
    id: 3,
    title: 'Activity 3',
    link: '#'
  }
]

export const state_profileCategories = [
  {
    id: 'cat-1',
    title: 'Governance & Public Trust',
    subtitle:
      'Transparency, accountability, and ethical leadership at all levels.',
    areas: [
      {
        title: 'Transparency and Accountability',
        url: '#'
      },
      {
        title: 'Government Spending and Budgeting',
        url: '#'
      },
      {
        title: 'Constituent Services and Community Engagement',
        url: '#'
      },
      {
        title: 'Ethics and Anti-Corruption Measures',
        url: '#'
      }
    ]
  },
  {
    id: 'cat-2',
    title: 'Economy & Jobs',
    subtitle:
      'Driving economic development, creating jobs, and supporting workers.',
    areas: [
      {
        title: 'Unemployment and Job Creation',
        url: '#'
      },
      {
        title: 'Minimum Wage and Living Wage',
        url: '#'
      },
      {
        title: 'Small Business Support',
        url: '#'
      },
      {
        title: 'Economic Development & Infrastructure Investment',
        url: '#'
      }
    ]
  },
  {
    id: 'cat-3',
    title: 'Health & Public Safety',
    subtitle: 'Ensuring access to quality healthcare and a safe community.',
    areas: [
      {
        title: 'Healthcare Access and Affordability',
        url: '#'
      },
      {
        title: 'Mental Health Resources',
        url: '#'
      },
      {
        title: 'Emergency Preparedness',
        url: '#'
      },
      {
        title: 'Crime Rates and Public Safety',
        url: '#'
      }
    ]
  },
  {
    id: 'cat-4',
    title: 'Education & Youth',
    subtitle: 'Improving public education and supporting the next generation.',
    areas: [
      {
        title: 'Public Education Funding',
        url: '#'
      },
      {
        title: 'Curriculum Standards',
        url: '#'
      },
      {
        title: 'Student Loans and College Affordability',
        url: '#'
      },
      {
        title: 'After-School and Youth Programs',
        url: '#'
      }
    ]
  },
  {
    id: 'cat-5',
    title: 'Environment & Sustainability',
    subtitle:
      'Protecting natural resources and preparing for climate challenges.',
    areas: [
      {
        title: 'Climate Change Action',
        url: '#'
      },
      {
        title: 'Clean Water and Air',
        url: '#'
      },
      {
        title: 'Natural Disaster Mitigation',
        url: '#'
      },
      {
        title: 'Energy Policy',
        url: '#'
      }
    ]
  },
  {
    id: 'cat-6',
    title: 'Democracy & Civil Rights',
    subtitle: 'Protecting the rights and freedoms of all citizens.',
    areas: [
      {
        title: 'Voting Rights and Access',
        url: '#'
      },
      {
        title: 'Redistricting and Representation',
        url: '#'
      },
      {
        title: 'LGBTQ+ Rights, Racial Equity, Gender Equality',
        url: '#'
      },
      {
        title: 'Police Reform and Criminal Justice',
        url: '#'
      }
    ]
  },
  {
    id: 'cat-7',
    title: 'Immigration & Border Policy',
    subtitle: 'Balancing national security with fair immigration practices.',
    areas: [
      {
        title: 'Pathways to Citizenship',
        url: '#'
      },
      {
        title: 'Border Security and Asylum Policy',
        url: '#'
      },
      {
        title: 'Support for Refugees and DACA Recipients',
        url: '#'
      }
    ]
  },
  {
    id: 'cat-8',
    title: 'Gun Policy & Safety',
    subtitle: 'Addressing gun violence while preserving constitutional rights.',
    areas: [
      {
        title: 'Gun Control vs Gun Rights',
        url: '#'
      },
      {
        title: 'School Safety and Red Flag Laws',
        url: '#'
      },
      {
        title: 'Community Gun Violence Reduction',
        url: '#'
      }
    ]
  },
  {
    id: 'cat-9',
    title: 'Housing & Cost of Living',
    subtitle: 'Making housing more affordable and reducing homelessness.',
    areas: [
      {
        title: 'Affordable Housing Initiatives',
        url: '#'
      },
      {
        title: 'Rent Stabilization',
        url: '#'
      },
      {
        title: 'Property Taxes and Housing Vouchers',
        url: '#'
      },
      {
        title: 'Homelessness Services',
        url: '#'
      }
    ]
  },
  {
    id: 'cat-10',
    title: 'Technology & Infrastructure',
    subtitle:
      'Modernizing public infrastructure and bridging the digital divide.',
    areas: [
      {
        title: 'Broadband Access / Digital Divide',
        url: '#'
      },
      {
        title: 'Smart Cities / Innovation',
        url: '#'
      },
      {
        title: 'Cybersecurity and Data Privacy',
        url: '#'
      },
      {
        title: 'Public Transportation Modernization',
        url: '#'
      }
    ]
  },
  {
    id: 'cat-11',
    title: 'Foreign Policy & National Security',
    subtitle:
      'Maintaining global partnerships and protecting national interests.',
    areas: [
      {
        title: 'International Alliances and Trade',
        url: '#'
      },
      {
        title: 'Defense Spending',
        url: '#'
      },
      {
        title: 'Counterterrorism and Cybersecurity',
        url: '#'
      }
    ]
  },
  {
    id: 'cat-12',
    title: 'Taxation & Fiscal Policy',
    subtitle: 'Creating fair and sustainable tax policies.',
    areas: [
      {
        title: 'Property, Sales, and Income Tax Structure',
        url: '#'
      },
      {
        title: 'Corporate Tax Reform',
        url: '#'
      },
      {
        title: 'Federal vs. State Spending Priorities',
        url: '#'
      }
    ]
  }
]

export const state_samplePolitician = [
  {
    id: 'pol-001',
    loc: 'texas',
    name: 'Jordan Avery',
    title: 'U.S. Senator',
    image: '/images/reps/texas.jpg',
    affiliation: {
      party: 'Independent',
      state: 'Texas',
      district: 'Houston',
      chamber: 'Senate'
    },
    socialMedia: [
      {
        id: 'meta',
        title: 'meta',
        link: '#',
        icon: <SiMeta size={32} />
      },
      {
        id: 'instagram',
        title: 'instagram',
        link: '#',
        icon: <SiInstagram size={32} />
      },
      {
        id: 'twitter',
        title: 'twitter',
        link: '#',
        icon: <SiX size={32} />
      },
      {
        id: 'youtube',
        title: 'youtube',
        link: '#',
        icon: <SiYoutube size={32} />
      }
    ],
    about:
      'Jordan Avery is a dedicated public servant with a focus on pragmatic policy solutions and bipartisan collaboration. With a background in law and community advocacy, Avery has championed legislation centered on economic equity, environmental resilience, and transparent governance.'
  },
  {
    id: 'pol-002',
    loc: 'california',
    name: 'Sandy Jones',
    title: 'U.S. Senator',
    image: '/images/reps/california.jpg',
    affiliation: {
      party: 'Independent',
      state: 'California',
      district: 'Los Angeles',
      chamber: 'Senate'
    },
    socialMedia: [
      {
        id: 'meta',
        title: 'meta',
        link: '#',
        icon: <SiMeta size={32} />
      },
      {
        id: 'instagram',
        title: 'instagram',
        link: '#',
        icon: <SiInstagram size={32} />
      },
      {
        id: 'twitter',
        title: 'twitter',
        link: '#',
        icon: <SiX size={32} />
      },
      {
        id: 'youtube',
        title: 'youtube',
        link: '#',
        icon: <SiYoutube size={32} />
      }
    ],
    about:
      'Sandy Jones is a dedicated public servant with a focus on pragmatic policy solutions and bipartisan collaboration. With a background in law and community advocacy, Jones has championed legislation centered on economic equity, environmental resilience, and transparent governance.'
  },
  {
    id: 'pol-002',
    loc: 'virginia',
    name: 'Mark Jones',
    title: 'U.S. Senator',
    image: '/images/reps/virginia.jpg',
    affiliation: {
      party: 'Democrate',
      state: 'Virginia',
      district: 'Distict of Columbia',
      chamber: 'Senate'
    },
    socialMedia: [
      {
        id: 'meta',
        title: 'meta',
        link: '#',
        icon: <SiMeta size={32} />
      },
      {
        id: 'instagram',
        title: 'instagram',
        link: '#',
        icon: <SiInstagram size={32} />
      },
      {
        id: 'twitter',
        title: 'twitter',
        link: '#',
        icon: <SiX size={32} />
      },
      {
        id: 'youtube',
        title: 'youtube',
        link: '#',
        icon: <SiYoutube size={32} />
      }
    ],
    about:
      'Mark Jones is a dedicated public servant with a focus on pragmatic policy solutions and bipartisan collaboration. With a background in law and community advocacy, Jones has championed legislation centered on economic equity, environmental resilience, and transparent governance.'
  }
]

export const state_projects = [
  {
    id: 1,
    title: 'Project 1',
    link: '#'
  },
  {
    id: 2,
    title: 'Project 2',
    link: '#'
  },
  {
    id: 3,
    title: 'Project 3',
    link: '#'
  }
]

export const state_activities = [
  {
    id: 1,
    title: 'Activity 1',
    link: '#'
  },
  {
    id: 2,
    title: 'Activity 2',
    link: '#'
  },
  {
    id: 3,
    title: 'Activity 3',
    link: '#'
  }
]
