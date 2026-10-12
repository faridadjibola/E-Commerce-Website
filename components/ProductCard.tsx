import Link from 'next/link'
import { Product } from '../lib/products'
import SafeImage from './SafeImage'

const ProductCard: React.FC<{product: Product}> = ({product}) => {
  const price = product.discount ?? product.price
  return (
    <div className="group flex h-full flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg">
      <Link href={`/product/${product.slug}`} className="flex h-full flex-col">
        <div className="relative h-48 overflow-hidden bg-gray-100 sm:h-52 md:h-60">
          <SafeImage src={product.images[0]} alt={`${product.name} product photo`} width={600} height={600} sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw" className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />
        </div>
        <div className="flex flex-1 flex-col p-3 sm:p-4">
          <div className="mb-2 text-[10px] font-medium uppercase tracking-[0.2em] text-gray-500">Featured</div>
          <h3 className="min-h-[2.75rem] text-sm font-semibold leading-5 text-gray-900 sm:text-base">{product.name}</h3>
          <div className="mt-auto flex items-center justify-between gap-3 pt-3">
            <div className="text-base font-bold text-gray-900 sm:text-lg">₦{price.toLocaleString()}</div>
            <div className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-1 text-[11px] font-medium text-amber-700">
              <span aria-hidden="true">★</span>
              <span>{product.rating ?? 0}</span>
            </div>
          </div>
        </div>
      </Link>
    </div>
  )
}

export default ProductCard
