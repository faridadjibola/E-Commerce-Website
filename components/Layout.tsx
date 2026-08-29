import React from 'react'
import Header from './Header'
import Footer from './Footer'
import WhatsAppButton from './WhatsAppButton'

const Layout: React.FC<{children: React.ReactNode}> = ({children}) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">{children}</main>
      <Footer />
      <WhatsAppButton />
    </div>
  )
}

export default Layout
