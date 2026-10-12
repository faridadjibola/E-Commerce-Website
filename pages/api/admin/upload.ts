import type { NextApiRequest, NextApiResponse } from 'next'
import { randomUUID } from 'crypto'
import sharp from 'sharp'
import { requireAdmin } from '../../../lib/requireAdmin'

const MAX_UPLOAD_BYTES = 2 * 1024 * 1024

function inspectImage(buffer: Buffer) {
  if (buffer.length >= 24 && buffer.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))) {
    return { type: 'image/png', extension: 'png', width: buffer.readUInt32BE(16), height: buffer.readUInt32BE(20) }
  }

  if (buffer.length >= 12 && buffer.toString('ascii', 0, 4) === 'RIFF' && buffer.toString('ascii', 8, 12) === 'WEBP') {
    const chunk = buffer.toString('ascii', 12, 16)
    if (chunk === 'VP8X' && buffer.length >= 30) {
      return { type: 'image/webp', extension: 'webp', width: 1 + buffer.readUIntLE(24, 3), height: 1 + buffer.readUIntLE(27, 3) }
    }
    if (chunk === 'VP8 ' && buffer.length >= 30) {
      return { type: 'image/webp', extension: 'webp', width: buffer.readUInt16LE(26) & 0x3fff, height: buffer.readUInt16LE(28) & 0x3fff }
    }
    if (chunk === 'VP8L' && buffer.length >= 25) {
      const bits = buffer.readUInt32LE(21)
      return { type: 'image/webp', extension: 'webp', width: 1 + (bits & 0x3fff), height: 1 + ((bits >> 14) & 0x3fff) }
    }
  }

  if (buffer.length >= 4 && buffer[0] === 0xff && buffer[1] === 0xd8) {
    let offset = 2
    while (offset + 9 < buffer.length) {
      if (buffer[offset] !== 0xff) { offset += 1; continue }
      const marker = buffer[offset + 1]
      const length = buffer.readUInt16BE(offset + 2)
      if ([0xc0, 0xc1, 0xc2, 0xc3, 0xc5, 0xc6, 0xc7, 0xc9, 0xca, 0xcb, 0xcd, 0xce, 0xcf].includes(marker)) {
        return { type: 'image/jpeg', extension: 'jpg', height: buffer.readUInt16BE(offset + 5), width: buffer.readUInt16BE(offset + 7) }
      }
      if (length < 2) break
      offset += length + 2
    }
  }

  return null
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end()
  if (!(await requireAdmin(req, res))) return

  const { data } = req.body || {}
  if (typeof data !== 'string') return res.status(400).json({ error: 'Missing image data' })
  const matches = data.match(/^data:image\/(jpeg|png|webp);base64,([A-Za-z0-9+/]+=*)$/)
  if (!matches) return res.status(400).json({ error: 'Only JPEG, PNG, and WebP images are allowed' })

  const buffer = Buffer.from(matches[2], 'base64')
  if (buffer.length > MAX_UPLOAD_BYTES) return res.status(413).json({ error: 'Image exceeds 2 MB limit' })
  const image = inspectImage(buffer)
  if (!image || image.type !== `image/${matches[1]}`) return res.status(400).json({ error: 'Image content does not match its declared type' })
  if (image.width < 800 || image.height < 800) return res.status(400).json({ error: 'Images must be at least 800 x 800 pixels' })

  let optimizedBuffer: Buffer
  try {
    optimizedBuffer = await sharp(buffer).rotate().webp({ quality: 86, effort: 4 }).toBuffer()
  } catch {
    return res.status(400).json({ error: 'Image could not be decoded' })
  }

  const token = process.env.BLOB_READ_WRITE_TOKEN
  if (!token) return res.status(503).json({ error: 'Image storage is not configured' })

  const filename = `product-images/${randomUUID()}.webp`
  const response = await fetch(`https://blob.vercel-storage.com/${filename}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      'x-api-version': '7',
      'x-content-type': 'image/webp',
      'x-cache-control': 'public, max-age=31536000, immutable',
    },
    body: new Uint8Array(optimizedBuffer),
  })
  const result = await response.json().catch(() => ({})) as { url?: string; error?: { message?: string } }
  if (!response.ok || !result.url) return res.status(502).json({ error: result.error?.message || 'Cloud image upload failed' })
  return res.json({ url: result.url })
}

export const config = {
  api: { bodyParser: { sizeLimit: '3mb' } }
}
