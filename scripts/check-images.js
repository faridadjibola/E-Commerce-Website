const fs = require('fs')
const path = require('path')
const products = require('./products.seed.json')
const { IMAGE_EXTENSIONS, inspectFile } = require('./image-utils')

const productsRoot = path.join(__dirname, '..', 'public', 'products')
let missing = 0
let invalid = 0

for (const product of products) {
  const productDir = path.join(productsRoot, product.slug)
  const acceptedNames = new Set(['main', '2', '3'])
  const present = fs.existsSync(productDir)
    ? fs.readdirSync(productDir)
      .filter((name) => acceptedNames.has(path.parse(name).name))
      .map((name) => path.join(productDir, name))
    : []
  if (!present.length) {
    console.log(`MISSING  ${product.slug}/main.jpg`)
    missing += 1
    continue
  }

  let foundValid = false
  for (const file of present) {
    const result = inspectFile(file)
    const relative = path.relative(productsRoot, file).replace(/\\/g, '/')
    if (result.status === 'found') {
      console.log(`FOUND    ${relative} (${result.width}x${result.height})`)
      if (path.basename(file).startsWith('main.')) foundValid = true
    } else {
      console.log(`INVALID  ${relative} (${result.reason})`)
      invalid += 1
    }
  }
  if (!foundValid) {
    console.log(`MISSING  ${product.slug}/main.jpg (no valid primary image)`)
    missing += 1
  }
}

console.log(`\nImage check: ${products.length - missing} products with valid primary images, ${missing} missing primary images, ${invalid} invalid files.`)
if (missing || invalid) process.exitCode = 1