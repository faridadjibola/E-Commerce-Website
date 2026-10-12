import { describe, expect, it } from 'vitest'
import { normalizeNewsletterEmail } from '../lib/newsletter'

describe('normalizeNewsletterEmail', () => {
  it('trims and lowercases valid email addresses', () => {
    expect(normalizeNewsletterEmail('  ADA@Example.com  ')).toBe('ada@example.com')
  })

  it('rejects malformed, non-string, and overly long values', () => {
    expect(normalizeNewsletterEmail('not-an-email')).toBeNull()
    expect(normalizeNewsletterEmail(null)).toBeNull()
    expect(normalizeNewsletterEmail(`${'a'.repeat(250)}@example.com`)).toBeNull()
  })
})