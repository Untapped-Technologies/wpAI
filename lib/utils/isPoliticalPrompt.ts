export const politicalTopics = [
  'abortion',
  'healthcare',
  'taxes',
  'education',
  'climate',
  'gun',
  'immigration',
  'election',
  'congress',
  'senator',
  'policy',
  'supreme court',
  'law',
  'budget',
  'voting',
  'civil rights',
  'foreign policy',
  'public safety',
  'lgbtq',
  'governor'
]

export function isLikelyPolitical(prompt: string): boolean {
  return politicalTopics.some(topic => prompt.toLowerCase().includes(topic))
}
