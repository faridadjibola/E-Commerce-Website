import { NextPage } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { useEffect, useMemo, useState } from 'react'
import type { Product } from '../../../lib/products'

const AdminProducts: NextPage = () => {
  const router = useRouter()
  const { data: session } = useSession()
  const [products, setProducts] = useState<Product[]>([])
  const [search, setSearch] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    if (!session) return
    const isAdmin = Boolean((session.user as any)?.role === 'admin' || (session.user as any)?.isAdmin)
    if (!isAdmin) {
      router.replace('/auth/signin?callbackUrl=/admin/products')
      return
    }

    const loadProducts = async () => {
      try {
        const res = await fetch('/api/admin/products')
        if (!res.ok) {
          const data = await res.json().catch(() => ({}))
          throw new Error(data.error || 'Unable to load products.')
        }
        setProducts(await res.json())
      } catch (loadError) {
        setError(loadError instanceof Error ? loadError.message : 'Unable to load products.')
      }
    }

    loadProducts()
  }, [session, router])

  const filteredProducts = useMemo(() => {
    const query = search.trim().toLowerCase()
    if (!query) return products
    return products.filter((product) =>
      [product.name, product.slug, product.category, product.sku, product.description]
        .join(' ')
        .toLowerCase()
        .includes(query)
    )
  }, [products, search])

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 border-b border-gray-200 pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-gray-500">Catalog</p>
          <h1 className="mt-1 text-2xl font-semibold text-gray-900">Products</h1>
        </div>
        <Link href="/admin/products/create" className="inline-flex items-center justify-center rounded-xl bg-black px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-gray-800">
          Create product
        </Link>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
        <label htmlFor="product-search" className="mb-2 block text-sm font-medium text-gray-700">
          Search products
        </label>
        <input
          id="product-search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search by name, SKU, category..."
          className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-900 outline-none transition focus:border-gray-400 focus:bg-white"
        />
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 text-left text-sm text-gray-700">
            <thead className="bg-gray-50 text-xs uppercase tracking-[0.12em] text-gray-500">
              <tr>
                <th className="px-4 py-3 font-medium">Product</th>
                <th className="px-4 py-3 font-medium">Category</th>
                <th className="px-4 py-3 font-medium">Price</th>
                <th className="px-4 py-3 font-medium">Stock</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 text-right font-medium">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-10 text-center text-gray-500">
                    No products found. Try another search or create a new product.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => {
                  const lowStock = product.stock < 5
                  return (
                    <tr key={product.id} className="transition hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <div className="flex min-w-56 items-center gap-3">
                          <Image src={product.images?.[0] || '/tochiwears logo.jpeg'} alt={product.name} width={64} height={64} className="h-14 w-14 rounded-xl object-cover" />
                          <div>
                            <div className="font-medium text-gray-900">{product.name}</div>
                            <div className="mt-0.5 text-xs text-gray-500">{product.sku}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 capitalize">{product.category}</td>
                      <td className="px-4 py-3 font-medium text-gray-900">₦{Number(product.price).toLocaleString()}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-2 rounded-full px-2.5 py-1 text-xs font-medium ${lowStock ? 'bg-red-50 text-red-700' : 'bg-emerald-50 text-emerald-700'}`}>
                          <span className={`h-1.5 w-1.5 rounded-full ${lowStock ? 'bg-red-500' : 'bg-emerald-500'}`} />
                          {product.stock}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {product.newArrival ? (
                          <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">New arrival</span>
                        ) : (
                          <span className="text-xs text-gray-500">Active</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Link href={`/admin/products/${product.id}`} className="inline-flex rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50">
                          Edit
                        </Link>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default AdminProducts
