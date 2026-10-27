import { memo, Suspense, useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Sky, Stars, useAnimations, useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import * as SkeletonUtils from 'three/addons/utils/SkeletonUtils.js'
import './style.css'

// Custom Sector 17 Components
import { NeelamCinema } from './components/NeelamCinema'
import { OpenHandMonument } from './components/OpenHandMonument'
import { MusicalFountain } from './components/MusicalFountain'
import { ColonnadeShops } from './components/ColonnadeShops'
import { ChandigarhVegetation } from './components/ChandigarhVegetation'
import { PlazaPigeons } from './components/PlazaPigeons'
import { Minimap } from './components/Minimap'
import { PostcardMode } from './components/PostcardMode'
import { sound } from './components/AudioEngine'
import { useGameStore } from './components/QuestSystem'
import { GraphicsEffects } from './components/GraphicsEffects'
import { hitsSceneObstacle, SceneObstacleCapture, setMovingObstacle, removeMovingObstacle } from './components/CollisionWorld'
import { textures } from './components/TextureGenerator'
import { PunjabiTurban, type TurbanStyle } from './components/PunjabiTurban'
import { TurbanCustomizer, type TurbanConfig, TURBAN_PRESETS } from './components/TurbanCustomizer'
import { Sector17Clubs } from './components/Sector17Clubs'
import { Sector17Showrooms } from './components/Sector17Showrooms'
import { Sector17Underpass } from './components/Sector17Underpass'
import { DynamicCharacter } from './components/DynamicCharacter'
import { useCharacterShopStore, type CharacterConfig } from './components/CharacterAndShopStore'
import { ShoppingModal } from './components/ShoppingModal'
import { CharacterStudioModal } from './components/CharacterStudioModal'
import { ElanteMallModal } from './components/ElanteMallModal'
import { PunjabiRadio } from './components/PunjabiRadio'

const origin: Point = [30.74105, 76.77902]
type Point = [number, number]
type OSMWay = { id: number; tags?: Record<string, string>; geometry?: Array<{ lat: number; lon: number }> }
type OSMData = { elements: OSMWay[] }
type Footprint = { points: THREE.Vector2[]; minX: number; maxX: number; minZ: number; maxZ: number }

const collisionGrid = new Map<string, Footprint[]>()
const COLLISION_CELL = 32
const world = (lat: number, lon: number): [number, number] => [
  (lon - origin[1]) * 96400,
  (lat - origin[0]) * 111100,
]

function pointInPolygon(x: number, z: number, points: THREE.Vector2[]) {
  let inside = false
  for (let i = 0, j = points.length - 1; i < points.length; j = i++) {
    const a = points[i], b = points[j]
    if (a.y > z !== b.y > z && x < ((b.x - a.x) * (z - a.y)) / (b.y - a.y) + a.x) inside = !inside
  }
  return inside
}

function circleTouchesPolygon(x: number, z: number, radius: number, points: THREE.Vector2[]) {
  if (pointInPolygon(x, z, points)) return true
  const r2 = radius * radius
  for (let i = 0; i < points.length; i++) {
    const a = points[i], b = points[(i + 1) % points.length]
    const dx = b.x - a.x, dz = b.y - a.y
    const length2 = dx * dx + dz * dz
    const t = length2 > 0 ? THREE.MathUtils.clamp(((x - a.x) * dx + (z - a.y) * dz) / length2, 0, 1) : 0
    const ex = x - (a.x + t * dx), ez = z - (a.y + t * dz)
    if (ex * ex + ez * ez <= r2) return true
  }
  return false
}

function blocked(x: number, z: number, radius: number, ignoreId?: string) {
  if (hitsSceneObstacle(x, z, radius, ignoreId)) return true
  // Circle-versus-polygon collision keeps the full character radius outside
  // mapped buildings, including along diagonal corners and narrow walls.
  const seen = new Set<Footprint>()
  const minGx = Math.floor((x - radius) / COLLISION_CELL)
  const maxGx = Math.floor((x + radius) / COLLISION_CELL)
  const minGz = Math.floor((z - radius) / COLLISION_CELL)
  const maxGz = Math.floor((z + radius) / COLLISION_CELL)

  for (let gx = minGx; gx <= maxGx; gx++) {
    for (let gz = minGz; gz <= maxGz; gz++) {
      for (const f of collisionGrid.get(`${gx},${gz}`) ?? []) {
        if (seen.has(f) || x + radius < f.minX || x - radius > f.maxX || z + radius < f.minZ || z - radius > f.maxZ)
          continue
        seen.add(f)
        if (circleTouchesPolygon(x, z, radius, f.points)) return true
      }
    }
  }
  return false
}

function updatePosition(target: THREE.Vector3, x: number, z: number, y?: number) {
  target.x = x
  target.z = z
  if (y !== undefined) target.y = y
}

function roadWidth(w: OSMWay) {
  const raw = w.tags?.width, kind = w.tags?.highway ?? ''
  return raw
    ? THREE.MathUtils.clamp(Number.parseFloat(raw), 2, 28)
    : kind === 'motorway'
    ? 15
    : kind === 'primary' || kind === 'secondary'
    ? 10
    : kind === 'tertiary'
    ? 7
    : kind === 'residential'
    ? 5
    : kind === 'service'
    ? 3.5
    : ['footway', 'path', 'pedestrian', 'steps', 'cycleway'].includes(kind)
    ? 2
    : 4
}

function roadGeometry(ways: OSMWay[], mode: 'car' | 'walk' | 'edge' | 'mark') {
  const values: number[] = []
  const add = (x: number, y: number, z: number) => values.push(x, y, z)
  const quad = (cx: number, cz: number, dx: number, dz: number, len: number, width: number, y: number) => {
    const nx = (dz / len) * (width / 2), nz = (-dx / len) * (width / 2)
    const ex = (dx / len) * (len / 2), ez = (dz / len) * (len / 2)
    const ax = cx - ex, az = cz - ez, bx = cx + ex, bz = cz + ez
    add(ax + nx, y, az + nz)
    add(ax - nx, y, az - nz)
    add(bx - nx, y, bz - nz)
    add(ax + nx, y, az + nz)
    add(bx - nx, y, bz - nz)
    add(bx + nx, y, bz + nz)
  }

  for (const way of ways) {
    const points = (way.geometry ?? []).map(p => world(p.lat, p.lon)),
      kind = way.tags?.highway ?? '',
      walk = ['footway', 'path', 'pedestrian', 'steps', 'cycleway'].includes(kind),
      width = roadWidth(way)
    if (mode === 'walk' !== walk) continue

    for (let i = 0; i < points.length - 1; i++) {
      const a = points[i], b = points[i + 1], dx = b[0] - a[0], dz = b[1] - a[1], len = Math.hypot(dx, dz)
      if (len < 0.1) continue
      const mx = (a[0] + b[0]) * 0.5, mz = (a[1] + b[1]) * 0.5
      // Leave a clear opening over the playable underpass instead of drawing
      // surface roads across its roofline.
      if (mx > -29 && mx < -7 && mz > -94 && mz < -14) continue

      if (mode === 'mark') {
        if (walk || width <= 6) continue
        const count = Math.floor(len / 14)
        for (let j = 0; j < count; j++) {
          const t = (j * 14 + 3) / len, seg = Math.min(2.3, len - (j * 14 + 3))
          quad(a[0] + dx * t + (dx / len) * (seg / 2), a[1] + dz * t + (dz / len) * (seg / 2), (dx / len) * seg, (dz / len) * seg, seg, 0.13, 0.084)
        }
        continue
      }
      const layerWidth = mode === 'edge' ? width + 0.8 : width
      quad((a[0] + b[0]) / 2, (a[1] + b[1]) / 2, dx, dz, len, layerWidth, mode === 'edge' ? 0.005 : walk ? 0.025 : 0.045)
    }
  }

  const g = new THREE.BufferGeometry()
  g.setAttribute('position', new THREE.Float32BufferAttribute(values, 3))
  g.computeVertexNormals()
  return g
}

function RoadNetwork({ ways }: { ways: OSMWay[] }) {
  const built = useMemo(
    () => ({
      car: roadGeometry(ways, 'car'),
      walk: roadGeometry(ways, 'walk'),
      edge: roadGeometry(ways, 'edge'),
      mark: roadGeometry(ways, 'mark'),
    }),
    [ways]
  )
  const asphalt = useMemo(() => textures.getAsphaltTexture(), [])
  useEffect(() => () => Object.values(built).forEach(g => g.dispose()), [built])
  return (
      <group userData={{ sector17CollisionIgnore: true }}>
      <mesh geometry={built.edge}>
        <meshStandardMaterial color="#8e897d" roughness={0.95} />
      </mesh>
      <mesh geometry={built.car}>
        <meshStandardMaterial
          color="#333638"
          map={asphalt.diffuse}
          bumpMap={asphalt.bump}
          bumpScale={0.04}
          roughness={0.85}
        />
      </mesh>
      <mesh geometry={built.walk}>
        <meshStandardMaterial color="#b3ada1" roughness={0.88} />
      </mesh>
      <mesh geometry={built.mark}>
        <meshStandardMaterial color="#e5dfca" roughness={0.7} />
      </mesh>
    </group>
  )
}

function MappedBuilding({ way, night }: { way: OSMWay; night: boolean }) {
  const geom = way.geometry
  const beton = useMemo(() => textures.getBetonBrutTexture(), [])
  const shape = useMemo(() => {
    if (!geom || geom.length < 4) return null
    const sh = new THREE.Shape()
    geom.forEach((p, i) => {
      const [x, z] = world(p.lat, p.lon)
      if (i === 0) sh.moveTo(x, -z)
      else sh.lineTo(x, -z)
    })
    return sh
  }, [geom])

  const points = useMemo(() => geom?.map(p => {
    const [x, z] = world(p.lat, p.lon)
    return new THREE.Vector2(x, z)
  }) ?? [], [geom])

  if (!shape) return null
  const levels = Number(way.tags?.['building:levels'])
  const taggedHeight = Number.parseFloat(way.tags?.height ?? '')
  const height = THREE.MathUtils.clamp(taggedHeight || (levels ? levels * 3.2 : 8), 4, 45)
  const color = way.tags?.building === 'commercial' ? '#b0aba0' : '#bcb6a7'

  return (
    <group userData={{ sector17CollisionIgnore: true }}>
      <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]} castShadow receiveShadow>
        <extrudeGeometry args={[shape, { depth: height, bevelEnabled: false }]} />
        <meshStandardMaterial
          color={color}
          bumpMap={beton.bump}
          bumpScale={0.03}
          roughness={0.9}
        />
      </mesh>
      <MappedFacades points={points} height={height} night={night} />
    </group>
  )
}

function MappedFacades({ points, height, night }: { points: THREE.Vector2[]; height: number; night: boolean }) {
  const cx = points.reduce((s, p) => s + p.x, 0) / points.length, cz = points.reduce((s, p) => s + p.y, 0) / points.length
  const edges = useMemo(
    () => {
      if (Math.hypot(cx, cz) > 280) return []
      return points
        .slice(0, -1)
        .map((a, i) => {
          const b = points[i + 1], dx = b.x - a.x, dz = b.y - a.y, len = Math.hypot(dx, dz), mx = (a.x + b.x) / 2, mz = (a.y + b.y) / 2
          let yaw = Math.atan2(-dz, dx)
          if (Math.sin(yaw) * (mx - cx) + Math.cos(yaw) * (mz - cz) < 0) yaw += Math.PI
          return { len, mx, mz, yaw }
        })
        .filter(e => e.len > 18)
        .sort((a, b) => b.len - a.len)
        .slice(0, 4)
    },
    [points, cx, cz]
  )
  if (!edges.length) return null

  return (
    <group>
      {edges.map((edge, i) => {
        const count = Math.floor(edge.len / 5.2), floors = Math.max(1, Math.floor(height / 3.4) - 1)
        return (
          <group key={i} position={[edge.mx, 0, edge.mz]} rotation={[0, edge.yaw, 0]}>
            <mesh position={[0, 4.2, 0.045]}>
              <boxGeometry args={[edge.len, 0.22, 0.3]} />
              <meshStandardMaterial color="#8b8577" />
            </mesh>
            {Array.from({ length: count + 1 }, (_, j) => (
              <mesh key={`pier${j}`} position={[(j - count / 2) * 5.2, height / 2, 0.12]} castShadow>
                <boxGeometry args={[0.24, height, 0.3]} />
                <meshStandardMaterial color="#9e988b" roughness={0.9} />
              </mesh>
            ))}
            {Array.from({ length: count }, (_, j) => {
              const x = (j - (count - 1) / 2) * 5.2
              return (
                <group key={j} position={[x, 0, 0.105]}>
                  {Array.from({ length: floors }, (_, f) => (
                    <mesh key={f} position={[0, 2.3 + f * 3.25, 0]}>
                      <boxGeometry args={[2.2, 1.35, 0.08]} />
                      <meshStandardMaterial
                        color={f === 0 ? '#465e60' : '#778885'}
                        metalness={0.2}
                        roughness={0.35}
                      />
                    </mesh>
                  ))}
                  {Math.abs(cx) < 150 && Math.abs(cz) < 150 && j % 2 === 0 && (
                    <BrandSign
                      name={['NIKE', 'ADIDAS', 'PUMA', 'WOODLAND', 'KAPSONS', 'LEVI’S', 'FABINDIA', 'RAYMOND'][(j + i) % 8]}
                      night={night}
                    />
                  )}
                </group>
              )
            })}
          </group>
        )
      })}
    </group>
  )
}

function FacadeLayer({ buildings, night }: { buildings: OSMWay[]; night: boolean }) {
  const windows = useRef<THREE.InstancedMesh>(null), shops = useRef<THREE.InstancedMesh>(null)
  const windowGeometry = useMemo(() => new THREE.BoxGeometry(2.6, 1.45, 0.09), [])
  const shopGeometry = useMemo(() => new THREE.BoxGeometry(3.5, 2.15, 0.12), [])
  const windowMaterial = useMemo(
    () => new THREE.MeshStandardMaterial({ color: '#57716f', metalness: 0.24, roughness: 0.34 }),
    []
  )
  const shopMaterial = useMemo(
    () => new THREE.MeshStandardMaterial({ color: '#314543', metalness: 0.28, roughness: 0.24 }),
    []
  )

  const data = useMemo(() => {
    const result: { x: number; y: number; z: number; yaw: number }[] = []
    const store: { x: number; y: number; z: number; yaw: number }[] = []

    for (const way of buildings) {
      const geo = way.geometry ?? []
      if (geo.length < 4) continue
      const points = geo.map(p => {
        const [x, z] = world(p.lat, p.lon)
        return new THREE.Vector2(x, z)
      })
      const cx = points.reduce((s, p) => s + p.x, 0) / points.length
      const cz = points.reduce((s, p) => s + p.y, 0) / points.length
      const levels = Number(way.tags?.['building:levels'])
      const tagged = Number.parseFloat(way.tags?.height ?? '')
      const height = THREE.MathUtils.clamp(tagged || (levels ? levels * 3.2 : 8), 4, 45)

      for (let i = 0; i < points.length - 1; i++) {
        const a = points[i], b = points[i + 1], dx = b.x - a.x, dz = b.y - a.y, len = Math.hypot(dx, dz)
        if (len < 12) continue
        let yaw = Math.atan2(-dz, dx), mx = (a.x + b.x) / 2, mz = (a.y + b.y) / 2
        if (Math.sin(yaw) * (mx - cx) + Math.cos(yaw) * (mz - cz) < 0) yaw += Math.PI
        const count = Math.max(1, Math.floor(len / 5.2))
        for (let j = 0; j < count; j++) {
          const local = (j - (count - 1) / 2) * 5.2
          const x = mx + local * Math.cos(yaw) + Math.sin(yaw) * 0.16
          const z = mz - local * Math.sin(yaw) + Math.cos(yaw) * 0.16
          store.push({ x, y: 1.75, z, yaw })
          for (let y = 4.1; y < height - 1.1; y += 3.25) result.push({ x, y, z, yaw })
        }
      }
    }
    return { windows: result, shops: store }
  }, [buildings])

  useEffect(() => {
    const dummy = new THREE.Object3D()
    if (windows.current) {
      data.windows.forEach((p, i) => {
        dummy.position.set(p.x, p.y, p.z)
        dummy.rotation.set(0, p.yaw, 0)
        dummy.updateMatrix()
        windows.current!.setMatrixAt(i, dummy.matrix)
      })
      windows.current.instanceMatrix.needsUpdate = true
      windows.current.computeBoundingSphere()
    }
    if (shops.current) {
      data.shops.forEach((p, i) => {
        dummy.position.set(p.x, p.y, p.z)
        dummy.rotation.set(0, p.yaw, 0)
        dummy.updateMatrix()
        shops.current!.setMatrixAt(i, dummy.matrix)
      })
      shops.current.instanceMatrix.needsUpdate = true
      shops.current.computeBoundingSphere()
    }
  }, [data])

  useEffect(() => {
    shopMaterial.emissive.set(night ? '#ffb451' : '#000000')
    shopMaterial.emissiveIntensity = night ? 0.35 : 0
    windowMaterial.emissive.set(night ? '#ffcf88' : '#000000')
    windowMaterial.emissiveIntensity = night ? 0.25 : 0
  }, [night, shopMaterial, windowMaterial])

  return (
    <>
      <instancedMesh ref={shops} args={[shopGeometry, shopMaterial, data.shops.length]} />
      <instancedMesh ref={windows} args={[windowGeometry, windowMaterial, data.windows.length]} />
    </>
  )
}

function BrandSign({ name, night }: { name: string; night: boolean }) {
  const texture = useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 512
    canvas.height = 96
    const ctx = canvas.getContext('2d')!
    ctx.fillStyle = '#1c1917'
    ctx.fillRect(0, 0, 512, 96)
    ctx.fillStyle = '#fef08a'
    ctx.font = `700 ${name.length > 10 ? 36 : 48}px "DM Mono", sans-serif`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(name, 256, 49, 480)
    const map = new THREE.CanvasTexture(canvas)
    map.colorSpace = THREE.SRGBColorSpace
    return map
  }, [name])

  useEffect(() => () => texture.dispose(), [texture])
  return (
    <group>
      <mesh position={[0, 4.52, 0.25]}>
        <planeGeometry args={[3.8, 0.58]} />
        <meshStandardMaterial map={texture} emissive="#fde047" emissiveIntensity={night ? 1.8 : 0.2} toneMapped={false} />
      </mesh>
    </group>
  )
}

function MappedCity({ night }: { night: boolean }) {
  const [data, setData] = useState<OSMData | null>(null)
  useEffect(() => {
    fetch('/sector17-osm.json')
      .then(r => r.json())
      .then((map: OSMData) => {
        setData(map)
        const mapped = map.elements
          .filter(w => w.tags?.building && w.geometry)
          .map(w => {
            const points = (w.geometry ?? []).map(p => {
              const [x, z] = world(p.lat, p.lon)
              return new THREE.Vector2(x, z)
            })
            return {
              points,
              minX: Math.min(...points.map(p => p.x)),
              maxX: Math.max(...points.map(p => p.x)),
              minZ: Math.min(...points.map(p => p.y)),
              maxZ: Math.max(...points.map(p => p.y)),
            }
          })
        collisionGrid.clear()
        for (const f of mapped)
          for (let gx = Math.floor(f.minX / COLLISION_CELL); gx <= Math.floor(f.maxX / COLLISION_CELL); gx++)
            for (let gz = Math.floor(f.minZ / COLLISION_CELL); gz <= Math.floor(f.maxZ / COLLISION_CELL); gz++) {
              const key = `${gx},${gz}`, bucket = collisionGrid.get(key) ?? []
              bucket.push(f)
              collisionGrid.set(key, bucket)
            }
      })
      .catch(e => console.error('Sector 17 map data failed to load', e))
  }, [])

  const ways = data?.elements ?? []
  const buildings = ways.filter(w => w.tags?.building && w.geometry)
  const roads = ways.filter(w => w.tags?.highway && w.geometry)

  return (
    <group>
      <RoadNetwork ways={roads} />
      {buildings.map(w => (
        <MappedBuilding key={w.id} way={w} night={night} />
      ))}
      <FacadeLayer buildings={buildings} night={night} />
    </group>
  )
}

function PlazaTiles() {
  const geometry = useMemo(() => {
    const p: number[] = []
    for (let x = -64; x <= 64; x += 3.2) {
      if (x <= -29 || x >= -7) p.push(x, 0, -50, x, 0, 50)
      else p.push(x, 0, -14, x, 0, 50)
    }
    for (let z = -50; z <= 50; z += 3.2) {
      if (z > -14) p.push(-64, 0, z, 64, 0, z)
      else {
        p.push(-64, 0, z, -29, 0, z)
        p.push(-7, 0, z, 64, 0, z)
      }
    }
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.Float32BufferAttribute(p, 3))
    return g
  }, [])
  return (
    <lineSegments position={[0, 0.12, 0]} geometry={geometry}>
      <lineBasicMaterial color="#888275" transparent opacity={0.35} />
    </lineSegments>
  )
}

type RectBounds = [minX: number, maxX: number, minZ: number, maxZ: number]

function PlazaSlabs({ bounds, y, thickness, children }: {
  bounds: RectBounds
  y: number
  thickness: number
  children: React.ReactNode
}) {
  const [minX, maxX, minZ, maxZ] = bounds
  const hole: RectBounds = [-29, -7, -94, -14]
  const candidates: RectBounds[] = [
    [minX, Math.min(maxX, hole[0]), minZ, maxZ],
    [Math.max(minX, hole[1]), maxX, minZ, maxZ],
    [Math.max(minX, hole[0]), Math.min(maxX, hole[1]), minZ, Math.min(maxZ, hole[2])],
    [Math.max(minX, hole[0]), Math.min(maxX, hole[1]), Math.max(minZ, hole[3]), maxZ],
  ]
  const pieces = candidates.filter(([x1, x2, z1, z2]) => x2 > x1 && z2 > z1)

  return <group>{pieces.map(([x1, x2, z1, z2], index) => (
    <mesh key={index} position={[(x1 + x2) / 2, y, (z1 + z2) / 2]} receiveShadow>
      <boxGeometry args={[x2 - x1, thickness, z2 - z1]} />
      {children}
    </mesh>
  ))}</group>
}

function FestiveCanopy({ night }: { night: boolean }) {
  const canopies = useRef<THREE.InstancedMesh>(null), bulbs = useRef<THREE.InstancedMesh>(null)
  const cone = useMemo(() => new THREE.ConeGeometry(1.05, 0.38, 10), [])
  const bulb = useMemo(() => new THREE.SphereGeometry(0.045, 6, 6), [])
  const material = useMemo(
    () => new THREE.MeshStandardMaterial({ color: '#d9ceb3', emissive: '#cf9848', emissiveIntensity: 0.3, roughness: 0.72 }),
    []
  )
  const glow = useMemo(() => new THREE.MeshBasicMaterial({ color: '#ffe0a0' }), [])

  useEffect(() => {
    const hat = new THREE.Object3D(), light = new THREE.Object3D()
    let i = 0
    for (let x = -45; x <= 45; x += 9)
      for (let z = -36; z <= 36; z += 9) {
        hat.position.set(x, 9.1, z)
        hat.rotation.set(Math.PI, 0, ((i % 4) * Math.PI) / 2)
        hat.updateMatrix()
        canopies.current?.setMatrixAt(i, hat.matrix)
        light.position.set(x, 8.72, z)
        light.updateMatrix()
        bulbs.current?.setMatrixAt(i, light.matrix)
        i++
      }
    if (canopies.current) canopies.current.instanceMatrix.needsUpdate = true
    if (bulbs.current) bulbs.current.instanceMatrix.needsUpdate = true
  }, [])

  return (
    <group visible={night}>
      <instancedMesh ref={canopies} args={[cone, material, 99]} />
      <instancedMesh ref={bulbs} args={[bulb, glow, 99]} />
    </group>
  )
}

function Plaza({ night = false }: { night?: boolean }) {
  const pavers = useMemo(() => textures.getPlazaPaversTexture(), [])
  const brick = useMemo(() => textures.getChandigarhBrickTexture(), [])
  return (
    <group>
      {/* Ground and plaza paving stop at the open underpass slot. */}
      <PlazaSlabs bounds={[-700, 700, -600, 600]} y={-0.12} thickness={0.18}>
        <meshStandardMaterial color="#4d6142" roughness={0.96} />
      </PlazaSlabs>

      {/* Outer Plaza Terracotta / Sandstone Border */}
      <PlazaSlabs bounds={[-80, 80, -65, 65]} y={-0.015} thickness={0.16}>
        <meshStandardMaterial
          color="#9c3826"
          map={brick.diffuse}
          bumpMap={brick.bump}
          bumpScale={0.06}
          roughness={0.88}
        />
      </PlazaSlabs>

      {/* Main Pedestrian Paved Plaza Deck with Dual-Tone Corbusier Tiles */}
      <PlazaSlabs bounds={[-68, 68, -52, 52]} y={0.075} thickness={0.06}>
        <meshStandardMaterial
          color="#aaa394"
          map={pavers.diffuse}
          bumpMap={pavers.bump}
          bumpScale={0.035}
          roughness={0.9}
          metalness={0.01}
        />
      </PlazaSlabs>

      <PlazaTiles />
      <FestiveCanopy night={night} />

      {/* Authentic Pierre Jeanneret Style Benches along Plaza Perimeters */}
      {Array.from({ length: 14 }, (_, i) => (
        <Bench key={i} x={-48 + (i % 7) * 16} z={i < 7 ? -36 : 36} rotation={i < 7 ? 0 : Math.PI} />
      ))}

      {/* Plaza Street Lamps */}
      {[
        [-52, -38],
        [-52, 0],
        [-52, 38],
        [52, -38],
        [52, 0],
        [52, 38],
        [0, -42],
        [0, 42],
      ].map(([x, z], i) => (
        <StreetLamp key={`lamp${i}`} x={x} z={z} night={night} lit={i % 2 === 0} />
      ))}
    </group>
  )
}

function Bench({ x, z, rotation }: { x: number; z: number; rotation: number }) {
  return (
    <group position={[x, 0.5, z]} rotation={[0, rotation, 0]}>
      {/* Wooden Slat Seat */}
      <mesh castShadow>
        <boxGeometry args={[2.4, 0.12, 0.55]} />
        <meshStandardMaterial color="#734d26" roughness={0.7} />
      </mesh>
      {/* Concrete V-Legs (Pierre Jeanneret Signature) */}
      <mesh position={[-0.8, -0.25, 0]} rotation={[0, 0, 0.15]} castShadow>
        <boxGeometry args={[0.16, 0.45, 0.4]} />
        <meshStandardMaterial color="#8e897d" roughness={0.9} />
      </mesh>
      <mesh position={[0.8, -0.25, 0]} rotation={[0, 0, -0.15]} castShadow>
        <boxGeometry args={[0.16, 0.45, 0.4]} />
        <meshStandardMaterial color="#8e897d" roughness={0.9} />
      </mesh>
    </group>
  )
}

function StreetLamp({ x, z, night, lit }: { x: number; z: number; night: boolean; lit: boolean }) {
  return (
    <group position={[x, 0, z]}>
      <mesh position={[0, 3.8, 0]} castShadow>
        <cylinderGeometry args={[0.09, 0.15, 7.6, 10]} />
        <meshStandardMaterial color="#343a38" metalness={0.55} roughness={0.36} />
      </mesh>
      {/* Modernist Globe Lamp */}
      <mesh position={[0, 7.5, 0]}>
        <sphereGeometry args={[0.32, 16, 12]} />
        <meshStandardMaterial
          color="#fff6e0"
          emissive="#ffd17b"
          emissiveIntensity={night ? 6 : 0.2}
        />
      </mesh>
      {night && lit && <pointLight position={[0, 7.2, 0]} color="#ffce7d" intensity={14} distance={14} decay={2} />}
    </group>
  )
}

type MotionState = { current: 'idle' | 'walk' | 'run' }

export function RiggedHuman({
  motion,
  modelUrl = '/models/casual-man-rigged.glb',
  turban = false,
  turbanStyle = 'patiala',
  turbanColor = '#b81d24',
  fiftyColor = '#f5eedb',
  hasKalgi = false,
  hasBeard = true,
  beardColor = '#1c1b18',
}: {
  motion: MotionState
  modelUrl?: string
  turban?: boolean
  turbanStyle?: TurbanStyle
  turbanColor?: string
  fiftyColor?: string
  hasKalgi?: boolean
  hasBeard?: boolean
  beardColor?: string
}) {
  const { scene, animations } = useGLTF(modelUrl)
  const model = useMemo(() => SkeletonUtils.clone(scene) as THREE.Object3D, [scene])
  const root = useRef<THREE.Group>(null)
  const turbanRef = useRef<THREE.Group>(null)
  const headBoneRef = useRef<THREE.Object3D | null>(null)
  const { actions } = useAnimations(animations, root)
  const active = useRef<'walk' | 'run' | null>(null)
  const tmpPos = useMemo(() => new THREE.Vector3(), [])

  useEffect(() => {
    Object.values(actions).forEach(action => {
      if (action) {
        action.setLoop(THREE.LoopRepeat, Infinity)
        action.clampWhenFinished = false
      }
    })
    model.traverse(node => {
      if (node.name === 'Head') headBoneRef.current = node
    })
  }, [actions, model])

  useFrame(() => {
    const next = motion.current === 'idle' ? null : motion.current
    if (next !== active.current) {
      if (active.current) actions[active.current]?.fadeOut(0.18)
      if (next) actions[next]?.reset().fadeIn(0.18).play()
      active.current = next
    }

    if (turban && turbanRef.current && root.current) {
      if (headBoneRef.current) {
        headBoneRef.current.getWorldPosition(tmpPos)
        root.current.worldToLocal(tmpPos)
        turbanRef.current.position.set(tmpPos.x, tmpPos.y, tmpPos.z)
      } else {
        turbanRef.current.position.set(0, 1.58, 0)
      }
    }
  })

  return (
    <group ref={root}>
      <primitive object={model} />
      {turban && (
        <group ref={turbanRef} position={[0, 1.70, 0.02]}>
          <PunjabiTurban
            style={turbanStyle}
            color={turbanColor}
            fiftyColor={fiftyColor}
            hasKalgi={hasKalgi}
            hasBeard={hasBeard}
            beardColor={beardColor}
            scale={0.96}
          />
        </group>
      )}
    </group>
  )
}

function Car({
  driving,
  position,
  carPosition,
  night,
  onEnter,
}: {
  driving: boolean
  position: { current: THREE.Vector3 }
  carPosition: { current: THREE.Vector3 }
  night: boolean
  onEnter: () => void
}) {
  const car = useRef<THREE.Group>(null)
  const model = useGLTF('/models/1980s-sedan.glb')
  const wheels = useMemo(() => {
    const found: THREE.Object3D[] = []
    model.scene.traverse(node => {
      if (node.name.includes('wheel_')) found.push(node)
    })
    return found
  }, [model.scene])
  const last = useRef(new THREE.Vector3(position.current.x, 0, position.current.z))

  useEffect(() => () => removeMovingObstacle('player-car'), [])

  useFrame(() => {
    if (driving) {
      const p = position.current, dx = p.x - last.current.x, dz = p.z - last.current.z
      const signed = dx * Math.sin(p.y) + dz * Math.cos(p.y)
      for (const wheel of wheels) wheel.rotation.x += signed / 0.3
      last.current.set(p.x, 0, p.z)
      carPosition.current.set(p.x, p.y, p.z)
    } else {
      last.current.set(carPosition.current.x, 0, carPosition.current.z)
    }
    if (car.current) {
      car.current.position.set(carPosition.current.x, 0, carPosition.current.z)
      car.current.rotation.y = carPosition.current.y
      setMovingObstacle('player-car', carPosition.current.x, carPosition.current.z, 1.65)
    }
  })

  return (
    <group ref={car} position={[44, 0, -48]} onClick={onEnter} userData={{ sector17CollisionIgnore: true }}>
      <primitive object={model.scene} />
      {/* Car Headlights & Beam */}
      {night && (
        <group position={[0, 0.6, 2.0]}>
          <pointLight color="#fff3cc" intensity={25} distance={15} />
          {/* Twin Headlight Spotlights */}
          <spotLight
            position={[-0.65, 0, 0]}
            target-position={[-0.65, -0.5, 18]}
            angle={0.4}
            penumbra={0.3}
            intensity={45}
            distance={30}
            color="#fff8db"
          />
          <spotLight
            position={[0.65, 0, 0]}
            target-position={[0.65, -0.5, 18]}
            angle={0.4}
            penumbra={0.3}
            intensity={45}
            distance={30}
            color="#fff8db"
          />
        </group>
      )}
      {/* Taillights */}
      {night && (
        <pointLight position={[0, 0.6, -2.1]} color="#ff1100" intensity={12} distance={6} />
      )}
    </group>
  )
}

const trafficColors = ['#171d25', '#faf7ef', '#c9222c', '#e4b900', '#243c69', '#8a9095']
function TrafficVehicle({ index }: { index: number }) {
  const ref = useRef<THREE.Group>(null), scooter = index >= 4, color = trafficColors[index % trafficColors.length]
  useEffect(() => () => removeMovingObstacle(`traffic-${index}`), [index])
  useFrame(({ clock }) => {
    if (!ref.current) return
    const dir = index % 2 ? 1 : -1
    const z = (index % 2 ? 1 : -1) * (index < 4 ? 88 : 103)
    const x = THREE.MathUtils.euclideanModulo(clock.elapsedTime * (index % 3 === 0 ? 8 : 5) * dir + index * 48 + 130, 260) - 130
    ref.current.position.set(x, 0.05, z)
    ref.current.rotation.y = dir > 0 ? Math.PI / 2 : -Math.PI / 2
    setMovingObstacle(`traffic-${index}`, x, z, scooter ? 0.8 : 1.65)
  })

  return (
    <group ref={ref} userData={{ sector17CollisionIgnore: true }}>
      {scooter ? (
        <>
          <mesh position={[0, 0.72, 0]} castShadow>
            <capsuleGeometry args={[0.22, 0.9, 4, 8]} />
            <meshStandardMaterial color={color} roughness={0.62} />
          </mesh>
          <mesh position={[0.08, 1.02, -0.1]}>
            <sphereGeometry args={[0.2, 10, 8]} />
            <meshStandardMaterial color="#202326" />
          </mesh>
          {[-0.62, 0.62].map(z => (
            <mesh key={z} position={[0, 0.22, z]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.23, 0.23, 0.12, 12]} />
              <meshStandardMaterial color="#222" />
            </mesh>
          ))}
        </>
      ) : (
        <>
          <mesh position={[0, 0.62, 0]} castShadow>
            <boxGeometry args={[index === 1 ? 1.9 : 1.82, index === 1 ? 0.68 : 0.56, index === 3 ? 3.9 : 4.25]} />
            <meshStandardMaterial color={color} metalness={index === 0 || index === 4 ? 0.72 : 0.4} roughness={0.28} />
          </mesh>
          <mesh position={[0, index === 1 ? 1.22 : 1.08, -0.1]} castShadow>
            <boxGeometry args={[index === 1 ? 1.68 : 1.62, index === 3 ? 0.4 : index === 1 ? 0.66 : 0.5, index === 3 ? 1.5 : index === 2 ? 1.82 : 2.05]} />
            <meshStandardMaterial color={index === 3 ? '#171b20' : '#26313a'} metalness={0.32} roughness={0.22} />
          </mesh>
          <mesh position={[0, 0.91, 2.14]}>
            <boxGeometry args={[1.2, 0.18, 0.06]} />
            <meshStandardMaterial color="#fff2c6" emissive="#fff2c6" emissiveIntensity={1.7} />
          </mesh>
          <mesh position={[0, 0.88, -2.14]}>
            <boxGeometry args={[1.2, 0.17, 0.06]} />
            <meshStandardMaterial color="#d43325" emissive="#bf180f" emissiveIntensity={0.7} />
          </mesh>
          {[-0.92, 0.92].flatMap(x =>
            [-1.35, 1.35].map(z => (
              <mesh key={`${x}-${z}`} position={[x, 0.38, z]} rotation={[0, 0, Math.PI / 2]}>
                <cylinderGeometry args={[0.34, 0.34, 0.18, 12]} />
                <meshStandardMaterial color="#111" roughness={0.95} />
              </mesh>
            ))
          )}
        </>
      )}
    </group>
  )
}
function TrafficFleet() {
  return (
    <group>
      {Array.from({ length: 6 }, (_, i) => (
        <TrafficVehicle key={i} index={i} />
      ))}
    </group>
  )
}

function getGroundY(x: number, z: number): number {
  // Broad continuous ramps down to and back up from the Rose Garden underpass.
  if (x >= -25.5 && x <= -10.5) {
    if (z <= -14 && z >= -27) {
      return THREE.MathUtils.mapLinear(z, -14, -27, 0, -3.2)
    }
    if (z < -27 && z >= -81) {
      return -3.2
    }
    if (z < -81 && z >= -94) {
      return THREE.MathUtils.mapLinear(z, -81, -94, -3.2, 0)
    }
  }
  return 0
}

function Player({
  driving,
  position,
  headingRequest,
  onSpeed,
  waypoint,
  onReachWaypoint,
  cameraMode,
  onYawChange,
  touchKeys,
}: {
  driving: boolean
  position: { current: THREE.Vector3 }
  headingRequest: { current: number | null }
  onSpeed: (value: number) => void
  waypoint: { current: THREE.Vector3 | null }
  onReachWaypoint: () => void
  cameraMode: number
  onYawChange: (yaw: number) => void
  touchKeys: { current: Record<string, boolean> }
}) {
  const body = useRef<THREE.Group>(null), yaw = useRef(0), keys = useRef<Record<string, boolean>>({}), cam = useThree(s => s.camera), vel = useRef(0), jumpY = useRef(0), jumpV = useRef(0), speedTimer = useRef(0)
  const cameraAim = useRef(new THREE.Vector3())
  const cameraAimReady = useRef(false)
  const motion = useRef<MotionState['current']>('idle')
  const stepTimer = useRef(0)
  const yawUiTimer = useRef(0)
  const lastYawUi = useRef(0)

  useEffect(() => {
    let isMouseDown = false
    let lastX = 0
    let activeTouchId: number | null = null

    const down = (e: KeyboardEvent) => {
      keys.current[e.code] = true
      // Car Horn
      if (e.code === 'KeyH' && driving) {
        sound.playHorn()
      }
    }
    const up = (e: KeyboardEvent) => (keys.current[e.code] = false)
    const clearInput = () => {
      keys.current = {}
      touchKeys.current = {}
      isMouseDown = false
      activeTouchId = null
    }

    const onMouseDown = (e: MouseEvent) => {
      if ((e.target as HTMLElement).closest('button, .minimap-container, .hud-btn, .quest-drawer, .modal-card, .postcard-card, .radio-panel, a, input, select')) return
      isMouseDown = true
      lastX = e.clientX
    }

    const onMouseUp = () => {
      isMouseDown = false
    }

    const mouse = (e: MouseEvent) => {
      if (document.pointerLockElement) {
        yaw.current -= e.movementX * 0.0025
      } else if (isMouseDown) {
        const dx = e.clientX - lastX
        lastX = e.clientX
        yaw.current -= dx * 0.004
      }
    }

    const touchLookStart = (e: PointerEvent) => {
      if (e.pointerType !== 'touch') return
      if ((e.target as HTMLElement).closest('.mobile-controls, .top-nav, .bottom-bar, .interaction-prompt, .minimap-container, .quest-drawer, .modal-overlay, .postcard-overlay, .radio-panel, button, a, input, select')) return
      activeTouchId = e.pointerId
      lastX = e.clientX
    }

    const touchLookMove = (e: PointerEvent) => {
      if (e.pointerType !== 'touch' || e.pointerId !== activeTouchId) return
      yaw.current -= (e.clientX - lastX) * 0.007
      lastX = e.clientX
    }

    const touchLookEnd = (e: PointerEvent) => {
      if (e.pointerId === activeTouchId) activeTouchId = null
    }

    window.addEventListener('keydown', down)
    window.addEventListener('keyup', up)
    window.addEventListener('mousedown', onMouseDown)
    window.addEventListener('mouseup', onMouseUp)
    window.addEventListener('mousemove', mouse)
    window.addEventListener('pointerdown', touchLookStart)
    window.addEventListener('pointermove', touchLookMove)
    window.addEventListener('pointerup', touchLookEnd)
    window.addEventListener('pointercancel', touchLookEnd)
    window.addEventListener('blur', clearInput)
    document.addEventListener('visibilitychange', clearInput)
    return () => {
      window.removeEventListener('keydown', down)
      window.removeEventListener('keyup', up)
      window.removeEventListener('mousedown', onMouseDown)
      window.removeEventListener('mouseup', onMouseUp)
      window.removeEventListener('mousemove', mouse)
      window.removeEventListener('pointerdown', touchLookStart)
      window.removeEventListener('pointermove', touchLookMove)
      window.removeEventListener('pointerup', touchLookEnd)
      window.removeEventListener('pointercancel', touchLookEnd)
      window.removeEventListener('blur', clearInput)
      document.removeEventListener('visibilitychange', clearInput)
    }
  }, [driving, onYawChange, touchKeys])

  useFrame((_, dt) => {
    dt = Math.min(dt, 0.05)
    const k = { ...keys.current, ...touchKeys.current }, p = position.current
    if (headingRequest.current !== null) {
      yaw.current = headingRequest.current
      headingRequest.current = null
    }

    if (!driving) {
      let f = (k.KeyW || k.ArrowUp ? 1 : 0) - (k.KeyS || k.ArrowDown ? 1 : 0)
      const s = (k.KeyD || k.ArrowRight ? 1 : 0) - (k.KeyA || k.ArrowLeft ? 1 : 0)

      if (waypoint.current) {
        const dx = waypoint.current.x - p.x, dz = waypoint.current.z - p.z, dist = Math.hypot(dx, dz)
        if (dist < 1.5) {
          waypoint.current = null
          onReachWaypoint()
        } else if (!f && !s) {
          f = 1
          const desired = Math.atan2(dx, dz)
          const delta = THREE.MathUtils.euclideanModulo(desired - yaw.current + Math.PI, Math.PI * 2) - Math.PI
          yaw.current += THREE.MathUtils.clamp(delta, -2.5 * dt, 2.5 * dt)
        }
      }

      const target = (k.ShiftLeft ? 8.5 : 4.5) * (f ? Math.sign(f) : 0)
      vel.current = THREE.MathUtils.damp(vel.current, target, 5, dt)
      yaw.current += s * dt * 2.2

      if (k.Space && jumpY.current === 0) jumpV.current = 5.3
      jumpV.current -= 9.81 * dt
      jumpY.current = Math.max(0, jumpY.current + jumpV.current * dt)
      if (jumpY.current === 0) jumpV.current = 0

      const nx = THREE.MathUtils.clamp(p.x + Math.sin(yaw.current) * vel.current * dt, -600, 600)
      const nz = THREE.MathUtils.clamp(p.z + Math.cos(yaw.current) * vel.current * dt, -550, 550)

      if (!blocked(nx, nz, 0.55)) updatePosition(p, nx, nz)
      else {
        const slideX = !blocked(nx, p.z, 0.55)
        const slideZ = !blocked(p.x, nz, 0.55)
        if (slideX) updatePosition(p, nx, p.z)
        if (slideZ) updatePosition(p, slideX ? nx : p.x, nz)
        if (!slideX && !slideZ) vel.current = 0
      }

      motion.current = Math.abs(vel.current) < 0.2 ? 'idle' : k.ShiftLeft ? 'run' : 'walk'

      // Procedural Footstep audio
      if (motion.current !== 'idle' && jumpY.current === 0) {
        stepTimer.current += dt
        const stepInterval = k.ShiftLeft ? 0.32 : 0.48
        if (stepTimer.current > stepInterval) {
          sound.playFootstep('plaza')
          stepTimer.current = 0
        }
      }

      const currentGroundY = getGroundY(p.x, p.z)
      if (body.current) {
        // Keep the pelvis anchored to the ground; gait bob is handled by the
        // rig, so the whole character does not visibly hover between steps.
        body.current.position.set(p.x, currentGroundY + jumpY.current, p.z)
        body.current.rotation.y = yaw.current
      }
    } else {
      const acc = (k.KeyW ? 1 : 0) - (k.KeyS ? 1 : 0)
      const steer = (k.KeyA ? 1 : 0) - (k.KeyD ? 1 : 0)
      vel.current = THREE.MathUtils.damp(vel.current, acc * 18, 2.1, dt)
      yaw.current += steer * Math.min(1, Math.abs(vel.current) / 5) * dt * 0.8

      const nx = THREE.MathUtils.clamp(p.x + Math.sin(yaw.current) * vel.current * dt, -600, 600)
      const nz = THREE.MathUtils.clamp(p.z + Math.cos(yaw.current) * vel.current * dt, -550, 550)

      if (!blocked(nx, nz, 1.25, 'player-car')) updatePosition(p, nx, nz, yaw.current)
      else {
        const slideX = !blocked(nx, p.z, 1.25, 'player-car')
        const slideZ = !blocked(p.x, nz, 1.25, 'player-car')
        if (slideX) updatePosition(p, nx, p.z, yaw.current)
        if (slideZ) updatePosition(p, slideX ? nx : p.x, nz, yaw.current)
        if (!slideX && !slideZ) vel.current = 0
      }
      motion.current = 'idle'
    }

    // The minimap only needs a light HUD refresh; avoid React state updates on
    // every render frame while the player turns or steers.
    yawUiTimer.current += dt
    if (yawUiTimer.current >= 0.1) {
      const yawDelta = Math.abs(THREE.MathUtils.euclideanModulo(yaw.current - lastYawUi.current + Math.PI, Math.PI * 2) - Math.PI)
      if (yawDelta > 0.008) {
        lastYawUi.current = yaw.current
        onYawChange(yaw.current)
      }
      yawUiTimer.current = 0
    }

    const currentSpeedKmh = driving ? Math.round(Math.abs(vel.current) * 3.6) : 0
    sound.updateEngine(driving, currentSpeedKmh)

    speedTimer.current += dt
    if (speedTimer.current > 0.12) {
      onSpeed(currentSpeedKmh)
      speedTimer.current = 0
    }

    const forward = new THREE.Vector3(Math.sin(yaw.current), 0, Math.cos(yaw.current))
    const currentGroundY = getGroundY(p.x, p.z)
    const target = new THREE.Vector3(p.x, currentGroundY + (driving ? 1.45 : 1.35), p.z)
    const underpassCamera = currentGroundY < -0.5
    // Keep a recognisable over-the-shoulder view: modest height, enough
    // downward pitch to read the avatar and the paving ahead together.
    const cameraRight = new THREE.Vector3(forward.z, 0, -forward.x)
    let offset = new THREE.Vector3(-forward.x * 5.7, underpassCamera ? 1.35 : 1.85, -forward.z * 5.7)
    offset.addScaledVector(cameraRight, 0.85)

    if (cameraMode === 1) {
      // Front Portrait / Selfie / Close-up Turban Inspection directly at eye level
      offset.set(forward.x * 1.35, driving ? 0.3 : 0.04, forward.z * 1.35)
      target.set(p.x, currentGroundY + (driving ? 1.35 : 1.58), p.z)
    } else if (cameraMode === 2) {
      // First Person POV
      offset.set(forward.x * 0.04, driving ? 1.15 : 0.08, forward.z * 0.04)
      target.set(p.x, currentGroundY + (driving ? 1.25 : 1.62), p.z)
      target.addScaledVector(forward, 10)
    } else if (cameraMode === 3) {
      // Top-Down Drone / Corbusier Architectural Bird's Eye View
      offset.set(0, 48, 0.1)
      target.set(p.x, 0, p.z)
    } else {
      // Aim a little farther down the street so the avatar sits below centre.
      target.addScaledVector(forward, driving ? 1.8 : 1.25)
    }

    // Smooth both camera position and aim to avoid snaps when turning or
    // crossing the underpass ramps.
    const camAlpha = 1 - Math.exp(-8.5 * Math.min(dt, 0.05))
    const lookTarget = target.clone()
    cam.position.lerp(lookTarget.clone().add(offset), camAlpha)
    if (!cameraAimReady.current) {
      cameraAim.current.copy(lookTarget)
      cameraAimReady.current = true
    } else {
      cameraAim.current.lerp(lookTarget, 1 - Math.exp(-10 * Math.min(dt, 0.05)))
    }
    cam.lookAt(cameraAim.current)
  })

  const charConfig = useCharacterShopStore(s => s.charConfig)
  const isDancing = useCharacterShopStore(s => s.isDancing)

  return (
    <group ref={body} position={[position.current.x, 0, position.current.z]} visible={!driving} userData={{ sector17CollisionIgnore: true }}>
      <Suspense fallback={null}>
        <DynamicCharacter
          motion={motion}
          velocity={Math.abs(vel.current)}
          isDancing={isDancing}
          config={charConfig}
        />
      </Suspense>
    </group>
  )
}

function TouchHoldButton({
  label,
  code,
  touchKeys,
  onPress,
  children,
}: {
  label: string
  code: string
  touchKeys: { current: Record<string, boolean> }
  onPress?: () => void
  children: ReactNode
}) {
  const release = () => {
    touchKeys.current[code] = false
  }

  return (
    <button
      type="button"
      className="touch-action touch-hold"
      aria-label={label}
      onPointerDown={event => {
        event.preventDefault()
        event.currentTarget.setPointerCapture(event.pointerId)
        touchKeys.current[code] = true
        onPress?.()
      }}
      onPointerUp={release}
      onPointerCancel={release}
      onLostPointerCapture={release}
      onContextMenu={event => event.preventDefault()}
    >
      {children}
    </button>
  )
}

function CrowdWalker({ index }: { index: number }) {
  const actor = useRef<THREE.Group>(null), motion = useRef<MotionState['current']>('walk')
  useEffect(() => () => removeMovingObstacle(`plaza-pedestrian-${index}`), [index])
  const params = useMemo(
    () => ({
      phase: (index * Math.PI * 2) / 8 + 0.35,
      rx: 24 + (index % 3) * 4,
      rz: 20 + (index % 4) * 3,
      speed: 1.15 / (24 + (index % 3) * 4),
      direction: index % 2 ? 1 : -1,
    }),
    [index]
  )

  const walkerConfig: CharacterConfig = useMemo(() => {
    const isGirl = index % 3 === 0
    const isSardar = index % 3 === 1
    const turbanStyles: TurbanStyle[] = ['patiala', 'royal', 'morni', 'dumalla']
    const turbanColors = ['#1d3557', '#e67e22', '#1b4332', '#7b1113', '#d4971c', '#f8fafc']
    const femaleHairstyles = ['girl_braid', 'girl_ponytail', 'girl_bob'] as const
    const femaleOutfits = ['punjabi_suit', 'western_casual', 'elante_chic'] as const

    return {
      archetype: isGirl ? 'girl' : isSardar ? 'sardar' : 'man',
      femaleOutfit: femaleOutfits[index % femaleOutfits.length],
      maleOutfit: 'streetwear_casual',
      turban: {
        style: turbanStyles[index % turbanStyles.length],
        color: turbanColors[index % turbanColors.length],
        fiftyColor: '#ffffff',
        hasKalgi: index % 4 === 1,
        hasBeard: true,
        beardColor: '#1c1b18',
      },
      hairstyle: isGirl ? femaleHairstyles[index % femaleHairstyles.length] : 'pompadour',
      hairColor: index % 2 === 0 ? '#111111' : '#2d1b0d',
      hasEyewear: index % 2 === 0,
      eyewearColor: '#eab308',
      topColor: isGirl ? '#ec4899' : '#0284c7',
      bottomColor: '#1e293b',
      shoesColor: '#ffffff',
      hasShoppingBags: index % 3 === 1,
      hasJhumkas: isGirl,
      hasDrink: false,
    }
  }, [index])

  useFrame(({ clock }) => {
    if (!actor.current) return
    const t = clock.elapsedTime * params.speed * params.direction + params.phase
    const x = Math.cos(t) * params.rx
    const z = Math.sin(t) * params.rz
    const dx = -Math.sin(t) * params.rx * params.speed * params.direction
    const dz = Math.cos(t) * params.rz * params.speed * params.direction
    const gy = getGroundY(x, z)
    actor.current.position.set(x, gy, z)
    actor.current.rotation.y = Math.atan2(dx, dz)
    setMovingObstacle(`plaza-pedestrian-${index}`, x, z, 0.58)
  })

  return (
    <group ref={actor} userData={{ sector17CollisionIgnore: true }}>
      <Suspense fallback={null}>
        <DynamicCharacter
          motion={motion}
          velocity={1.8}
          config={walkerConfig}
        />
      </Suspense>
    </group>
  )
}
function PedestrianCrowd() {
  return (
    <group>
      {Array.from({ length: 8 }, (_, i) => (
        <CrowdWalker key={i} index={i} />
      ))}
    </group>
  )
}

type TimeOfDay = 'day' | 'sunset' | 'night'

function DayNightRig({ timeOfDay }: { timeOfDay: TimeOfDay }) {
  const bg = useRef<THREE.Color>(null), haze = useRef<THREE.Fog>(null), ambient = useRef<THREE.AmbientLight>(null), hemi = useRef<THREE.HemisphereLight>(null), sun = useRef<THREE.DirectionalLight>(null)

  const configs = useMemo(
    () => ({
      day: {
        bg: new THREE.Color('#98cae8'),
        fog: new THREE.Color('#c6e3ef'),
        sunColor: new THREE.Color('#fff4e0'),
        ambient: 0.26,
        hemi: 0.54,
        sunIntensity: 1.3,
        fogNear: 140,
        fogFar: 360,
        sunPos: [-60, 65, -40] as [number, number, number],
      },
      sunset: {
        bg: new THREE.Color('#cf714a'),
        fog: new THREE.Color('#e08f65'),
        sunColor: new THREE.Color('#ff884d'),
        ambient: 0.34,
        hemi: 0.68,
        sunIntensity: 1.75,
        fogNear: 100,
        fogFar: 300,
        sunPos: [-80, 25, -20] as [number, number, number],
      },
      night: {
        bg: new THREE.Color('#0c131d'),
        fog: new THREE.Color('#141d2a'),
        sunColor: new THREE.Color('#7a8fb5'),
        ambient: 0.09,
        hemi: 0.14,
        sunIntensity: 0.025,
        fogNear: 55,
        fogFar: 220,
        sunPos: [-40, 50, -30] as [number, number, number],
      },
    }),
    []
  )

  const cfg = configs[timeOfDay]

  useFrame(({ scene }, dt) => {
    const t = 1 - Math.exp(-2.2 * dt)
    bg.current?.lerp(cfg.bg, t)
    if (scene.background instanceof THREE.Color) {
      scene.background.lerp(cfg.bg, t)
    }
    if (haze.current) {
      haze.current.color.lerp(cfg.fog, t)
      haze.current.near = THREE.MathUtils.damp(haze.current.near, cfg.fogNear, 2, dt)
      haze.current.far = THREE.MathUtils.damp(haze.current.far, cfg.fogFar, 2, dt)
    }
    if (ambient.current) ambient.current.intensity = THREE.MathUtils.damp(ambient.current.intensity, cfg.ambient, 2, dt)
    if (hemi.current) hemi.current.intensity = THREE.MathUtils.damp(hemi.current.intensity, cfg.hemi, 2, dt)
    if (sun.current) {
      sun.current.intensity = THREE.MathUtils.damp(sun.current.intensity, cfg.sunIntensity, 2, dt)
      sun.current.color.lerp(cfg.sunColor, t)
    }
  })

  return (
    <>
      <color ref={bg} attach="background" args={['#98cae8']} />
      <fog ref={haze} attach="fog" args={['#c6e3ef', 140, 360]} />
      {timeOfDay !== 'night' ? (
        <Sky sunPosition={cfg.sunPos} turbidity={timeOfDay === 'sunset' ? 6 : 1.8} rayleigh={timeOfDay === 'sunset' ? 4 : 2.6} />
      ) : (
        <Stars radius={120} depth={50} count={700} factor={3} saturation={0} fade speed={0.15} />
      )}
      <ambientLight ref={ambient} intensity={0.3} />
      <hemisphereLight ref={hemi} args={['#c9e8fa', '#566b47', 0.72]} />
      <directionalLight
        ref={sun}
        position={cfg.sunPos}
        color="#fff4e0"
        intensity={2.8}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
    </>
  )
}

const Scene = memo(function Scene({
  driving,
  onEnter,
  onClubTeleport,
  position,
  headingRequest,
  carPosition,
  onSpeed,
  timeOfDay,
  waypoint,
  onReachWaypoint,
  cameraMode,
  onYawChange,
  touchKeys,
}: {
  driving: boolean
  onEnter: () => void
  onClubTeleport: (x: number, z: number, yaw: number) => void
  position: { current: THREE.Vector3 }
  headingRequest: { current: number | null }
  carPosition: { current: THREE.Vector3 }
  onSpeed: (value: number) => void
  timeOfDay: TimeOfDay
  waypoint: { current: THREE.Vector3 | null }
  onReachWaypoint: () => void
  cameraMode: number
  onYawChange: (yaw: number) => void
  touchKeys: { current: Record<string, boolean> }
}) {
  const isNight = timeOfDay === 'night'
  const fountainActive = useGameStore(s => s.fountainActive)

  return (
    <Canvas
      camera={{ position: [0, 4.15, -30], fov: 62 }}
      dpr={[1, 1.25]}
      gl={{
        antialias: true,
        powerPreference: 'high-performance',
        preserveDrawingBuffer: true,
        toneMapping: THREE.NoToneMapping,
        toneMappingExposure: 1,
      }}
      shadows
    >
      <DayNightRig timeOfDay={timeOfDay} />

      {/* Core Ground, Roads & OSM Footprints */}
      <Plaza night={isNight} />
      <MappedCity night={isNight} />

      {/* Iconic Sector 17 Custom Landmarks */}
      <NeelamCinema night={isNight} />
      <OpenHandMonument night={isNight} />
      <MusicalFountain night={isNight} active={fountainActive} playerPos={position.current} />
      <ColonnadeShops night={isNight} />
      <Sector17Clubs night={isNight} playerPos={position} onTeleport={onClubTeleport} />
      <Sector17Showrooms night={isNight} />
      <Sector17Underpass night={isNight} playerPos={position} />
      <ChandigarhVegetation night={isNight} />
      <PlazaPigeons playerPos={position.current} />

      {/* Traffic & Surroundings */}
      <TrafficFleet />
      <PedestrianCrowd />

      {/* Player and Car */}
      <Suspense fallback={null}>
        <Car
          driving={driving}
          position={position}
          carPosition={carPosition}
          night={isNight}
          onEnter={onEnter}
        />
      </Suspense>
      <Player
        driving={driving}
        position={position}
        headingRequest={headingRequest}
        onSpeed={onSpeed}
        waypoint={waypoint}
        onReachWaypoint={onReachWaypoint}
        cameraMode={cameraMode}
        onYawChange={onYawChange}
        touchKeys={touchKeys}
      />

      {/* Cinematic Post-Processing, Environment Reflections & Particle Mist */}
      <GraphicsEffects timeOfDay={timeOfDay} />
      <SceneObstacleCapture />
    </Canvas>
  )
})

export default function App() {
  const [driving, setDriving] = useState(false)
  const touchKeys = useRef<Record<string, boolean>>({})
  const pos = useRef(new THREE.Vector3(0, 0, 12))
  const headingRequest = useRef<number | null>(null)
  const car = useRef(new THREE.Vector3(44, 0, -48))
  const [hudPos, setHudPos] = useState({ player: new THREE.Vector3(0, 0, 12), car: new THREE.Vector3(44, 0, -48) })
  const [playerYaw, setPlayerYaw] = useState(0)
  const [speed, setSpeed] = useState(0)
  const [paused, setPaused] = useState(false)
  const [timeOfDay, setTimeOfDay] = useState<TimeOfDay>('day')
  const [cameraMode, setCameraMode] = useState(0)
  const [turbanConfig, setTurbanConfig] = useState<TurbanConfig>(TURBAN_PRESETS[0].config)
  const [turbanStudioOpen, setTurbanStudioOpen] = useState(false)
  const [waypoint, setWaypoint] = useState<THREE.Vector3 | null>(null)
  const waypointRef = useRef<THREE.Vector3 | null>(null)

  // Game Store State
  const {
    landmarks,
    quests,
    score,
    activeNotification,
    activeModal,
    setNotification,
    setModal,
    interactWithLandmark,
  } = useGameStore()

  const [questDrawerOpen, setQuestDrawerOpen] = useState(false)
  const [postcardOpen, setPostcardOpen] = useState(false)
  const [isMuted, setIsMuted] = useState(false)

  // Nearby landmark detection for prompt
  const nearbyLandmark = useMemo(() => {
    const p = hudPos.player
    for (const lm of landmarks) {
      const d = Math.hypot(lm.x - p.x, lm.z - p.z)
      if (d <= lm.radius) return lm
    }
    return null
  }, [hudPos.player, landmarks])

  // Distance to car
  const distToCar = hudPos.player.distanceTo(hudPos.car)
  const drivingRef = useRef(driving)
  const distanceToCarRef = useRef(distToCar)
  useLayoutEffect(() => {
    drivingRef.current = driving
    distanceToCarRef.current = distToCar
  }, [driving, distToCar])

  useEffect(() => {
    const timer = window.setInterval(
      () => {
        const player = pos.current
        const vehicle = car.current
        setHudPos(current => {
          if (
            current.player.distanceToSquared(player) < 0.01 &&
            current.car.distanceToSquared(vehicle) < 0.01
          ) return current
          return { player: player.clone(), car: vehicle.clone() }
        })
      },
      100
    )
    return () => window.clearInterval(timer)
  }, [])

  // Auto-dismiss notifications after 5 seconds
  useEffect(() => {
    if (activeNotification) {
      const timer = window.setTimeout(() => setNotification(null), 5000)
      return () => window.clearTimeout(timer)
    }
  }, [activeNotification, setNotification])

  const enterVehicle = useCallback(() => {
    if (distanceToCarRef.current < 12) {
      if (!drivingRef.current) {
        pos.current.set(car.current.x, 0, car.current.z)
        drivingRef.current = true
        setDriving(true)
      } else {
        // Step out beside the parked car instead of spawning inside its collider.
        pos.current.set(car.current.x + Math.cos(car.current.y) * 2.4, 0, car.current.z - Math.sin(car.current.y) * 2.4)
        drivingRef.current = false
        setDriving(false)
      }
    }
  }, [])

  // Character & Shopping Store
  const {
    cash,
    openShop,
    closeShop,
    toggleStudio,
    toggleElanteMall,
    isDancing,
    setIsDancing,
  } = useCharacterShopStore()

  useEffect(() => {
    ;(window as unknown as { __charShopStore?: unknown }).__charShopStore = useCharacterShopStore.getState()
  }, [])

  // Keyboard shortcut handlers
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      // Vehicle Enter/Exit
      if (e.code === 'KeyF') {
        enterVehicle()
      }
      // Interact with Landmark
      if (e.code === 'KeyE') {
        if (nearbyLandmark) {
          interactWithLandmark(nearbyLandmark.id)
          sound.playDiscoveryChime()
        }
      }
      // Camera switch
      if (e.code === 'KeyV') {
        setCameraMode(v => (v + 1) % 4)
      }
      // Character & Wardrobe Studio [C]
      if (e.code === 'KeyC') {
        setCameraMode(1)
        toggleStudio(true)
      }
      // Shopping Boutiques [B]
      if (e.code === 'KeyB') {
        openShop('nike')
      }
      // Elante Mall & Multiplex Cinema [L]
      if (e.code === 'KeyL') {
        toggleElanteMall(true)
      }
      // Club Groove & Dance Mode [G]
      if (e.code === 'KeyG') {
        setIsDancing(!isDancing)
        sound.playDiscoveryChime()
      }
      // Turban / Pagg Studio
      if (e.code === 'KeyT') {
        setTurbanStudioOpen(v => {
          if (!v) setCameraMode(1) // switch to front portrait when opening
          return !v
        })
      }
      // Photo Mode
      if (e.code === 'KeyP') {
        setPostcardOpen(v => !v)
      }
      // Mute audio
      if (e.code === 'KeyM') {
        const muted = sound.toggleMute()
        setIsMuted(muted)
      }
      // Pause
      if (e.code === 'Escape') {
        if (activeModal) setModal(null)
        else if (turbanStudioOpen) setTurbanStudioOpen(false)
        else if (postcardOpen) setPostcardOpen(false)
        else {
          closeShop()
          toggleStudio(false)
          toggleElanteMall(false)
          setPaused(v => !v)
        }
      }
    }

    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [nearbyLandmark, activeModal, turbanStudioOpen, postcardOpen, interactWithLandmark, setModal, isDancing, setIsDancing, openShop, closeShop, toggleStudio, toggleElanteMall, enterVehicle])

  const setDestination = useCallback((p: THREE.Vector3) => {
    waypointRef.current = p
    setWaypoint(p)
  }, [])

  const clearDestination = useCallback(() => {
    waypointRef.current = null
    setWaypoint(null)
  }, [])

  const toggleSound = useCallback(() => {
    const muted = sound.toggleMute()
    setIsMuted(muted)
  }, [])

  const warpTo = useCallback((x: number, z: number, yaw?: number) => {
    pos.current.set(x, 0, z)
    if (yaw !== undefined) headingRequest.current = yaw
    setHudPos({ player: pos.current.clone(), car: car.current.clone() })
    sound.playDiscoveryChime()
  }, [])

  return (
    <main className="game">
      {/* 3D Scene */}
      <Scene
        driving={driving}
        onEnter={enterVehicle}
        onClubTeleport={warpTo}
        position={pos}
        headingRequest={headingRequest}
        carPosition={car}
        onSpeed={setSpeed}
        timeOfDay={timeOfDay}
        waypoint={waypointRef}
        onReachWaypoint={clearDestination}
        cameraMode={cameraMode}
        onYawChange={setPlayerYaw}
        touchKeys={touchKeys}
      />

      <div className="crosshair">
        <div className="crosshair-reticle">
          <div className="crosshair-line north" />
          <div className="crosshair-line south" />
          <div className="crosshair-line west" />
          <div className="crosshair-line east" />
          <div className="crosshair-dot" />
        </div>
      </div>

      {/* Top Navigation & Status Bar */}
      <header className="top-nav">
        <div className="brand-section">
          <div className="brand-title">
            CHANDIGARH <span className="badge">SECTOR 17</span>
          </div>
          <div className="brand-divider" />
          <div className="brand-sub">PEDESTRIAN CITY CENTRE · LE CORBUSIER</div>
        </div>

        <div className="top-actions">
          {/* Chandigarh Cash Wallet Display */}
          <div className="cash-badge" title="Chandigarh Rupee Cash (Spend at Nike, Adidas, Reebok, Skechers & Elante Mall)">
            💰 ₹{cash.toLocaleString()}
          </div>
          <div className="score-badge">🏆 {score} XP</div>

          {/* Character & Wardrobe Studio (Sardar Ji, Normal Man, Chandigarh Girl) */}
          <button
            id="btn-character-studio"
            className="hud-btn highlight-btn"
            style={{ border: '1px solid #10b981', background: 'rgba(16, 185, 129, 0.18)', color: '#34d399' }}
            onClick={() => {
              setCameraMode(1)
              toggleStudio(true)
            }}
          >
            👤 CHARACTER & OUTFITS
          </button>

          {/* Elante Mall & Cinema Concourse */}
          <button
            id="btn-elante-mall"
            className="hud-btn"
            style={{ border: '1px solid #38bdf8', background: 'rgba(56, 189, 248, 0.18)', color: '#7dd3fc' }}
            onClick={() => toggleElanteMall(true)}
          >
            🏢 ELANTE MALL & MOVIES
          </button>

          {/* Brand Shopping Boutiques */}
          <button
            id="btn-shops"
            className="hud-btn"
            style={{ border: '1px solid #f97316', background: 'rgba(249, 115, 22, 0.18)', color: '#fb923c' }}
            onClick={() => openShop('nike')}
          >
            🛍️ SHOPS (NIKE / ADIDAS / REEBOK / SKECHERS)
          </button>

          {/* Dance / Club Groove Mode */}
          <button
            id="btn-dance"
            className={`hud-btn ${isDancing ? 'active-pulse' : ''}`}
            style={{ border: '1px solid #f43f5e', background: isDancing ? '#e11d48' : 'rgba(244, 63, 94, 0.18)', color: '#fda4af' }}
            onClick={() => {
              setIsDancing(!isDancing)
              sound.playDiscoveryChime()
            }}
          >
            💃 {isDancing ? 'STOP DANCING' : 'CLUB DANCE'}
          </button>

          <button id="btn-quests" className="hud-btn" onClick={() => setQuestDrawerOpen(v => !v)}>
            📋 {questDrawerOpen ? 'HIDE QUESTS' : 'QUESTS'}
          </button>
          <button id="btn-time-of-day" className="hud-btn" onClick={() => setTimeOfDay(current => current === 'night' ? 'day' : 'night')}>
            {timeOfDay === 'night' ? '☀️ DAY' : '🌙 NIGHT'}
          </button>
          <button id="btn-sunset" className="hud-btn" title="Set golden-hour sunset lighting" onClick={() => setTimeOfDay('sunset')}>
            🌇 SUNSET
          </button>
          <button id="btn-audio" className="hud-btn" onClick={toggleSound}>
            {isMuted ? '🔇 MUTED' : '🔊 AUDIO'}
          </button>
          <PunjabiRadio />
          <button id="btn-souvenir" className="hud-btn" onClick={() => setPostcardOpen(true)}>
            📸 SOUVENIR
          </button>
          <button
            id="btn-lock-mouse"
            className="hud-btn"
            style={{ border: '1px solid #a855f7', background: 'rgba(168, 85, 247, 0.18)', color: '#d8b4fe' }}
            onClick={() => document.body.requestPointerLock?.()}
            title="Lock mouse for FPS-style view (Press ESC to unlock cursor anytime)"
          >
            🎯 LOCK MOUSE
          </button>

          {/* Quick Fast-Travel / Warp Bar */}
          <div className="warp-nav" style={{ display: 'inline-flex', gap: '5px', alignItems: 'center', marginLeft: '6px', borderLeft: '1px solid rgba(255,255,255,0.15)', paddingLeft: '8px' }}>
            <span style={{ fontSize: '10px', color: '#94a3b8', fontWeight: 700, letterSpacing: '0.05em' }}>WARP:</span>
            <button
              id="btn-warp-underpass"
              className="hud-btn"
              style={{ padding: '4px 8px', fontSize: '10px', border: '1px solid #eab308', color: '#fde047', background: 'rgba(234, 179, 8, 0.18)' }}
              onClick={() => warpTo(-18, -54)}
              title="Fast travel to Sector 17 - Rose Garden Underpass"
            >
              🚇 UNDERPASS
            </button>
            <button
              id="btn-warp-shops"
              className="hud-btn"
              style={{ padding: '4px 8px', fontSize: '10px', border: '1px solid #f97316', color: '#fb923c', background: 'rgba(249, 115, 22, 0.18)' }}
              onClick={() => warpTo(-2, -24)}
              title="Fast travel to Nike, Adidas, Reebok & Skechers Showrooms"
            >
              👟 SHOWROOMS
            </button>
            <button
              id="btn-warp-club"
              className="hud-btn"
              style={{ padding: '4px 8px', fontSize: '10px', border: '1px solid #f43f5e', color: '#fda4af', background: 'rgba(244, 63, 94, 0.18)' }}
              onClick={() => warpTo(28.2, -2, Math.PI / 2)}
              title="Fast travel to Score Club 17 & Discotheque"
            >
              🪩 SCORE CLUB
            </button>
            <button
              id="btn-warp-fountain"
              className="hud-btn"
              style={{ padding: '4px 8px', fontSize: '10px', border: '1px solid #06b6d4', color: '#67e8f9', background: 'rgba(6, 182, 212, 0.18)' }}
              onClick={() => warpTo(0, -10)}
              title="Fast travel to Central Musical Fountain"
            >
              ⛲ FOUNTAIN
            </button>
          </div>
        </div>
      </header>

      {/* Quest & Landmark Tracker Drawer */}
      {questDrawerOpen && (
        <aside className="quest-drawer">
          <div className="quest-drawer-title">
            <span>SECTOR 17 EXPLORER</span>
            <small>{quests.filter(q => q.completed).length}/{quests.length} DONE</small>
          </div>
          {quests.map(q => (
            <div key={q.id} className={`quest-item ${q.completed ? 'completed' : ''}`}>
              <div className="quest-checkbox">{q.completed ? '✓' : ''}</div>
              <div className="quest-text">
                <strong>{q.title}</strong>
                <p style={{ margin: '2px 0 0', fontSize: '10px', color: '#94a3b8' }}>{q.description}</p>
              </div>
              <span className="quest-reward">+{q.rewardXp}</span>
            </div>
          ))}
        </aside>
      )}

      {/* Floating Context-Sensitive Prompt */}
      {nearbyLandmark && (
        <div className="interaction-prompt" onClick={() => {
          interactWithLandmark(nearbyLandmark.id)
          sound.playDiscoveryChime()
        }}>
          <span className="key-badge">E</span>
          <span className="prompt-text">{nearbyLandmark.prompt}</span>
        </div>
      )}
      {!nearbyLandmark && distToCar < 12 && !driving && (
        <div className="interaction-prompt" onClick={enterVehicle}>
          <span className="key-badge">F</span>
          <span className="prompt-text">Press [F] to enter 1980s Sedan</span>
        </div>
      )}
      {driving && (
        <div className="interaction-prompt" onClick={enterVehicle}>
          <span className="key-badge">F</span>
          <span className="prompt-text">Press [F] to exit vehicle</span>
        </div>
      )}

      {/* High-Fidelity Minimap */}
      <Minimap
        playerPos={hudPos.player}
        playerYaw={playerYaw}
        carPos={hudPos.car}
        isDriving={driving}
        landmarks={landmarks}
        waypoint={waypoint}
        onSetWaypoint={setDestination}
      />

      <div className="mobile-controls" aria-label="Touch game controls">
        <span className="touch-look-hint">DRAG THE SCENE TO LOOK</span>
        <div className="touch-dpad" aria-label="Move or steer">
          <span />
          <TouchHoldButton label="Move forward" code="KeyW" touchKeys={touchKeys}>▲</TouchHoldButton>
          <span />
          <TouchHoldButton label="Move left" code="KeyA" touchKeys={touchKeys}>◀</TouchHoldButton>
          <span className="touch-center">{driving ? 'DRIVE' : 'MOVE'}</span>
          <TouchHoldButton label="Move right" code="KeyD" touchKeys={touchKeys}>▶</TouchHoldButton>
          <span />
          <TouchHoldButton label="Move backward" code="KeyS" touchKeys={touchKeys}>▼</TouchHoldButton>
          <span />
        </div>

        <div className="touch-action-cluster">
          {driving ? (
            <>
              <TouchHoldButton label="Sound horn" code="KeyH" touchKeys={touchKeys} onPress={() => sound.playHorn()}>HORN</TouchHoldButton>
              <span className="touch-speed">{speed} KM/H</span>
            </>
          ) : (
            <>
              <TouchHoldButton label="Sprint" code="ShiftLeft" touchKeys={touchKeys}>RUN</TouchHoldButton>
              <TouchHoldButton label="Jump" code="Space" touchKeys={touchKeys}>JUMP</TouchHoldButton>
            </>
          )}
          {nearbyLandmark && (
            <button
              type="button"
              className="touch-action touch-action-primary"
              onClick={() => {
                interactWithLandmark(nearbyLandmark.id)
                sound.playDiscoveryChime()
              }}
            >
              INTERACT
            </button>
          )}
          {(driving || distToCar < 12) && (
            <button type="button" className="touch-action touch-action-primary" onClick={enterVehicle}>
              {driving ? 'EXIT CAR' : 'ENTER CAR'}
            </button>
          )}
          <button type="button" className="touch-action" onClick={() => setCameraMode(mode => (mode + 1) % 4)}>
            CAMERA {cameraMode + 1}/4
          </button>
          <button type="button" className="touch-action" onClick={() => setPaused(true)}>
            PAUSE
          </button>
        </div>
      </div>

      {/* Non-overlapping Bottom Controls Bar & Speedometer */}
      <footer className="bottom-bar">
        <div className="controls-badge-group">
          <span className="ctrl-tag"><kbd>W A S D</kbd> {driving ? 'DRIVE' : 'MOVE'}</span>
          <span className="ctrl-tag"><kbd>SHIFT</kbd> SPRINT</span>
          <span className="ctrl-tag"><kbd>SPACE</kbd> JUMP</span>
          <span className="ctrl-tag"><kbd>E</kbd> INTERACT</span>
          <span className="ctrl-tag"><kbd>F</kbd> CAR</span>
          {driving && <span className="ctrl-tag"><kbd>H</kbd> HORN</span>}
          <span className="ctrl-tag"><kbd>V</kbd> CAMERA ({cameraMode === 0 ? '3RD' : cameraMode === 1 ? 'PORTRAIT' : cameraMode === 2 ? '1ST' : 'DRONE'})</span>
          <span className="ctrl-tag"><kbd>ESC</kbd> CLOSE / PAUSE</span>
        </div>

        {driving && <div className="speed-gauge">{speed} KM/H</div>}
      </footer>

      {/* Notifications Banner */}
      {activeNotification && (
        <div className="notification-banner">
          <div className="notif-icon">{activeNotification.icon ?? '✨'}</div>
          <div className="notif-body">
            <h4>{activeNotification.title}</h4>
            <p>{activeNotification.message}</p>
          </div>
        </div>
      )}

      {/* Landmark Modal Dialogue */}
      {activeModal && (
        <div className="modal-overlay" onClick={() => setModal(null)}>
          <div className="modal-card" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{activeModal.title}</h2>
              <h3>{activeModal.subtitle}</h3>
            </div>
            {activeModal.imageTag && <div className="modal-badge">{activeModal.imageTag}</div>}
            <div className="modal-body">
              <p>{activeModal.content}</p>
            </div>
            <button className="modal-btn" onClick={() => setModal(null)}>
              CONTINUE EXPLORING
            </button>
          </div>
        </div>
      )}

      {/* Brand Shopping Boutique Modal (Nike, Adidas, Reebok, Skechers) */}
      <ShoppingModal />

      {/* Character Customizer Studio (Sardar Ji, Urban Man, Chandigarh Girl) */}
      <CharacterStudioModal />

      {/* Elante Mall Concourse & PVR Multiplex Cinema Modal */}
      <ElanteMallModal />

      {/* Postcard Photo Mode */}
      {postcardOpen && <PostcardMode onClose={() => setPostcardOpen(false)} />}

      {/* Turban & Dastar Customization Studio */}
      {turbanStudioOpen && (
        <TurbanCustomizer
          config={turbanConfig}
          onChange={setTurbanConfig}
          onClose={() => setTurbanStudioOpen(false)}
          onCameraFront={() => setCameraMode(1)}
          onOpenPostcard={() => {
            setTurbanStudioOpen(false)
            setPostcardOpen(true)
          }}
        />
      )}

      {/* Pause Menu Overlay */}
      {paused && (
        <div className="pause">
          <section>
            <p>CHANDIGARH · SECTOR 17</p>
            <h1>Paused.</h1>
            <button onClick={() => setPaused(false)}>RESUME EXPLORING</button>
            <small>Click view to lock camera. Press ESC to return anytime.</small>
          </section>
        </div>
      )}
    </main>
  )
}
