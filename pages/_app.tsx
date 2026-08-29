import '../styles/globals.css'
import type { AppProps } from 'next/app'
import Layout from '../components/Layout'
import { CartProvider } from '../components/CartProvider'
import { SessionProvider } from 'next-auth/react'

export default function App({ Component, pageProps }: AppProps) {
  const { session, ...rest } = pageProps as any
  return (
    <SessionProvider session={session}>
      <CartProvider>
        <Layout>
          <Component {...rest} />
        </Layout>
      </CartProvider>
    </SessionProvider>
  )
}
