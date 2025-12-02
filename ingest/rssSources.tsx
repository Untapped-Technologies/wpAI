import { createClient } from '@supabase/supabase-js'
import type { RssSource } from './types.js'
import { getSourceIcon } from './sourceIcons.js'

/**
 * Fetches all RSS sources from the database
 */
export async function getRssSources(): Promise<RssSource[]> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Missing Supabase configuration')
    return []
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey)

  try {
    const { data, error } = await supabase
      .from('sources')
      .select('*')
      .order('name')

    if (error) {
      console.error('Error fetching RSS sources:', error)
      return []
    }

    return (data || []).map((source) => ({
      id: source.id,
      name: source.name,
      url: source.url,
      enabled: source.enabled ?? true,
      category: source.category || undefined,
      icon: source.icon || getSourceIcon(source.name, source.url),
    }))
  } catch (error) {
    console.error('Unexpected error fetching RSS sources:', error)
    return []
  }
}

/**
 * Fetches a single RSS source by ID
 */
export async function getRssSourceById(id: string): Promise<RssSource | undefined> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Missing Supabase configuration')
    return undefined
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey)

  try {
    const { data, error } = await supabase
      .from('sources')
      .select('*')
      .eq('id', id)
      .maybeSingle()

    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching RSS source:', error)
      return undefined
    }

    if (!data) {
      return undefined
    }

    return {
      id: data.id,
      name: data.name,
      url: data.url,
      enabled: data.enabled ?? true,
      category: data.category || undefined,
      icon: data.icon || getSourceIcon(data.name, data.url),
    }
  } catch (error) {
    console.error('Unexpected error fetching RSS source:', error)
    return undefined
  }
}

/**
 * Fetches only enabled RSS sources from the database
 */
export async function getEnabledRssSources(): Promise<RssSource[]> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Missing Supabase configuration')
    return []
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey)

  try {
    const { data, error } = await supabase
      .from('sources')
      .select('*')
      .eq('enabled', true)
      .order('name')

    if (error) {
      console.error('Error fetching enabled RSS sources:', error)
      return []
    }

    return (data || []).map((source) => ({
      id: source.id,
      name: source.name,
      url: source.url,
      enabled: source.enabled ?? true,
      category: source.category || undefined,
      icon: source.icon || getSourceIcon(source.name, source.url),
    }))
  } catch (error) {
    console.error('Unexpected error fetching enabled RSS sources:', error)
    return []
  }
}

/**
 * Exported function that can be used to get sources (fetches from DB)
 * For convenience, this is an async function that returns sources
 */
export async function getSources(): Promise<RssSource[]> {
  return getEnabledRssSources()
}

/**
 * Curated list of political RSS sources
 */
export const SOURCES: { name: string; url: string; icon?: string }[] = [
  { name: 'AP News Politics', url: 'https://apnews.com/rss/politics', icon: getSourceIcon('AP News Politics', 'https://apnews.com/rss/politics') },
  { name: 'Reuters Politics', url: 'http://feeds.reuters.com/Reuters/PoliticsNews', icon: getSourceIcon('Reuters Politics', 'http://feeds.reuters.com/Reuters/PoliticsNews') },
  { name: 'Politico', url: 'https://www.politico.com/rss/politics.xml', icon: getSourceIcon('Politico', 'https://www.politico.com/rss/politics.xml') },
  { name: 'The Hill', url: 'https://thehill.com/rss/syndicator/19110', icon: getSourceIcon('The Hill', 'https://thehill.com/rss/syndicator/19110') },
  { name: 'NPR Politics', url: 'https://feeds.npr.org/1014/rss.xml', icon: getSourceIcon('NPR Politics', 'https://feeds.npr.org/1014/rss.xml') },
  { name: 'BBC World', url: 'http://feeds.bbci.co.uk/news/world/rss.xml', icon: getSourceIcon('BBC World', 'http://feeds.bbci.co.uk/news/world/rss.xml') },
  { name: 'Al Jazeera English', url: 'https://www.aljazeera.com/xml/rss/all.xml', icon: getSourceIcon('Al Jazeera English', 'https://www.aljazeera.com/xml/rss/all.xml') },
  { name: 'Foreign Affairs', url: 'https://www.foreignaffairs.com/rss.xml', icon: getSourceIcon('Foreign Affairs', 'https://www.foreignaffairs.com/rss.xml') },
  { name: 'DW World', url: 'https://rss.dw.com/rdf/rss-en-all', icon: getSourceIcon('DW World', 'https://rss.dw.com/rdf/rss-en-all') },
  { name: 'Euronews', url: 'https://www.euronews.com/rss?level=theme&name=politics', icon: getSourceIcon('Euronews', 'https://www.euronews.com/rss?level=theme&name=politics') },
]
