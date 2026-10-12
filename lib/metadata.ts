export const SITE_URL = 'https://tochiwears.com'

export function normalizeCanonicalPath(value: string): string {
  const trimmed = value.trim()
  if (!trimmed || trimmed.startsWith('javascript:') || trimmed.startsWith('data:')) return '/'

  if (/^https?:\/\//i.test(trimmed)) {
    try {
      const url = new URL(trimmed)
      if (url.origin !== new URL(SITE_URL).origin) return '/'
      return url.pathname || '/'
    } catch {
      return '/'
    }
  }

  if (trimmed.startsWith('//')) return '/'
  const path = trimmed.split(/[?#]/, 1)[0]
  return path.startsWith('/') ? path : `/${path}`
}
