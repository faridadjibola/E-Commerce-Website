import bcrypt from 'bcryptjs'

type User = {
  id: string
  name: string
  email: string
  passwordHash: string
}

const USERS: User[] = []

export async function createUser(name: string, email: string, password: string) {
  const existing = USERS.find(u => u.email === email)
  if (existing) return null
  const hash = await bcrypt.hash(password, 8)
  const user: User = { id: `u${Date.now()}`, name, email, passwordHash: hash }
  USERS.push(user)
  return { id: user.id, name: user.name, email: user.email }
}

export async function findUserByEmail(email: string) {
  return USERS.find(u => u.email === email) || null
}

export async function verifyUser(email: string, password: string) {
  const user = USERS.find(u => u.email === email)
  if (!user) return null
  const ok = await bcrypt.compare(password, user.passwordHash)
  if (!ok) return null
  return { id: user.id, name: user.name, email: user.email }
}

export async function getAllUsers() {
  return USERS.map(u => ({ id: u.id, name: u.name, email: u.email }))
}

export default USERS
