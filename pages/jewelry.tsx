import type { NextPage } from 'next'
import Image from 'next/image'
import ProductCard from '../components/ProductCard'
import { getAllProducts } from '../lib/products'

const Jewelry: NextPage = () => {
  const items = getAllProducts().filter((p) => p.category.toLowerCase().includes('jewel'))

  return (
    <div className="space-y-8">
      <section className="relative overflow-hidden rounded-2xl border border-gray-200 bg-gray-100">
        <div className="grid md:grid-cols-2">
          <div className="relative h-72 w-full md:h-full">
            <Image
              src="/products/cuban-link-chain/main.webp"
              alt="Silver Cuban link chain necklace"
              fill
              priority
              className="object-cover"
            />
          </div>
          <div className="flex items-center justify-center bg-white p-8 md:p-12">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">Featured collection</p>
              <h1 className="mt-3 text-3xl font-semibold text-gray-900 md:text-4xl">Jewelry</h1>
              <p className="mt-3 max-w-md text-sm text-gray-600 md:text-base">
                Beautiful finishes and everyday luxury for polished, confident outfits.
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {items.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  )
}

export default Jewelry
