/**
 * Phone number formatting utilities
 * Formats phone numbers for display and input, but stores only digits
 */

/**
 * Strips all non-digit characters from a phone number string
 * @param phoneNumber - The phone number string (may contain formatting)
 * @returns Only the digits from the phone number
 */
export function stripPhoneNumber(phoneNumber: string | null | undefined): string {
  if (!phoneNumber) return ''
  return phoneNumber.replace(/\D/g, '')
}

/**
 * Formats a phone number for display: (XXX) XXX-XXXX
 * @param phoneNumber - The phone number (digits only or formatted)
 * @returns Formatted phone number string or empty string if invalid
 */
export function formatPhoneNumberForDisplay(
  phoneNumber: string | null | undefined
): string {
  if (!phoneNumber) return ''
  
  const digits = stripPhoneNumber(phoneNumber)
  
  if (digits.length === 0) return ''
  if (digits.length <= 3) return `(${digits}`
  if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`
  if (digits.length <= 10) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 10)}`
  }
  
  // If more than 10 digits, truncate to 10
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 10)}`
}

/**
 * Formats a phone number as the user types, applying mask in real-time
 * @param value - The input value from the user
 * @returns Formatted phone number string with mask applied
 */
export function formatPhoneNumberAsTyping(value: string): string {
  // Remove all non-digits
  const digits = stripPhoneNumber(value)
  
  // Limit to 10 digits (US phone number)
  const limitedDigits = digits.slice(0, 10)
  
  // Apply formatting based on length
  if (limitedDigits.length === 0) return ''
  if (limitedDigits.length <= 3) return `(${limitedDigits}`
  if (limitedDigits.length <= 6) {
    return `(${limitedDigits.slice(0, 3)}) ${limitedDigits.slice(3)}`
  }
  
  return `(${limitedDigits.slice(0, 3)}) ${limitedDigits.slice(3, 6)}-${limitedDigits.slice(6)}`
}

/**
 * Validates if a phone number has the correct number of digits
 * @param phoneNumber - The phone number to validate
 * @returns true if the phone number has 10 digits
 */
export function isValidPhoneNumber(phoneNumber: string | null | undefined): boolean {
  const digits = stripPhoneNumber(phoneNumber)
  return digits.length === 10
}

