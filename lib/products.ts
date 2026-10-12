import seededProducts from './seeded-products.json'

export type ProductCategory = 'jewelry' | 'watches' | 'belts' | 'glasses'
export type ProductGender = 'men' | 'women' | 'unisex'

export type Product = {
  id: string
  name: string
  slug: string
  price: number
  discount?: number
  rating?: number
  category: ProductCategory | string
  gender: ProductGender
  images: string[]
  sku: string
  stock: number
  description: string
  sizes?: string[]
  colors?: string[]
  newArrival?: boolean
}

export const PRODUCT_CATEGORIES: ProductCategory[] = ['jewelry', 'watches', 'belts', 'glasses']
export const PRODUCT_GENDERS: ProductGender[] = ['men', 'women', 'unisex']

export function normalizeCategory(value?: string): ProductCategory {
  const normalized = (value || '').trim().toLowerCase()
  if (normalized === 'belts') return 'belts'
  if (normalized === 'watches' || normalized === 'watch') return 'watches'
  if (normalized === 'glasses' || normalized === 'sunglasses') return 'glasses'
  return 'jewelry'
}

export function normalizeGender(value?: string): ProductGender {
  const normalized = (value || '').trim().toLowerCase()
  if (normalized === 'men') return 'men'
  if (normalized === 'women') return 'women'
  return 'unisex'
}

export function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function normalizeProductInput(data: Partial<Product>) {
  const name = String(data.name || '').trim()
  const slug = slugify(String(data.slug || name || 'product'))
  const price = Number(data.price)
  const stock = Number(data.stock)
  const rating = Number(data.rating ?? 4.5)
  const images = Array.isArray(data.images) ? data.images.filter(Boolean) : []
  const category = normalizeCategory(String(data.category || 'jewelry'))
  const gender = normalizeGender(String(data.gender || 'unisex'))
  const description = String(data.description || '').trim()

  if (!name) throw new Error('Product name is required.')
  if (!description) throw new Error('Product description is required.')
  if (!Number.isFinite(price) || price <= 0) throw new Error('Price must be greater than zero.')
  if (!Number.isFinite(stock) || stock < 0) throw new Error('Stock must be zero or higher.')
  if (!Number.isFinite(rating) || rating < 0 || rating > 5) throw new Error('Rating must be between 0 and 5.')
  if (!images.length) throw new Error('At least one product image is required.')

  return {
    ...data,
    name,
    slug,
    price,
    stock,
    rating,
    category,
    gender,
    description,
    images,
    newArrival: Boolean(data.newArrival),
    sku: String(data.sku || '').trim() || `SKU-${Date.now()}`,
  }
}

const EXISTING_PRODUCTS: Product[] = []

export const PRODUCTS: Product[] = [...EXISTING_PRODUCTS, ...(seededProducts as Product[])]

export function getAllProducts() {
  return PRODUCTS
}

export function getProductBySlug(slug: string) {
  return PRODUCTS.find((p) => p.slug === slug)
}

export function getProductById(id: string) {
  return PRODUCTS.find((p) => p.id === id) || null
}

export function createProduct(data: Partial<Product>) {
  const normalized = normalizeProductInput(data)
  const slug = normalized.slug
  if (PRODUCTS.some((p) => p.slug === slug)) {
    throw new Error('A product with this slug already exists.')
  }

  const product: Product = {
    id: `p${Date.now()}`,
    name: normalized.name,
    slug,
    price: normalized.price,
    discount: data.discount,
    rating: normalized.rating,
    category: normalized.category,
    gender: normalized.gender,
    images: normalized.images,
    sku: normalized.sku,
    stock: normalized.stock,
    description: normalized.description,
    sizes: Array.isArray(data.sizes) ? data.sizes : [],
    colors: Array.isArray(data.colors) ? data.colors : [],
    newArrival: normalized.newArrival,
  }

  PRODUCTS.push(product)
  return product
}

export function updateProductById(id: string, patch: Partial<Product>) {
  const idx = PRODUCTS.findIndex((p) => p.id === id)
  if (idx < 0) return null

  const merged = { ...PRODUCTS[idx], ...patch }
  const normalized = normalizeProductInput(merged)
  const duplicate = PRODUCTS.find((p) => p.id !== id && p.slug === normalized.slug)
  if (duplicate) {
    throw new Error('Another product already uses this slug.')
  }

  PRODUCTS[idx] = {
    ...PRODUCTS[idx],
    ...normalized,
    discount: patch.discount ?? PRODUCTS[idx].discount,
    sizes: Array.isArray(patch.sizes) ? patch.sizes : PRODUCTS[idx].sizes,
    colors: Array.isArray(patch.colors) ? patch.colors : PRODUCTS[idx].colors,
    newArrival: Boolean(normalized.newArrival),
  }

  return PRODUCTS[idx]
}

export function deleteProductById(id: string) {
  const idx = PRODUCTS.findIndex((p) => p.id === id)
  if (idx < 0) return false
  PRODUCTS.splice(idx, 1)
  return true
}
