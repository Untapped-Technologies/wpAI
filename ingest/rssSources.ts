import { createClient } from '@supabase/supabase-js'
import type { RssSource } from './types.js'

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
    }))
  } catch (error) {
    console.error('Unexpected error fetching enabled RSS sources:', error)
    return []
  }
}

/**
 * Exported constant that can be used to get sources (fetches from DB)
 * For convenience, this is an async function that returns sources
 */
export async function SOURCES(): Promise<RssSource[]> {
  return getEnabledRssSources()
}
