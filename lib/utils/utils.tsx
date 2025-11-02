type CurrencyFormatType = {
  value: number | string
  country?: string
  formatType?: 'decimal' | 'currency' | 'percent'
  currency?: string
  digits?: number
}

/*
country: Lookup country code to encode properly. Format en-US, en-GB, etc.
currency: Lookup currency 3 digit value to display properly. Link to get codes https://www.six-group.com/en/products-services/financial-information/market-reference-data/data-standards.html
*/
export function formatCurrency({
  value,
  country = 'en-US',
  formatType = 'currency',
  currency = 'USD',
  digits = 2
}: CurrencyFormatType): string {
  const parsedValue = typeof value === 'string' ? parseFloat(value) : value

  return new Intl.NumberFormat(country, {
    style: formatType,
    currency,
    minimumFractionDigits: digits
  }).format(parsedValue)
}

/*
country: Lookup country code to encode properly. Format en-US, en-GB, etc.
*/
export function formatNumber({
  value,
  country = 'en-US',
  formatType = 'decimal',
  digits = 2
}: CurrencyFormatType): string {
  const parsedValue = typeof value === 'string' ? parseFloat(value) : value

  return new Intl.NumberFormat(country, {
    style: formatType,
    minimumFractionDigits: digits
  }).format(parsedValue)
}

export const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}
