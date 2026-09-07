// Genera íconos PNG sólidos para la PWA sin dependencias externas.
// Usa solo módulos nativos de Node (zlib) para escribir un PNG válido.
// Uso: node scripts/generate-icons.mjs
import { deflateSync } from 'node:zlib'
import { writeFileSync, mkdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const outDir = join(__dirname, '..', 'public', 'icons')
mkdirSync(outDir, { recursive: true })

// Color de marca (#0a3ea1)
const R = 0x0a, G = 0x3e, B = 0xa1

function crc32(buf) {
  let c = ~0
  for (let i = 0; i < buf.length; i++) {
    c ^= buf[i]
    for (let k = 0; k < 8; k++) c = (c >>> 1) ^ (0xedb88320 & -(c & 1))
  }
  return (~c) >>> 0
}

function chunk(type, data) {
  const typeBuf = Buffer.from(type, 'ascii')
  const len = Buffer.alloc(4)
  len.writeUInt32BE(data.length, 0)
  const crc = Buffer.alloc(4)
  crc.writeUInt32BE(crc32(Buffer.concat([typeBuf, data])), 0)
  return Buffer.concat([len, typeBuf, data, crc])
}

function makePng(size) {
  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])

  const ihdr = Buffer.alloc(13)
  ihdr.writeUInt32BE(size, 0)
  ihdr.writeUInt32BE(size, 4)
  ihdr[8] = 8   // bit depth
  ihdr[9] = 2   // color type: truecolor RGB
  // resto en 0 (compresión, filtro, interlace)

  // Cada fila: 1 byte de filtro (0) + size*3 bytes RGB
  const row = Buffer.alloc(1 + size * 3)
  for (let x = 0; x < size; x++) {
    row[1 + x * 3] = R
    row[1 + x * 3 + 1] = G
    row[1 + x * 3 + 2] = B
  }
  const raw = Buffer.concat(Array.from({ length: size }, () => row))
  const idat = deflateSync(raw)

  return Buffer.concat([
    sig,
    chunk('IHDR', ihdr),
    chunk('IDAT', idat),
    chunk('IEND', Buffer.alloc(0)),
  ])
}

for (const size of [192, 512]) {
  const file = join(outDir, `icon-${size}.png`)
  writeFileSync(file, makePng(size))
  console.log('Generado', file)
}
