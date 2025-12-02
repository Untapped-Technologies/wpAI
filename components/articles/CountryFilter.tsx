'use client'

import { useMemo } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'

type CountryFilterProps = {
  countries: string[]
  statesByCountry: Record<string, string[]>
  selectedCountry?: string
  selectedState?: string
}

export function CountryFilter({
  countries,
  statesByCountry,
  selectedCountry,
  selectedState
}: CountryFilterProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const statesForSelectedCountry = useMemo(
    () => (selectedCountry ? statesByCountry[selectedCountry] ?? [] : []),
    [selectedCountry, statesByCountry]
  )

  const updateParams = (updates: {
    country?: string | null
    state?: string | null
  }) => {
    const params = new URLSearchParams(searchParams.toString())

    if (updates.country === null) {
      params.delete('country')
    } else if (typeof updates.country === 'string') {
      params.set('country', updates.country)
    }

    if (updates.state === null) {
      params.delete('state')
    } else if (typeof updates.state === 'string') {
      params.set('state', updates.state)
    }

    // Reset to first page when filters change
    params.set('page', '1')

    router.replace(`${pathname}?${params.toString()}`)
  }

  const handleCountryChange = (value: string) => {
    if (!value) {
      updateParams({ country: null, state: null })
    } else {
      updateParams({ country: value, state: null })
    }
  }

  const handleStateChange = (value: string) => {
    if (!value) {
      updateParams({ state: null })
    } else {
      updateParams({ state: value })
    }
  }

  if (!countries.length) return null

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <div className="space-y-2">
        <div className="text-sm font-medium text-slate-800">Country</div>
        <Select
          value={selectedCountry ?? ''}
          onValueChange={handleCountryChange}
        >
          <SelectTrigger>
            <SelectValue placeholder="All countries" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All countries</SelectItem>
            {countries.map(country => (
              <SelectItem key={country} value={country}>
                {country}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <div className="text-sm font-medium text-slate-800">State / Region</div>
        <Select
          value={selectedState ?? ''}
          onValueChange={handleStateChange}
          disabled={!selectedCountry || statesForSelectedCountry.length === 0}
        >
          <SelectTrigger>
            <SelectValue
              placeholder={
                !selectedCountry
                  ? 'Select a country first'
                  : statesForSelectedCountry.length
                  ? 'All states / regions'
                  : 'No states for this country'
              }
            />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All states / regions</SelectItem>
            {statesForSelectedCountry.map(state => (
              <SelectItem key={state} value={state}>
                {state}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}



