const fs = require('fs/promises')
const path = require('path')
const sharp = require('sharp')
const sources = require('./stock-images.json')
const products = require('./products.seed.json')
const allowedSlugs = new Set(products.map((product) => product.slug))
const root = path.join(__dirname, '..')
const maxDownloadBytes = 20 * 1024 * 1024
const requestedSlugs = process.argv.slice(2)
const selectedSources = requestedSlugs.length
  ? sources.filter((source) => requestedSlugs.includes(source.slug))
  : sources

for (const slug of requestedSlugs) {
  if (!sources.some((source) => source.slug === slug)) throw new Error(`No stock source configured for ${slug}`)
}

async function download(source) {
  if (!allowedSlugs.has(source.slug)) throw new Error(`Unknown product slug: ${source.slug}`)
  const response = await fetch(source.url, { headers: { 'User-Agent': 'TochiwearsLocalImageSetup/1.0' } })
  if (!response.ok) throw new Error(`Pexels returned HTTP ${response.status}`)
  const input = Buffer.from(await response.arrayBuffer())
  if (!input.length || input.length > maxDownloadBytes) throw new Error('Source file is empty or exceeds 20 MB')

  const original = sharp(input, { limitInputPixels: 40000000 })
  const metadata = await original.metadata()
  if (!metadata.width || !metadata.height || metadata.width < 800 || metadata.height < 800) {
    throw new Error(`Source is too small (${metadata.width || 0}x${metadata.height || 0}); minimum is 800x800`)
  }

  const output = await sharp(input, { limitInputPixels: 40000000 })
    .rotate()
    .resize({ width: 1600, height: 2000, fit: 'inside', withoutEnlargement: true })
    .webp({ quality: 84, effort: 4 })
    .toBuffer()
  const dimensions = await sharp(output).metadata()
  if (dimensions.width < 800 || dimensions.height < 800) throw new Error('Optimized image did not meet 800x800 minimum')

  const destination = path.join(root, 'public', 'products', source.slug, 'main.webp')
  await fs.mkdir(path.dirname(destination), { recursive: true })
  await fs.writeFile(destination, output)
  console.log(`Saved ${source.slug}/main.webp (${dimensions.width}x${dimensions.height}, ${(output.length / 1024).toFixed(0)} KB)`)
}

async function main() {
  let failed = 0
  for (const source of selectedSources) {
    try {
      await download(source)
    } catch (error) {
      failed += 1
      console.error(`Failed ${source.slug}: ${error instanceof Error ? error.message : String(error)}`)
    }
  }
  console.log(`Stock photo download: ${selectedSources.length - failed} saved, ${failed} failed.`)
  if (failed) process.exitCode = 1
}

main()
