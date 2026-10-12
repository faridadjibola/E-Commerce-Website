import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { isAdminEmail } from '../../../lib/admin'
import { verifyUser } from '../../../lib/users'

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials) return null
        const user = await verifyUser(credentials.email, credentials.password)
        if (user) return user
        return null
      }
    })
  ],
  session: { strategy: 'jwt' },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        const role = (user as any).role === 'admin' || isAdminEmail((user as any).email) ? 'admin' : 'user'
        token.user = { ...(user as any), role }
        token.role = role
        token.isAdmin = role === 'admin'
      } else {
        const email = String((token as any).email || (token as any).user?.email || '').toLowerCase()
        const role = isAdminEmail(email) ? 'admin' : 'user'
        token.role = role
        token.isAdmin = role === 'admin'
      }
      return token
    },
    async session({ session, token }) {
      const role = String((token as any).role || (token as any).user?.role || 'user')
      session.user = {
        ...(session.user as any),
        ...(token.user as any),
        role,
        isAdmin: !!token.isAdmin,
      }
      return session
    }
  },
  pages: {
    signIn: '/auth/signin'
  }
})
