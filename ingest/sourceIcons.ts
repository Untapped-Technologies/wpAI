/**
 * Icon mappings for RSS sources
 * Maps source names to their icon URLs or paths
 */
export const SOURCE_ICONS: Record<string, string> = {
  'AP News Politics': 'https://www.google.com/s2/favicons?domain=apnews.com&sz=64',
  'Reuters Politics': 'https://www.google.com/s2/favicons?domain=reuters.com&sz=64',
  'Politico': 'https://www.google.com/s2/favicons?domain=politico.com&sz=64',
  'The Hill': 'https://www.google.com/s2/favicons?domain=thehill.com&sz=64',
  'NPR Politics': 'https://www.google.com/s2/favicons?domain=npr.org&sz=64',
  'BBC World': 'https://www.google.com/s2/favicons?domain=bbc.com&sz=64',
  'Al Jazeera English': 'https://www.google.com/s2/favicons?domain=aljazeera.com&sz=64',
  'Foreign Affairs': 'https://www.google.com/s2/favicons?domain=foreignaffairs.com&sz=64',
  'DW World': 'https://www.google.com/s2/favicons?domain=dw.com&sz=64',
  'Euronews': 'https://www.google.com/s2/favicons?domain=euronews.com&sz=64',
}

/**
 * Get icon URL for a source by name
 * Falls back to Google favicon service if not found in mapping
 */
export function getSourceIcon(sourceName: string, sourceUrl?: string): string {
  // First check if we have a mapped icon
  if (SOURCE_ICONS[sourceName]) {
    return SOURCE_ICONS[sourceName]
  }

  // Fallback to extracting domain from URL and using Google favicon service
  if (sourceUrl) {
    try {
      const domain = new URL(sourceUrl).hostname
      return `https://www.google.com/s2/favicons?domain=${domain}&sz=64`
    } catch {
      // Invalid URL, return default
    }
  }

  // Final fallback
  return 'https://www.google.com/s2/favicons?domain=example.com&sz=64'
}

/**
 * Get icon URL for a source by extracting domain from URL
 */
export function getSourceIconFromUrl(url: string): string {
  try {
    const domain = new URL(url).hostname
    return `https://www.google.com/s2/favicons?domain=${domain}&sz=64`
  } catch {
    return 'https://www.google.com/s2/favicons?domain=example.com&sz=64'
  }
}

