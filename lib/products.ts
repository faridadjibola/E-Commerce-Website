export type Product = {
  id: string;
  name: string;
  slug: string;
  price: number;
  discount?: number;
  rating?: number;
  category: string;
  gender: 'men' | 'women' | 'unisex';
  images: string[];
  sku: string;
  stock: number;
  description: string;
  sizes?: string[];
  colors?: string[];
}

function makeProductArt(label: string, accent: string, accent2: string) {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800">
      <defs>
        <linearGradient id="g" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stop-color="${accent}"/>
          <stop offset="100%" stop-color="${accent2}"/>
        </linearGradient>
      </defs>
      <rect width="800" height="800" fill="url(#g)"/>
      <circle cx="400" cy="350" r="180" fill="rgba(255,255,255,0.18)"/>
      <path d="M240 590C295 520 360 470 400 470C440 470 505 520 560 590" fill="none" stroke="rgba(255,255,255,0.35)" stroke-width="26" stroke-linecap="round"/>
      <text x="400" y="260" fill="white" text-anchor="middle" font-size="44" font-family="Arial, sans-serif" font-weight="700">TOCHIWEARS</text>
      <text x="400" y="420" fill="white" text-anchor="middle" font-size="66" font-family="Arial, sans-serif" font-weight="700">${label}</text>
    </svg>
  `

  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`
}

export const PRODUCTS: Product[] = [
  {
    id: 'p1',
    name: "Azen Leather Belt",
    slug: 'azen-leather-belt',
    price: 7500,
    discount: 6500,
    rating: 4.5,
    category: 'Belts',
    gender: 'men',
    images: [makeProductArt('Belt', '#4b2e2b', '#8b5e3c')],
    sku: 'B-0001',
    stock: 12,
    description: 'Premium genuine leather belt with brushed buckle.',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Black', 'Brown', 'Tan']
  },
  {
    id: 'p2',
    name: "Serene Pearl Necklace",
    slug: 'serene-pearl-necklace',
    price: 18500,
    discount: 17000,
    rating: 4.8,
    category: 'Jewelry',
    gender: 'women',
    images: [makeProductArt('Pearls', '#d8b47d', '#8a5d4f')],
    sku: 'J-0021',
    stock: 6,
    description: 'Elegant pearl necklace designed for special occasions.',
    colors: ['White', 'Gold', 'Silver']
  },
  {
    id: 'p3',
    name: "Orion Classic Watch",
    slug: 'orion-classic-watch',
    price: 42000,
    rating: 4.7,
    category: 'Wristwatches',
    gender: 'unisex',
    images: [makeProductArt('Watch', '#1f2937', '#6b7280')],
    sku: 'W-0102',
    stock: 4,
    description: 'Minimalist premium wristwatch with leather strap.',
    colors: ['Black', 'Brown', 'Silver']
  },
  {
    id: 'p4',
    name: "Aviator Fashion Glasses",
    slug: 'aviator-fashion-glasses',
    price: 9500,
    rating: 4.2,
    category: 'Glasses',
    gender: 'men',
    images: [makeProductArt('Glasses', '#372d5a', '#7c8db6')],
    sku: 'G-0044',
    stock: 20,
    description: 'Stylish aviator glasses with UV protection.',
    colors: ['Black', 'Gold', 'Rose Gold']
  }
]

export function getAllProducts() {
  return PRODUCTS
}

export function getProductBySlug(slug: string) {
  return PRODUCTS.find(p => p.slug === slug)
}

export function getProductById(id: string) {
  return PRODUCTS.find(p => p.id === id) || null
}

export function createProduct(data: Partial<Product>) {
  const id = `p${Date.now()}`
  const product: Product = {
    id,
    name: data.name || 'New Product',
    slug: data.slug || `product-${Date.now()}`,
    price: data.price || 0,
    discount: data.discount,
    rating: data.rating,
    category: data.category || 'Uncategorized',
    gender: data.gender || 'unisex',
    images: data.images || [],
    sku: data.sku || '',
    stock: data.stock ?? 0,
    description: data.description || '',
  }
  PRODUCTS.push(product)
  return product
}

export function updateProductById(id: string, patch: Partial<Product>) {
  const idx = PRODUCTS.findIndex(p => p.id === id)
  if (idx < 0) return null
  PRODUCTS[idx] = { ...PRODUCTS[idx], ...patch }
  return PRODUCTS[idx]
}

export function deleteProductById(id: string) {
  const idx = PRODUCTS.findIndex(p => p.id === id)
  if (idx < 0) return false
  PRODUCTS.splice(idx, 1)
  return true
}
