// file: /components/tabs/ContentPreferencesTab.tsx
'use client'

import CountrySelect from '@/components/ui/countrySelect'
import { createClient } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'

const TOPICS = ['Tariffs', 'Healthcare', 'Taxation', 'Immigration', 'Education']

const SPECTRUM = ['Progressive', 'Centrist', 'Conservative', 'All']

export default function ContentPreferencesTab() {
  const [loading, setLoading] = useState(true)
  const [country, setCountry] = useState<any>(null)
  const [topics, setTopics] = useState<string[]>([])
  const [excludedSources, setExcludedSources] = useState<string[]>([])
  const [spectrum, setSpectrum] = useState<string>('All')
  const supabase = createClient()

  useEffect(() => {
    const loadPrefs = async () => {
      const {
        data: { user }
      } = await supabase.auth.getUser()

      if (user) {
        const { data } = await supabase
          .from('profiles')
          .select('preferences')
          .eq('id', user.id)
          .single()

        if (data?.preferences) {
          setCountry(data.preferences.country || null)
          setTopics(data.preferences.topics || [])
          setExcludedSources(data.preferences.excludedSources || [])
          setSpectrum(data.preferences.spectrum || 'All')
        }
      }
      setLoading(false)
    }

    loadPrefs()
  }, [])

  const toggleTopic = (topic: string) => {
    setTopics(prev =>
      prev.includes(topic) ? prev.filter(t => t !== topic) : [...prev, topic]
    )
  }

  const toggleSource = (src: string) => {
    setExcludedSources(prev =>
      prev.includes(src) ? prev.filter(s => s !== src) : [...prev, src]
    )
  }

  const handleSave = async () => {
    const {
      data: { user }
    } = await supabase.auth.getUser()

    if (user) {
      await supabase
        .from('profiles')
        .update({
          preferences: {
            country,
            topics,
            excludedSources,
            spectrum
          }
        })
        .eq('id', user.id)
    }
  }

  if (loading) return <p>Loading...</p>

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold">Content Preferences</h2>

      <div>
        <label className="block text-sm">Country</label>
        <CountrySelect
          onChange={e => setCountry(e.target.value)}
          placeholder="Select a country"
        />
      </div>

      <div>
        <label className="block text-sm mb-1">Topics You Care About</label>
        <div className="flex flex-wrap gap-2">
          {TOPICS.map(topic => (
            <button
              key={topic}
              className={`rounded border px-3 py-1 ${
                topics.includes(topic)
                  ? 'bg-blue-500 text-white'
                  : 'text-gray-700'
              }`}
              onClick={() => toggleTopic(topic)}
            >
              {topic}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm mb-1">Exclude These Sources</label>
        <div className="flex flex-col gap-1">
          {['New York Times', 'Fox News', 'Al Jazeera', 'BBC', 'RT'].map(
            src => (
              <label key={src} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={excludedSources.includes(src)}
                  onChange={() => toggleSource(src)}
                />
                {src}
              </label>
            )
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm mb-1">Political Spectrum</label>
        <div className="flex flex-wrap gap-2">
          {SPECTRUM.map(s => (
            <button
              key={s}
              className={`rounded border px-3 py-1 ${
                spectrum === s ? 'bg-blue-500 text-white' : 'text-gray-700'
              }`}
              onClick={() => setSpectrum(s)}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <button
        className="rounded bg-blue-500 px-4 py-2 text-white"
        onClick={handleSave}
      >
        Save
      </button>
    </div>
  )
}
