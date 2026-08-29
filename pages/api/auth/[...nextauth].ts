import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
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
        token.user = user
        // mark admin based on ADMIN_EMAIL env
        const adminEmail = process.env.ADMIN_EMAIL || 'admin@tochiwears.ng'
        token.isAdmin = (user as any).email === adminEmail
      }
      return token
    },
    async session({ session, token }) {
      // @ts-ignore
      session.user = token.user
      // @ts-ignore
      session.user.isAdmin = token.isAdmin || false
      return session
    }
  },
  pages: {
    signIn: '/auth/signin'
  }
})
