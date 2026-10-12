const fs = require('fs')
const path = require('path')

const IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp']
const MAX_BYTES = 2 * 1024 * 1024
const MIN_DIMENSION = 800

function inspectImage(buffer) {
  if (buffer.length >= 24 && buffer.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))) {
    return { type: 'png', width: buffer.readUInt32BE(16), height: buffer.readUInt32BE(20) }
  }
  if (buffer.length >= 12 && buffer.toString('ascii', 0, 4) === 'RIFF' && buffer.toString('ascii', 8, 12) === 'WEBP') {
    const chunk = buffer.toString('ascii', 12, 16)
    if (chunk === 'VP8X' && buffer.length >= 30) return { type: 'webp', width: 1 + buffer.readUIntLE(24, 3), height: 1 + buffer.readUIntLE(27, 3) }
    if (chunk === 'VP8 ' && buffer.length >= 30) return { type: 'webp', width: buffer.readUInt16LE(26) & 0x3fff, height: buffer.readUInt16LE(28) & 0x3fff }
    if (chunk === 'VP8L' && buffer.length >= 25) {
      const bits = buffer.readUInt32LE(21)
      return { type: 'webp', width: 1 + (bits & 0x3fff), height: 1 + ((bits >> 14) & 0x3fff) }
    }
  }
  if (buffer.length >= 4 && buffer[0] === 0xff && buffer[1] === 0xd8) {
    let offset = 2
    while (offset + 9 < buffer.length) {
      if (buffer[offset] !== 0xff) { offset += 1; continue }
      const marker = buffer[offset + 1]
      const length = buffer.readUInt16BE(offset + 2)
      if ([0xc0, 0xc1, 0xc2, 0xc3, 0xc5, 0xc6, 0xc7, 0xc9, 0xca, 0xcb, 0xcd, 0xce, 0xcf].includes(marker)) {
        return { type: 'jpeg', height: buffer.readUInt16BE(offset + 5), width: buffer.readUInt16BE(offset + 7) }
      }
      if (length < 2) break
      offset += length + 2
    }
  }
  return null
}

function inspectFile(filePath) {
  const extension = path.extname(filePath).toLowerCase()
  if (!IMAGE_EXTENSIONS.includes(extension)) return { status: 'invalid', reason: 'wrong type' }
  const stats = fs.statSync(filePath)
  if (stats.size > MAX_BYTES) return { status: 'invalid', reason: 'too large' }
  const image = inspectImage(fs.readFileSync(filePath))
  if (!image || image.type !== (extension === '.jpg' || extension === '.jpeg' ? 'jpeg' : extension.slice(1))) {
    return { status: 'invalid', reason: 'wrong type or unreadable image' }
  }
  if (image.width < MIN_DIMENSION || image.height < MIN_DIMENSION) return { status: 'invalid', reason: 'too small' }
  return { status: 'found', width: image.width, height: image.height }
}

module.exports = { IMAGE_EXTENSIONS, inspectFile }