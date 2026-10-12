import '../styles/globals.css'
import type { AppProps } from 'next/app'
import Head from 'next/head'
import Layout from '../components/Layout'
import { CartProvider } from '../components/CartProvider'
import { AuthProvider } from '../components/AuthProvider'
import { SessionProvider } from 'next-auth/react'
import AppErrorBoundary from '../components/AppErrorBoundary'

export default function App({ Component, pageProps }: AppProps) {
  const { session, ...rest } = pageProps as any
  return (
    <SessionProvider session={session}>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
      </Head>
      <AuthProvider>
        <CartProvider>
          <AppErrorBoundary>
            <Layout>
              <Component {...rest} />
            </Layout>
          </AppErrorBoundary>
        </CartProvider>
      </AuthProvider>
    </SessionProvider>
  )
}
