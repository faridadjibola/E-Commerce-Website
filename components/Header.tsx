"use client"
import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { signOut, useSession } from 'next-auth/react'
import { useCart } from './CartProvider'

const Header = () => {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const { data: session } = useSession()
  const router = useRouter()
  const { items } = useCart()
  const itemCount = items.reduce((total, item) => total + item.quantity, 0)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const query = search.trim()
    router.push(query ? `/shop?q=${encodeURIComponent(query)}` : '/shop')
  }

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b shadow-sm">
      <div className="container mx-auto px-6 py-3 flex items-center justify-between gap-4">
        <div className="flex items-center">
          <Link href="/" className="flex items-center gap-3 group" aria-label="Tochiwears home">
            <img src="/tochiwears logo.jpeg" alt="Tochiwears main logo" className="h-9 w-auto transition-transform group-hover:scale-[1.02]" />
          </Link>
        </div>

        <nav className="hidden md:flex items-center gap-4">
          <Link href="/" className="px-3 py-2 text-sm text-gray-700 hover:text-gray-900">Home</Link>
          <Link href="/shop" className="px-3 py-2 text-sm text-gray-700 hover:text-gray-900">Shop</Link>
          <div className="relative group">
            <button className="px-3 py-2 text-sm text-gray-700 hover:text-gray-900">Collections</button>
            <div className="absolute left-0 mt-2 bg-white border rounded shadow-lg p-3 hidden group-hover:block min-w-[180px]">
              <ul className="text-sm text-gray-600 space-y-2">
                <li><Link href="/watches" className="hover:text-gray-900">Watches</Link></li>
                <li><Link href="/belts" className="hover:text-gray-900">Belts</Link></li>
                <li><Link href="/jewelry" className="hover:text-gray-900">Jewelry</Link></li>
                <li><Link href="/glasses" className="hover:text-gray-900">Glasses</Link></li>
              </ul>
            </div>
          </div>
          <Link href="/about" className="px-3 py-2 text-sm text-gray-700 hover:text-gray-900">About</Link>
          <Link href="/contact" className="px-3 py-2 text-sm text-gray-700 hover:text-gray-900">Contact</Link>
        </nav>

        <div className="flex items-center gap-3 flex-1 justify-end">
          <form onSubmit={handleSearch} className="hidden md:flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-3 py-1.5 min-w-[240px]">
            <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0 text-gray-500" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="6" />
              <path d="M16 16L21 21" />
            </svg>
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products..."
              className="w-full bg-transparent text-sm outline-none placeholder:text-gray-500"
              aria-label="Search products"
            />
          </form>

          {session?.user ? (
            <>
              <Link href="/account" className="flex items-center gap-2 rounded-full border border-gray-200 px-3 py-2 text-sm font-medium hover:border-gray-300 hover:bg-gray-50 transition">
                <span>👤</span>
                <span>Account</span>
              </Link>
              <button className="px-3 py-2 text-sm rounded-full border border-gray-200 hover:bg-gray-100 transition" onClick={() => signOut({ callbackUrl: '/' })}>Sign out</button>
            </>
          ) : (
            <>
              <Link href="/auth/signin" className="inline-flex items-center justify-center rounded-full border border-gray-300 bg-white px-3 py-2 text-xs font-medium text-gray-900 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-gray-400 hover:bg-gray-50 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-gray-300/80">Sign in</Link>
              <Link href="/register" className="inline-flex items-center justify-center rounded-full bg-neutral-900 px-3 py-2 text-xs font-medium text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-neutral-800 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-neutral-300">Register</Link>
            </>
          )}
          <Link href="/cart" className="relative flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-lg hover:bg-gray-200 transition focus:outline-none focus:ring-2 focus:ring-gray-500" aria-label={`Shopping cart, ${itemCount} items`}>
            🛒
            {itemCount > 0 && <span className="absolute -right-1 -top-1 min-w-5 rounded-full bg-black px-1 text-center text-xs leading-5 text-white">{itemCount}</span>}
          </Link>
          <button className="md:hidden flex h-10 w-10 items-center justify-center rounded-full hover:bg-gray-100 transition focus:outline-none focus:ring-2 focus:ring-gray-500" onClick={() => setOpen(!open)} aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open}>Menu</button>
        </div>
      </div>

      {open && (
        <div className="md:hidden border-t bg-white">
          <div className="px-4 py-4 space-y-2">
            <form onSubmit={handleSearch} className="flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-3 py-2">
              <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0 text-gray-500" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="6" />
                <path d="M16 16L21 21" />
              </svg>
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search products..."
                className="w-full bg-transparent text-sm outline-none placeholder:text-gray-500"
                aria-label="Search products"
              />
            </form>
            <Link href="/" className="block px-3 py-2 rounded hover:bg-gray-50">Home</Link>
            <Link href="/shop" className="block px-3 py-2 rounded hover:bg-gray-50">Shop</Link>
            <Link href="/about" className="block px-3 py-2 rounded hover:bg-gray-50">About</Link>
            <Link href="/contact" className="block px-3 py-2 rounded hover:bg-gray-50">Contact</Link>
            <div className="pt-2 border-t mt-2">
              {session?.user ? (
                <button className="w-full text-left px-3 py-2" onClick={() => signOut({ callbackUrl: '/' })}>Sign out</button>
              ) : (
                <>
                  <Link href="/auth/signin" className="block px-3 py-2">Sign in</Link>
                  <Link href="/register" className="block px-3 py-2">Register</Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  )
}

export default Header
