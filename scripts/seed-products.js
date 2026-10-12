const fs = require('fs')
const path = require('path')
const { spawnSync } = require('child_process')
const { IMAGE_EXTENSIONS, inspectFile } = require('./image-utils')

const root = path.join(__dirname, '..')
const sourcePath = path.join(__dirname, 'products.seed.json')
const targetPath = path.join(root, 'lib', 'seeded-products.json')
const imageRoot = path.join(root, 'public', 'products')
const allowedCategories = new Set(['belts', 'jewelry', 'watches', 'glasses'])
const allowedGenders = new Set(['men', 'women', 'unisex'])
const allowProduction = process.argv.includes('--allow-prod')
let created = 0
let updated = 0
let failed = 0

if (process.env.NODE_ENV === 'production' && !allowProduction) {
  console.error('Refusing to seed in production. Pass --allow-prod explicitly to continue.')
  process.exit(1)
}

const imageCheck = spawnSync(process.execPath, [path.join(__dirname, 'check-images.js')], { cwd: root, stdio: 'inherit' })
if (imageCheck.error) console.warn(`Warning: could not run image check: ${imageCheck.error.message}`)

const source = JSON.parse(fs.readFileSync(sourcePath, 'utf8'))
const current = JSON.parse(fs.readFileSync(targetPath, 'utf8'))
const slugs = new Set()

function validProduct(product) {
  if (typeof product.name !== 'string' || !product.name.trim()) throw new Error('name must be non-empty')
  if (typeof product.slug !== 'string' || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(product.slug)) throw new Error('slug must be URL-safe lowercase text')
  if (slugs.has(product.slug)) throw new Error(`duplicate slug: ${product.slug}`)
  if (!Number.isInteger(product.price) || product.price <= 0) throw new Error('price must be a positive integer')
  if (!allowedCategories.has(product.category)) throw new Error(`invalid category: ${product.category}`)
  if (!allowedGenders.has(product.gender)) throw new Error(`invalid gender: ${product.gender}`)
  if (!Number.isInteger(product.stock) || product.stock < 0) throw new Error('stock must be a non-negative integer')
  if (typeof product.rating !== 'number' || product.rating < 0 || product.rating > 5) throw new Error('rating must be between 0 and 5')
  if (typeof product.description !== 'string' || !product.description.trim()) throw new Error('description must be non-empty')
  slugs.add(product.slug)
}

for (const product of source) {
  try {
    validProduct(product)
    const productDir = path.join(imageRoot, product.slug)
    const validImages = ['main', '2', '3'].flatMap((base) => IMAGE_EXTENSIONS
      .map((extension) => path.join(productDir, `${base}${extension}`))
      .filter((file) => fs.existsSync(file) && inspectFile(file).status === 'found'))
    const mainImage = validImages.find((file) => path.basename(file).startsWith('main.'))
    const images = mainImage
      ? validImages.map((file) => `/products/${product.slug}/${path.basename(file)}`)
      : ['/products/placeholder.svg']
    if (!mainImage) console.warn(`Warning: ${product.slug} has no valid primary photo; using /products/placeholder.svg.`)

    const seeded = {
      id: `seed-${product.slug}`,
      ...product,
      images,
      sku: `TW-${product.slug.toUpperCase()}`,
      sizes: [],
      colors: [],
    }
    const index = current.findIndex((item) => item.slug === product.slug)
    if (index === -1) {
      current.push(seeded)
      created += 1
    } else {
      current[index] = { ...current[index], ...seeded }
      updated += 1
    }
  } catch (error) {
    failed += 1
    console.error(`Failed ${product.slug || '(unknown slug)'}: ${error instanceof Error ? error.message : String(error)}`)
  }
}

const temporaryPath = `${targetPath}.tmp`
fs.writeFileSync(temporaryPath, `${JSON.stringify(current, null, 2)}\n`, { flag: 'w' })
fs.renameSync(temporaryPath, targetPath)
console.log(`\nSeed summary: created ${created}, updated ${updated}, failed ${failed}.`)
if (failed) process.exitCode = 1