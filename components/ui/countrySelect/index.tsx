'use client'

import { useEffect, useState } from 'react'

type Country = {
  name: { common: string }
  cca2: string
  languages?: Record<string, string>
  flags: { svg: string }
}

type CountryValue = {
  name: string
  iso: string
  lang: string
  color: string
}

type CountrySelectProps = {
  onChange: (e: { target: { value: CountryValue } }) => void
  placeholder?: string
}

export default function CountrySelect({
  onChange,
  placeholder = 'Select a country'
}: CountrySelectProps) {
  const [countries, setCountries] = useState<Country[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [selected, setSelected] = useState<CountryValue | null>(null)

  useEffect(() => {
    fetch('https://restcountries.com/v3.1/all?fields=name,cca2,languages,flags')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          const sorted = data.sort((a, b) =>
            a.name.common.localeCompare(b.name.common)
          )
          setCountries(sorted)
        } else {
          console.error('Unexpected payload from API:', data)
        }
      })
      .catch(err => console.error('Failed to load countries', err))
  }, [])

  const handleSelect = (country: Country) => {
    const lang = country.languages ? Object.keys(country.languages)[0] : ''

    const value: CountryValue = {
      name: country.name.common,
      iso: country.cca2,
      lang,
      color: '#000000' // placeholder
    }

    setSelected(value)
    setIsOpen(false)
    onChange({ target: { value } })
  }

  return (
    <div className="relative w-full">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between rounded border px-4 py-2"
      >
        {selected ? (
          <span className="flex items-center gap-2 text-[#254541]">
            <img
              src={`https://flagsapi.com/${selected.iso}/flat/24.png`}
              alt={selected.name}
              className="h-4 w-6"
            />
            {selected.name}
          </span>
        ) : (
          <span className="text-gray-500">{placeholder}</span>
        )}

        <svg
          className={`h-4 w-4 transform transition ${
            isOpen ? 'rotate-180' : 'rotate-0'
          }`}
          viewBox="0 0 20 20"
        >
          <path d="M6 8l4 4 4-4" fill="none" stroke="currentColor" />
        </svg>
      </button>

      {isOpen && (
        <ul className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded border bg-white shadow">
          {countries.map(country => (
            <li
              key={country.cca2}
              onClick={() => handleSelect(country)}
              className="flex cursor-pointer items-center gap-2 px-4 py-2 hover:bg-gray-100"
            >
              <img
                src={country.flags.svg}
                alt={country.name.common}
                className="h-4 w-6"
              />
              {country.name.common}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
