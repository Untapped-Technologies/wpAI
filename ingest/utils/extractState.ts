/**
 * Full map of US states with abbreviations and full names
 */
export const STATE_MAP: Record<string, string> = {
  // Full state names
  'Alabama': 'AL',
  'Alaska': 'AK',
  'Arizona': 'AZ',
  'Arkansas': 'AR',
  'California': 'CA',
  'Colorado': 'CO',
  'Connecticut': 'CT',
  'Delaware': 'DE',
  'Florida': 'FL',
  'Georgia': 'GA',
  'Hawaii': 'HI',
  'Idaho': 'ID',
  'Illinois': 'IL',
  'Indiana': 'IN',
  'Iowa': 'IA',
  'Kansas': 'KS',
  'Kentucky': 'KY',
  'Louisiana': 'LA',
  'Maine': 'ME',
  'Maryland': 'MD',
  'Massachusetts': 'MA',
  'Michigan': 'MI',
  'Minnesota': 'MN',
  'Mississippi': 'MS',
  'Missouri': 'MO',
  'Montana': 'MT',
  'Nebraska': 'NE',
  'Nevada': 'NV',
  'New Hampshire': 'NH',
  'New Jersey': 'NJ',
  'New Mexico': 'NM',
  'New York': 'NY',
  'North Carolina': 'NC',
  'North Dakota': 'ND',
  'Ohio': 'OH',
  'Oklahoma': 'OK',
  'Oregon': 'OR',
  'Pennsylvania': 'PA',
  'Rhode Island': 'RI',
  'South Carolina': 'SC',
  'South Dakota': 'SD',
  'Tennessee': 'TN',
  'Texas': 'TX',
  'Utah': 'UT',
  'Vermont': 'VT',
  'Virginia': 'VA',
  'Washington': 'WA',
  'West Virginia': 'WV',
  'Wisconsin': 'WI',
  'Wyoming': 'WY',
  // State abbreviations
  'AL': 'AL',
  'AK': 'AK',
  'AZ': 'AZ',
  'AR': 'AR',
  'CA': 'CA',
  'CO': 'CO',
  'CT': 'CT',
  'DE': 'DE',
  'FL': 'FL',
  'GA': 'GA',
  'HI': 'HI',
  'ID': 'ID',
  'IL': 'IL',
  'IN': 'IN',
  'IA': 'IA',
  'KS': 'KS',
  'KY': 'KY',
  'LA': 'LA',
  'ME': 'ME',
  'MD': 'MD',
  'MA': 'MA',
  'MI': 'MI',
  'MN': 'MN',
  'MS': 'MS',
  'MO': 'MO',
  'MT': 'MT',
  'NE': 'NE',
  'NV': 'NV',
  'NH': 'NH',
  'NJ': 'NJ',
  'NM': 'NM',
  'NY': 'NY',
  'NC': 'NC',
  'ND': 'ND',
  'OH': 'OH',
  'OK': 'OK',
  'OR': 'OR',
  'PA': 'PA',
  'RI': 'RI',
  'SC': 'SC',
  'SD': 'SD',
  'TN': 'TN',
  'TX': 'TX',
  'UT': 'UT',
  'VT': 'VT',
  'VA': 'VA',
  'WA': 'WA',
  'WV': 'WV',
  'WI': 'WI',
  'WY': 'WY',
  // District of Columbia
  'District of Columbia': 'DC',
  'Washington, D.C.': 'DC',
  'Washington DC': 'DC',
  'D.C.': 'DC',
  'DC': 'DC'
}

/**
 * Extracts US state from text by matching against STATE_MAP
 * @param text - The text to search for state names/abbreviations
 * @returns The state abbreviation if found, null otherwise
 */
export function extractState(text: string | null | undefined): string | null {
  if (!text) return null

  const normalizedText = text.trim()
  if (!normalizedText) return null

  // Try exact match first (case-insensitive)
  const exactMatch = STATE_MAP[normalizedText]
  if (exactMatch) return exactMatch

  // Try case-insensitive lookup
  const upperText = normalizedText.toUpperCase()
  const upperMatch = STATE_MAP[upperText]
  if (upperMatch) return upperMatch

  // Search for state names/abbreviations in the text
  // Create a regex pattern that matches state names or abbreviations
  const stateEntries = Object.entries(STATE_MAP)
  
  // Sort by length (longest first) to match full names before abbreviations
  const sortedEntries = stateEntries.sort((a, b) => b[0].length - a[0].length)

  for (const [stateName, abbreviation] of sortedEntries) {
    // Create a regex that matches the state name as a whole word
    // This prevents matching "CA" inside "California" or "car"
    const regex = new RegExp(`\\b${stateName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i')
    if (regex.test(text)) {
      return abbreviation
    }
  }

  return null
}

