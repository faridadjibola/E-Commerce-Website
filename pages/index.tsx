import type { FormEvent } from 'react'
import { useState } from 'react'
import type { NextPage } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import PageMeta from '../components/PageMeta'
import ProductCard from '../components/ProductCard'
import { getAllProducts } from '../lib/products'

const Home: NextPage = () => {
  const [newsletterEmail, setNewsletterEmail] = useState('')
  const [newsletterStatus, setNewsletterStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [newsletterMessage, setNewsletterMessage] = useState('')
  const products = getAllProducts()
  const newArrivals = products.filter((product) => product.newArrival).slice(0, 6)
  const bestSellers = [...products].sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0)).slice(0, 6)
  const trendingNow = products.filter((product) => product.discount).slice(0, 6)

  async function handleNewsletterSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setNewsletterStatus('submitting')
    setNewsletterMessage('')

    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: newsletterEmail }),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Unable to subscribe right now.')
      setNewsletterStatus('success')
      setNewsletterMessage(data.message)
      setNewsletterEmail('')
    } catch (error) {
      setNewsletterStatus('error')
      setNewsletterMessage(error instanceof Error ? error.message : 'Unable to subscribe right now.')
    }
  }

  const ProductSection = ({
    title,
    items,
    href,
  }: {
    title: string
    items: typeof products
    href: string
  }) => (
    <section>
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="text-2xl font-semibold text-gray-900">{title}</h2>
        <Link href={href} className="inline-flex items-center text-sm font-medium text-gray-700 transition hover:text-gray-900">
          View all →
        </Link>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {items.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  )

  return (
    <div>
      <PageMeta title="Home" description="Shop Tochiwears accessories including jewelry, watches, belts, glasses, and everyday essentials." canonicalPath="/" />
      <div className="space-y-9 sm:space-y-12">
        <section className="relative overflow-hidden rounded-2xl border border-gray-200 bg-black sm:rounded-[22px]">
          <div className="relative h-[350px] sm:h-[410px] md:h-[560px]">
            <Image
            src="/products/street-canvas-web-belt/main.webp"
            alt="Street fashion accessory styling"
            fill
            sizes="100vw"
            priority
            className="absolute inset-0 h-full w-full object-cover object-center opacity-90"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/45 to-black/20" />
          <div className="relative z-10 flex h-full items-center">
            <div className="container mx-auto px-4 text-white">
              <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-white/85 sm:text-xs sm:tracking-[0.32em]">Street premium</p>
              <h1 className="mt-3 max-w-xl text-3xl font-black leading-tight sm:text-4xl md:text-6xl">City-ready essentials for everyday style.</h1>
              <p className="mt-3 max-w-lg text-sm leading-relaxed text-white/90 sm:mt-4 sm:text-base md:text-lg">Statement accessories for the streets, the studio, and every stop between.</p>
              <div className="mt-5 flex flex-wrap gap-2 sm:mt-6 sm:gap-3">
                <Link href="/men" className="inline-flex min-h-11 items-center justify-center whitespace-nowrap rounded-full bg-white px-5 text-sm font-semibold text-black shadow-sm transition hover:bg-gray-100">Shop Men</Link>
                <Link href="/women" className="inline-flex min-h-11 items-center justify-center whitespace-nowrap rounded-full border border-white/80 bg-white/10 px-5 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/15">Shop Women</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-xl font-semibold text-gray-900 sm:text-2xl">Featured Categories</h2>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <Link href="/jewelry" className="group overflow-hidden rounded-lg border bg-white">
            <div className="relative h-48 overflow-hidden">
              <Image src="/products/cuban-link-chain/main.webp" alt="Cuban Link Chain jewelry" fill sizes="(max-width: 768px) 50vw, 25vw" className="h-full w-full object-cover object-center transition duration-300 group-hover:scale-105" />
              <div className="absolute inset-0 bg-black/15" />
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-gray-900">Jewelry</h3>
              <div className="mt-2 text-sm text-gray-600">Shop Now →</div>
            </div>
          </Link>

          <Link href="/watches" className="group overflow-hidden rounded-lg border bg-white">
            <div className="relative h-48 overflow-hidden">
              <Image src="/products/oversized-chronograph-watch/main.webp" alt="Oversized chronograph wristwatch" fill sizes="(max-width: 768px) 50vw, 25vw" className="h-full w-full object-cover object-center transition duration-300 group-hover:scale-105" />
              <div className="absolute inset-0 bg-black/15" />
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-gray-900">Wristwatches</h3>
              <div className="mt-2 text-sm text-gray-600">Shop Now →</div>
            </div>
          </Link>

          <Link href="/belts" className="group overflow-hidden rounded-lg border bg-white">
            <div className="relative h-48 overflow-hidden">
              <Image src="/products/oversized-buckle-leather-belt/main.webp" alt="Oversized buckle leather belt" fill sizes="(max-width: 768px) 50vw, 25vw" className="h-full w-full object-cover object-center transition duration-300 group-hover:scale-105" />
              <div className="absolute inset-0 bg-black/15" />
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-gray-900">Belts</h3>
              <div className="mt-2 text-sm text-gray-600">Shop Now →</div>
            </div>
          </Link>

          <Link href="/glasses" className="group overflow-hidden rounded-lg border bg-white">
            <div className="relative h-48 overflow-hidden">
              <Image src="/products/oversized-square-shades/main.webp" alt="Oversized square sunglasses" fill sizes="(max-width: 768px) 50vw, 25vw" className="h-full w-full object-cover object-center transition duration-300 group-hover:scale-105" />
              <div className="absolute inset-0 bg-black/15" />
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-gray-900">Glasses</h3>
              <div className="mt-2 text-sm text-gray-600">Shop Now →</div>
            </div>
          </Link>
        </div>
      </section>

      <ProductSection title="New Arrivals" items={newArrivals} href="/shop" />
      <ProductSection title="Best Sellers" items={bestSellers} href="/shop" />
      <ProductSection title="Trending Now" items={trendingNow} href="/shop" />

      <section>
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-2xl font-semibold text-gray-900">Curated for You</h2>
          <Link href="/shop" className="inline-flex items-center text-sm font-medium text-gray-700 transition hover:text-gray-900">
            View all →
          </Link>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-4">
          {products.slice(0, 8).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      <section>
        <div className="flex items-center justify-between rounded-lg bg-gray-800 p-8 text-white">
          <div>
            <h3 className="text-2xl font-semibold">Complete the Look</h3>
            <p className="mt-2">Street-ready accessories for the hustle, the hangout, and every move in between.</p>
          </div>
          <Link href="/shop" className="rounded-md bg-white px-4 py-2 text-black">Shop Now</Link>
        </div>
      </section>

      <section>
        <div className="rounded-lg border p-6 text-center">
          <h3 className="text-xl font-semibold text-gray-900">Join the Tochiwears Family</h3>
          <p className="mt-2 text-sm text-gray-600">Get updates about new collections, special offers and exclusive deals.</p>
          <form onSubmit={handleNewsletterSubmit} className="mt-4 flex flex-col justify-center gap-2 sm:flex-row">
            <label htmlFor="newsletter-email" className="sr-only">Email address</label>
            <input id="newsletter-email" type="email" required maxLength={254} value={newsletterEmail} onChange={(event) => setNewsletterEmail(event.target.value)} placeholder="Email address" autoComplete="email" className="w-full min-w-0 rounded-md border px-3 py-2 sm:w-80 sm:rounded-r-none" aria-describedby={newsletterMessage ? 'newsletter-message' : undefined} />
            <button type="submit" disabled={newsletterStatus === 'submitting'} className="min-h-11 rounded-md bg-black px-4 py-2 text-white disabled:cursor-not-allowed disabled:opacity-60 sm:rounded-l-none">
              {newsletterStatus === 'submitting' ? 'Subscribing...' : 'Subscribe'}
            </button>
          </form>
          {newsletterMessage && <p id="newsletter-message" role={newsletterStatus === 'error' ? 'alert' : 'status'} className={`mt-3 text-sm ${newsletterStatus === 'error' ? 'text-red-700' : 'text-gray-700'}`}>{newsletterMessage}</p>}
        </div>
      </section>
    </div>
    </div>
  )
}

export default Home
