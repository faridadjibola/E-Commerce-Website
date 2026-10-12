import React from 'react'
import Header from './Header'
import Footer from './Footer'
import WhatsAppButton from './WhatsAppButton'

const Layout: React.FC<{children: React.ReactNode}> = ({children}) => {
  return (
    <div className="min-h-screen flex flex-col">
      <a
        href="#main-content"
        className="fixed left-4 top-4 z-[100] -translate-y-24 rounded-lg bg-neutral-950 px-4 py-2 text-sm font-semibold text-white transition focus:translate-y-0"
      >
        Skip to main content
      </a>
      <Header />
      <main id="main-content" className="flex-1 container mx-auto px-4 py-8">{children}</main>
      <Footer />
      <WhatsAppButton />
    </div>
  )
}

export default Layout
