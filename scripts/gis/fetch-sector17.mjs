import { mkdir, writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '../..')
const bbox = '30.735,76.772,30.747,76.789'
const query = `[out:json][timeout:45];(way[highway](${bbox});way[building](${bbox}););out geom;`
const url = `https://overpass.kumi.systems/api/interpreter?data=${encodeURIComponent(query)}`
const response = await fetch(url, { headers: { 'user-agent': 'ChandigarhSector17Game/0.1 (local GIS preprocessing)' } })
if (!response.ok) throw new Error(`Overpass returned ${response.status} ${response.statusText}`)
const data = await response.json()
await mkdir(resolve(root, 'public'), { recursive: true })
await writeFile(resolve(root, 'public/sector17-osm.json'), `${JSON.stringify(data)}\n`)
console.log(`Saved ${data.elements.length} mapped ways to public/sector17-osm.json`)
