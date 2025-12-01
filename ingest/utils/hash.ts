import { createHash } from 'crypto'

export function sha256(input: string): string {
  return createHash('sha256').update(input).digest('hex')
}

export function hashString(input: string): string {
  return ''
}

export function hashObject(obj: Record<string, unknown>): string {
  return ''
}

export function generateId(): string {
  return ''
}

