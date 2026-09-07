// Compone el logo (PNG con transparencia) centrado sobre el fondo azul de la
// marca y genera los íconos PWA. Usa solo módulos nativos de Node.
//
// Uso: primero redimensionar el logo con sips a los tamaños internos, luego:
//   node scripts/build-icons-from-logo.mjs
import { inflateSync, deflateSync } from 'node:zlib'
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const outDir = join(__dirname, '..', 'public', 'icons')
mkdirSync(outDir, { recursive: true })

// Fondo azul de la marca (#0a3ea1)
const BG = [0x0a, 0x3e, 0xa1]

// --- utilidades PNG ---
function crc32(buf) {
  let c = ~0
  for (let i = 0; i < buf.length; i++) {
    c ^= buf[i]
    for (let k = 0; k < 8; k++) c = (c >>> 1) ^ (0xedb88320 & -(c & 1))
  }
  return (~c) >>> 0
}
function chunk(type, data) {
  const t = Buffer.from(type, 'ascii')
  const len = Buffer.alloc(4); len.writeUInt32BE(data.length, 0)
  const crc = Buffer.alloc(4); crc.writeUInt32BE(crc32(Buffer.concat([t, data])), 0)
  return Buffer.concat([len, t, data, crc])
}

function paeth(a, b, c) {
  const p = a + b - c
  const pa = Math.abs(p - a), pb = Math.abs(p - b), pc = Math.abs(p - c)
  if (pa <= pb && pa <= pc) return a
  if (pb <= pc) return b
  return c
}

// Decodifica un PNG 8-bit no entrelazado (RGBA/RGB/gris) a {width,height,channels,pixels}
function decodePng(buf) {
  let pos = 8 // saltar firma
  let width, height, channels, bitDepth, colorType
  const idat = []
  while (pos < buf.length) {
    const len = buf.readUInt32BE(pos); pos += 4
    const type = buf.toString('ascii', pos, pos + 4); pos += 4
    const data = buf.subarray(pos, pos + len); pos += len
    pos += 4 // crc
    if (type === 'IHDR') {
      width = data.readUInt32BE(0)
      height = data.readUInt32BE(4)
      bitDepth = data[8]
      colorType = data[9]
      const interlace = data[12]
      if (bitDepth !== 8) throw new Error('bitDepth != 8 no soportado')
      if (interlace !== 0) throw new Error('PNG entrelazado no soportado')
      channels = colorType === 6 ? 4 : colorType === 2 ? 3 : colorType === 4 ? 2 : colorType === 0 ? 1 : 0
      if (!channels) throw new Error('colorType ' + colorType + ' no soportado')
    } else if (type === 'IDAT') {
      idat.push(data)
    } else if (type === 'IEND') {
      break
    }
  }
  const raw = inflateSync(Buffer.concat(idat))
  const bpp = channels
  const stride = width * bpp
  const out = Buffer.alloc(height * stride)
  let prev = Buffer.alloc(stride)
  let rp = 0
  for (let y = 0; y < height; y++) {
    const filter = raw[rp++]
    const line = raw.subarray(rp, rp + stride); rp += stride
    const cur = out.subarray(y * stride, y * stride + stride)
    for (let x = 0; x < stride; x++) {
      const a = x >= bpp ? cur[x - bpp] : 0
      const b = prev[x]
      const c = x >= bpp ? prev[x - bpp] : 0
      let v = line[x]
      if (filter === 1) v += a
      else if (filter === 2) v += b
      else if (filter === 3) v += (a + b) >> 1
      else if (filter === 4) v += paeth(a, b, c)
      cur[x] = v & 0xff
    }
    prev = cur
  }
  return { width, height, channels, pixels: out }
}

// Codifica un buffer RGB (sin alfa) como PNG truecolor
function encodeRgb(width, height, rgb) {
  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])
  const ihdr = Buffer.alloc(13)
  ihdr.writeUInt32BE(width, 0); ihdr.writeUInt32BE(height, 4)
  ihdr[8] = 8; ihdr[9] = 2 // 8-bit, truecolor RGB
  const stride = width * 3
  const rawSize = height * (stride + 1)
  const raw = Buffer.alloc(rawSize)
  for (let y = 0; y < height; y++) {
    raw[y * (stride + 1)] = 0 // filtro None
    rgb.copy(raw, y * (stride + 1) + 1, y * stride, y * stride + stride)
  }
  return Buffer.concat([sig, chunk('IHDR', ihdr), chunk('IDAT', deflateSync(raw)), chunk('IEND', Buffer.alloc(0))])
}

// Compone el logo centrado sobre fondo azul
function makeIcon(canvasSize, logoPath) {
  const logo = decodePng(readFileSync(logoPath))
  const ch = logo.channels
  const canvas = Buffer.alloc(canvasSize * canvasSize * 3)
  for (let i = 0; i < canvasSize * canvasSize; i++) {
    canvas[i * 3] = BG[0]; canvas[i * 3 + 1] = BG[1]; canvas[i * 3 + 2] = BG[2]
  }
  const off = Math.floor((canvasSize - logo.width) / 2)
  for (let y = 0; y < logo.height; y++) {
    for (let x = 0; x < logo.width; x++) {
      const li = (y * logo.width + x) * ch
      let r, g, b, a
      if (ch === 4) { r = logo.pixels[li]; g = logo.pixels[li + 1]; b = logo.pixels[li + 2]; a = logo.pixels[li + 3] }
      else if (ch === 3) { r = logo.pixels[li]; g = logo.pixels[li + 1]; b = logo.pixels[li + 2]; a = 255 }
      else if (ch === 2) { r = g = b = logo.pixels[li]; a = logo.pixels[li + 1] }
      else { r = g = b = logo.pixels[li]; a = 255 }
      const alpha = a / 255
      const cx = off + x, cy = off + y
      if (cx < 0 || cy < 0 || cx >= canvasSize || cy >= canvasSize) continue
      const ci = (cy * canvasSize + cx) * 3
      canvas[ci] = Math.round(r * alpha + canvas[ci] * (1 - alpha))
      canvas[ci + 1] = Math.round(g * alpha + canvas[ci + 1] * (1 - alpha))
      canvas[ci + 2] = Math.round(b * alpha + canvas[ci + 2] * (1 - alpha))
    }
  }
  return encodeRgb(canvasSize, canvasSize, canvas)
}

writeFileSync(join(outDir, 'icon-512.png'), makeIcon(512, '/tmp/logo-410.png'))
console.log('Generado icon-512.png')
writeFileSync(join(outDir, 'icon-192.png'), makeIcon(192, '/tmp/logo-154.png'))
console.log('Generado icon-192.png')

// apple-touch-icon (iPhone/iPad). iOS lo pide en la carpeta public raíz y le
// aplica sus propias esquinas redondeadas, por eso va full-bleed (sin transparencia).
writeFileSync(join(__dirname, '..', 'public', 'apple-touch-icon.png'), makeIcon(180, '/tmp/logo-144.png'))
console.log('Generado apple-touch-icon.png')
