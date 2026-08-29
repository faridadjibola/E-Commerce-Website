import type { NextPage } from 'next'
import ProductCard from '../components/ProductCard'
import { getAllProducts } from '../lib/products'

const Glasses: NextPage = () => {
  const items = getAllProducts().filter((p) => p.category.toLowerCase().includes('glass'))

  return (
    <div>
      <h1 className="text-3xl font-semibold mb-6">Glasses</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {items.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  )
}

export default Glasses
