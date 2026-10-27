import { readFile, writeFile, mkdir } from 'node:fs/promises'
import { createHash } from 'node:crypto'
import path from 'node:path'

const root = process.cwd()
const input = JSON.parse(await readFile(path.join(root, 'design/reference-assets.json'), 'utf8'))
const assetDirectory = path.join(root, 'public/assets')
await mkdir(assetDirectory, { recursive: true })
await mkdir(path.join(root, 'src/data'), { recursive: true })
await mkdir(path.join(root, 'src/assets'), { recursive: true })

const urls = new Set()
function collect(value, key) {
  if (typeof value === 'string' && key !== 'source' && /^(https:|data:)/.test(value)) urls.add(value)
  else if (Array.isArray(value)) value.forEach(item => collect(item))
  else if (value && typeof value === 'object') Object.entries(value).forEach(([k, v]) => collect(v, k))
}
collect(input)
const queue = [...urls]
const replacements = new Map()
const types = { 'image/webp': 'webp', 'image/png': 'png', 'image/jpeg': 'jpg', 'image/gif': 'gif', 'image/svg+xml': 'svg', 'image/avif': 'avif', 'font/woff2': 'woff2', 'application/font-woff2': 'woff2' }
const failures = []

async function worker() {
  while (queue.length) {
    const url = queue.shift()
    try {
      let bytes, contentType
      if (url.startsWith('data:')) {
        const comma = url.indexOf(',')
        const header = url.slice(5, comma)
        contentType = header.split(';')[0]
        bytes = header.includes(';base64') ? Buffer.from(url.slice(comma + 1), 'base64') : Buffer.from(decodeURIComponent(url.slice(comma + 1)))
      } else {
        const response = await fetch(url, { signal: AbortSignal.timeout(45000) })
        if (!response.ok) throw new Error(`HTTP ${response.status}`)
        contentType = response.headers.get('content-type')?.split(';')[0]
        bytes = Buffer.from(await response.arrayBuffer())
      }
      const extension = types[contentType] || (url.endsWith('.woff2') ? 'woff2' : null)
      if (!extension) throw new Error(`Unexpected asset type: ${contentType}`)
      const name = `${createHash('sha256').update(url).digest('hex').slice(0, 16)}.${extension}`
      await writeFile(path.join(assetDirectory, name), bytes)
      if (url === input.font) await writeFile(path.join(root, 'src/assets/baloo2-latin.woff2'), bytes)
      replacements.set(url, `assets/${name}`)
    } catch (error) {
      failures.push({ url, error: error.message })
    }
  }
}
await Promise.all(Array.from({ length: 8 }, worker))
if (failures.length) {
  console.error(JSON.stringify(failures, null, 2))
  process.exitCode = 1
} else {
  function localize(value) {
    if (typeof value === 'string') return replacements.get(value) || value
    if (Array.isArray(value)) return value.map(localize)
    if (value && typeof value === 'object') return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, localize(v)]))
    return value
  }
  await writeFile(path.join(root, 'src/data/home.json'), `${JSON.stringify(localize(input), null, 2)}\n`)
  await writeFile(path.join(root, 'design/asset-sources.json'), `${JSON.stringify([...replacements].map(([source, local]) => ({ source, local })), null, 2)}\n`)
  console.log(`Saved ${replacements.size} reference assets locally; homepage data is ready.`)
}
