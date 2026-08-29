import type { NextPage } from 'next'
import Link from 'next/link'
import ProductCard from '../components/ProductCard'
import { getAllProducts } from '../lib/products'

const Home: NextPage = () => {
  const products = getAllProducts()
  return (
    <div className="space-y-12">
      <section className="relative rounded-lg overflow-hidden">
        <div className="h-96 bg-black flex items-center">
          <div className="container mx-auto px-4 text-white">
            <h1 className="text-4xl md:text-6xl font-bold">Elevate Your Style with Tochiwears</h1>
            <p className="mt-4 text-lg">Discover premium accessories designed to complete your look.</p>
            <div className="mt-6 flex gap-3">
              <Link href="/men" className="bg-white text-black px-4 py-2 rounded-md">Shop Men</Link>
              <Link href="/women" className="border border-white text-white px-4 py-2 rounded-md">Shop Women</Link>
            </div>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">Featured Categories</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link href="/jewelry" className="rounded-lg overflow-hidden group border">
            <div className="h-48 flex items-center justify-center text-2xl font-bold text-white" style={{ background: 'linear-gradient(135deg, #d1a35d, #7a4d3a)' }}>Jewelry</div>
            <div className="p-4 bg-white">
              <h3 className="font-semibold">Jewelry</h3>
              <div className="mt-2 text-sm text-gray-600">Shop Now →</div>
            </div>
          </Link>

          <Link href="/watches" className="rounded-lg overflow-hidden group border">
            <div className="h-48 flex items-center justify-center text-2xl font-bold text-white" style={{ background: 'linear-gradient(135deg, #374151, #9ca3af)' }}>Watches</div>
            <div className="p-4 bg-white">
              <h3 className="font-semibold">Wristwatches</h3>
              <div className="mt-2 text-sm text-gray-600">Shop Now →</div>
            </div>
          </Link>

          <Link href="/belts" className="rounded-lg overflow-hidden group border">
            <div className="h-48 flex items-center justify-center text-2xl font-bold text-white" style={{ background: 'linear-gradient(135deg, #6b4f3a, #b98b5f)' }}>Belts</div>
            <div className="p-4 bg-white">
              <h3 className="font-semibold">Belts</h3>
              <div className="mt-2 text-sm text-gray-600">Shop Now →</div>
            </div>
          </Link>

          <Link href="/glasses" className="rounded-lg overflow-hidden group border">
            <div className="h-48 flex items-center justify-center text-2xl font-bold text-white" style={{ background: 'linear-gradient(135deg, #312e81, #818cf8)' }}>Glasses</div>
            <div className="p-4 bg-white">
              <h3 className="font-semibold">Glasses</h3>
              <div className="mt-2 text-sm text-gray-600">Shop Now →</div>
            </div>
          </Link>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">New Arrivals</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {products.map(p => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      <section>
        <div className="rounded-lg bg-gray-800 text-white p-8 flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-semibold">Complete Your Look</h3>
            <p className="mt-2">Premium accessories for every occasion.</p>
          </div>
          <Link href="/shop" className="bg-white text-black px-4 py-2 rounded-md">Shop Now</Link>
        </div>
      </section>


      <section>
        <div className="rounded-lg border p-6 text-center">
          <h3 className="text-xl font-semibold">Join the Tochiwears Family</h3>
          <p className="mt-2 text-sm text-gray-600">Get updates about new collections, special offers and exclusive deals.</p>
          <div className="mt-4 flex justify-center">
            <input type="email" placeholder="Email address" className="border px-3 py-2 rounded-l-md w-80" />
            <button className="bg-black text-white px-4 rounded-r-md">Subscribe</button>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home
