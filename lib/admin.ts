export type UserRole = 'user' | 'admin'

export function normalizeRole(role?: string | null): UserRole {
  return role === 'admin' ? 'admin' : 'user'
}

export function isAdminEmail(email?: string | null) {
  const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase()
  if (!adminEmail || !email) return false
  return email.trim().toLowerCase() === adminEmail
}

export function isAdminUser(user?: { email?: string | null; role?: string | null }) {
  if (!user) return false
  return normalizeRole(user.role) === 'admin' || isAdminEmail(user.email)
}
