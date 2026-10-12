import bcrypt from 'bcryptjs'
import { normalizeRole, isAdminEmail } from './admin'

export type UserRole = 'user' | 'admin'

type User = {
  id: string
  name: string
  email: string
  passwordHash: string
  role: UserRole
}

const USERS: User[] = []

export async function createUser(name: string, email: string, password: string) {
  const normalizedEmail = email.trim().toLowerCase()
  const existing = USERS.find((u) => u.email.toLowerCase() === normalizedEmail)
  if (existing) return null

  const hash = await bcrypt.hash(password, 8)
  const role = isAdminEmail(normalizedEmail) ? 'admin' : 'user'
  const user: User = { id: `u${Date.now()}`, name, email: normalizedEmail, passwordHash: hash, role }
  USERS.push(user)
  return { id: user.id, name: user.name, email: user.email, role: user.role }
}

export async function findUserByEmail(email: string) {
  return USERS.find((u) => u.email.toLowerCase() === email.trim().toLowerCase()) || null
}

export async function verifyUser(email: string, password: string) {
  const user = await findUserByEmail(email)
  if (!user) return null
  const ok = await bcrypt.compare(password, user.passwordHash)
  if (!ok) return null
  return { id: user.id, name: user.name, email: user.email, role: user.role }
}

export async function getAllUsers() {
  return USERS.map((u) => ({ id: u.id, name: u.name, email: u.email, role: u.role }))
}

export default USERS
