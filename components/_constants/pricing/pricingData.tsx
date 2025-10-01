export const pricingData = [
  {
    id: 1,
    title: 'Free Tier',
    subtitle: '',
    price: '$0',
    timeframe: '',
    url: '/auth/sign-up',
    trial: true,
    trialButton: false,
    features: [
      {
        fid: 1,
        feature: 'Access to limited daily queries (e.g., 20 prompts/day).',
        description: ''
      },
      {
        fid: 2,
        feature: 'Core political analysis, summaries, and news breakdowns.',
        description: ''
      },
      {
        fid: 3,
        feature:
          'Basic personalization (topics of interest, regions followed).',
        description: ''
      }
    ]
  },
  {
    id: 2,
    title: 'Plus Tier',
    subtitle: '(aligned with ChatGPT Plus / Copilot Pro)',
    price: '$20',
    timeframe: 'month',
    url: '#',
    trial: true,
    trialButton: true,
    features: [
      {
        fid: 1,
        feature: 'Unlimited daily queries with priority access.',
        description: ''
      },
      {
        fid: 2,
        feature:
          'Access to advanced model (e.g., GPT-4o equivalent for deeper reasoning).',
        description: ''
      },
      {
        fid: 3,
        feature: 'Real-time political event monitoring & summaries.',
        description: ''
      },
      {
        fid: 4,
        feature:
          'Enhanced personalization (saved dashboards, regions, or themes like “Elections,” “Diplomacy,” “Conflict Monitoring”).',
        description: ''
      },
      {
        fid: 5,
        feature: 'Access to interactive maps and timelines.',
        description: ''
      }
    ]
  },
  {
    id: 3,
    title: 'Pro Tier',
    subtitle: '(similar to GitHub Copilot for Business tiers)',
    price: '$50',
    timeframe: 'monthly',
    url: '#',
    trial: true,
    trialButton: true,
    features: [
      {
        fid: 1,
        feature: 'Everything in Plus.',
        description: ''
      },
      {
        fid: 2,
        feature:
          'Priority processing for complex analysis (e.g., historical comparisons, long-form reports).',
        description: ''
      },
      {
        fid: 3,
        feature: 'Collaboration tools: shareable analysis boards with teams.',
        description: ''
      },
      {
        fid: 4,
        feature: 'Data export (CSV, PDF, API-lite access).',
        description: ''
      },
      {
        fid: 5,
        feature:
          'Advanced visualization: scenario forecasting, trend graphs, influence mapping.',
        description: ''
      }
    ]
  }
]

export const pricingEnterprise = {
  id: 4,
  title: 'Enterprise / API Tier',
  subtitle:
    'Custom (usage-based, starting at ~$0.01 per 1k tokens, similar to OpenAI API).',
  price: 'Contact for pricing',
  timeframe: '',
  url: '#',
  trial: false,
  trialButton: false,
  features: [
    {
      fid: 1,
      feature:
        'Full API access for integration into research pipelines, dashboards, or custom apps.',
      description: ''
    },
    {
      fid: 2,
      feature: 'Unlimited seats with admin & compliance controls.',
      description: ''
    },
    {
      fid: 3,
      feature:
        'Fine-tuned political analysis models (e.g., tailored to regions or topics).',
      description: ''
    },
    {
      fid: 4,
      feature: 'Dedicated account manager & SLAs.',
      description: ''
    }
  ]
}
