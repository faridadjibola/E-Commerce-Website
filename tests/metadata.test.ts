import { describe, expect, it } from 'vitest'
import { normalizeCanonicalPath } from '../lib/metadata'

describe('normalizeCanonicalPath', () => {
  it('keeps internal application paths clean', () => {
    expect(normalizeCanonicalPath('/shop?sort=price-desc#featured')).toBe('/shop')
    expect(normalizeCanonicalPath('https://tochiwears.com/about/')).toBe('/about/')
  })

  it('falls back to the homepage for unsafe inputs', () => {
    expect(normalizeCanonicalPath('//evil.example/')).toBe('/')
    expect(normalizeCanonicalPath('javascript:alert(1)')).toBe('/')
  })
})
