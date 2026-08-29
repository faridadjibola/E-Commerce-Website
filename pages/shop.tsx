/// <reference types="react" />
import React, { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/router'
import ProductCard from '../components/ProductCard'
import { getAllProducts } from '../lib/products'

const Shop: React.FC = () => {
  const router = useRouter()
  const q = typeof router.query.q === 'string' ? router.query.q.toLowerCase().trim() : ''
  const categoryParam = typeof router.query.category === 'string' ? router.query.category : 'all'
  const [searchTerm, setSearchTerm] = useState(q)
  const [selectedCategory, setSelectedCategory] = useState(categoryParam)
  const [selectedGender, setSelectedGender] = useState('all')
  const [inStockOnly, setInStockOnly] = useState(false)
  const [sortBy, setSortBy] = useState('featured')

  useEffect(() => {
    setSearchTerm(q)
  }, [q])

  useEffect(() => {
    setSelectedCategory(categoryParam)
  }, [categoryParam])

  const categories = useMemo(() => {
    const allProducts = getAllProducts()
    return ['all', ...new Set(allProducts.map((product) => product.category))]
  }, [])

  const products = useMemo(() => {
    const allProducts = getAllProducts()

    const filtered = allProducts.filter((product) => {
      const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory
      const matchesGender = selectedGender === 'all' || product.gender === selectedGender || product.gender === 'unisex'
      const matchesStock = !inStockOnly || product.stock > 0
      const haystack = [
        product.name,
        product.category,
        product.gender,
        product.description,
        product.sku,
        product.slug,
      ]
        .join(' ')
        .toLowerCase()
      const matchesQuery = !searchTerm || haystack.includes(searchTerm.toLowerCase())

      return matchesCategory && matchesGender && matchesStock && matchesQuery
    })

    return filtered.sort((a, b) => {
      const aPrice = a.discount ?? a.price
      const bPrice = b.discount ?? b.price
      if (sortBy === 'price-asc') return aPrice - bPrice
      if (sortBy === 'price-desc') return bPrice - aPrice
      if (sortBy === 'rating') return (b.rating ?? 0) - (a.rating ?? 0)
      return 0
    })
  }, [searchTerm, selectedCategory, selectedGender, inStockOnly, sortBy])

  const applyFilters = (nextSearch: string, nextCategory: string) => {
    const query: Record<string, string> = {}

    if (nextSearch.trim()) {
      query.q = nextSearch.trim()
    }

    if (nextCategory !== 'all') {
      query.category = nextCategory
    }

    router.push({ pathname: '/shop', query }, undefined, { shallow: true })
  }

  const clearFilters = () => {
    setSearchTerm('')
    setSelectedCategory('all')
    setSelectedGender('all')
    setInStockOnly(false)
    setSortBy('featured')
    router.push('/shop', undefined, { shallow: true })
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between gap-4 flex-wrap">
        <h1 className="text-2xl font-semibold">Shop</h1>
        {(q || selectedCategory !== 'all') && (
          <div className="text-sm text-gray-600">
            Showing results for <span className="font-medium text-gray-900">“{q || selectedCategory}”</span>
          </div>
        )}
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        <aside className="w-full md:w-72 border rounded-xl p-4 bg-gray-50">
          <div className="mb-4">
            <h4 className="font-semibold mb-2">Search</h4>
            <input
              type="search"
              value={searchTerm}
              onChange={(event) => {
                const value = event.target.value
                setSearchTerm(value)
                applyFilters(value, selectedCategory)
              }}
              placeholder="Search products..."
              className="w-full border rounded-lg px-3 py-2 text-sm outline-none focus:border-gray-400 bg-white"
            />
          </div>

          <div className="mb-4">
            <h4 className="font-semibold mb-2">Categories</h4>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => {
                const isActive = selectedCategory === category
                return (
                  <button
                    key={category}
                    type="button"
                    onClick={() => {
                      const nextCategory = category
                      setSelectedCategory(nextCategory)
                      applyFilters(searchTerm, nextCategory)
                    }}
                    className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                      isActive ? 'bg-black text-white border-black' : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-100'
                    }`}
                  >
                    {category === 'all' ? 'All' : category}
                  </button>
                )
              })}
            </div>
          </div>

          <div className="space-y-4 text-sm text-gray-700">
            <div>
              <label htmlFor="gender" className="mb-2 block font-medium text-gray-900">Collection</label>
              <select id="gender" value={selectedGender} onChange={(event) => setSelectedGender(event.target.value)} className="w-full rounded-lg border bg-white px-3 py-2">
                <option value="all">All collections</option>
                <option value="men">Men</option>
                <option value="women">Women</option>
                <option value="unisex">Unisex</option>
              </select>
            </div>
            <label className="flex cursor-pointer items-center gap-2">
              <input type="checkbox" checked={inStockOnly} onChange={(event) => setInStockOnly(event.target.checked)} className="h-4 w-4" />
              In stock only
            </label>
          </div>

          <button
            type="button"
            onClick={clearFilters}
            className="mt-4 w-full border border-gray-200 bg-white rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
          >
            Clear filters
          </button>
        </aside>

        <div className="flex-1">
          <div className="mb-4 flex items-center justify-between">
            <div>Showing {products.length} products</div>
            <div>
              <label htmlFor="sort" className="sr-only">Sort products</label>
              <select id="sort" value={sortBy} onChange={(event) => setSortBy(event.target.value)} className="border px-2 py-1 rounded">
                <option value="featured">Featured</option>
                <option value="rating">Top rated</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
            </div>
          </div>

          {products.length === 0 ? (
            <div className="rounded border border-dashed bg-gray-50 p-8 text-center text-sm text-gray-600">
              No products match your search. Try a different keyword like belt, watch, jewelry, glasses, or men.
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {products.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Shop
