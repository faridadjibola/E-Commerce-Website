import type { NextApiRequest, NextApiResponse } from 'next'
import { getAllProducts } from '../../lib/products'

const MAX_RESULTS = 5
const REQUEST_LIMIT = 30
const WINDOW_MS = 60_000
const requests = new Map<string, { count: number; resetAt: number }>()

function getClientKey(req: NextApiRequest) {
  const forwarded = req.headers['x-forwarded-for']
  const ip = Array.isArray(forwarded) ? forwarded[0] : forwarded || req.socket.remoteAddress || 'unknown'
  return String(ip).trim()
}

function isRateLimited(req: NextApiRequest) {
  const key = getClientKey(req)
  const current = requests.get(key)
  if (!current || current.resetAt <= Date.now()) {
    requests.set(key, { count: 1, resetAt: Date.now() + WINDOW_MS })
    return false
  }
  if (current.count >= REQUEST_LIMIT) return true
  current.count += 1
  return false
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET')
    return res.status(405).json({ error: 'Method not allowed' })
  }

  if (isRateLimited(req)) {
    return res.status(429).json({ error: 'Too many requests. Please wait a minute and try again.' })
  }

  const query = typeof req.query.query === 'string' ? req.query.query.trim().toLocaleLowerCase() : ''
  const limit = Number.parseInt(String(req.query.limit || MAX_RESULTS), 10)
  const requestedLimit = Number.isFinite(limit) ? Math.min(Math.max(limit, 1), MAX_RESULTS) : MAX_RESULTS

  if (!query) return res.status(400).json({ error: 'A search query is required.' })

  const normalizedQuery = query.normalize('NFKC').trim()
  const products = getAllProducts()
    .filter((product) => {
      const searchable = [product.name, product.category, product.description, product.sku, product.slug]
        .join(' ')
        .toLocaleLowerCase()
        .normalize('NFKC')
      return searchable.includes(normalizedQuery)
    })
    .slice(0, requestedLimit)
    .map(({ id, name, slug, price, category, images }) => ({
      id,
      name,
      slug,
      price,
      category,
      images,
    }))

  return res.status(200).json(products)
}
