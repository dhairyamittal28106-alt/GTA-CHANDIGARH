import { useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

const CELL_SIZE = 32
const staticGrid = new Map<string, THREE.Box3[]>()
const movingObstacles = new Map<string, { x: number; z: number; radius: number; pedestrian: boolean }>()

const cellKey = (x: number, z: number) => `${x},${z}`

export function setMovingObstacle(id: string, x: number, z: number, radius: number) {
  movingObstacles.set(id, { x, z, radius, pedestrian: id.includes('pedestrian') })
}

export function removeMovingObstacle(id: string) {
  movingObstacles.delete(id)
}

function hasIgnoredAncestor(object: THREE.Object3D) {
  for (let node: THREE.Object3D | null = object; node; node = node.parent) {
    if (node.userData.sector17CollisionIgnore) return true
  }
  return false
}

 
export function SceneObstacleCapture() {
  const scene = useThree(state => state.scene)
  const elapsed = useRef(0)
  const scanClock = useRef(0)
  const indexed = useRef(new Set<string>())
  const localBounds = useRef(new THREE.Box3()).current

  useFrame((_, dt) => {
    elapsed.current += dt
    scanClock.current += dt
    
    
    if (scanClock.current < (elapsed.current < 18 ? 2.5 : 45)) return
    scanClock.current = 0
    scene.updateMatrixWorld(true)

    scene.traverse(object => {
      const mesh = object as THREE.Mesh & { isInstancedMesh?: boolean }
      if (!mesh.isMesh || mesh.isInstancedMesh || !mesh.geometry || hasIgnoredAncestor(mesh) || indexed.current.has(mesh.uuid)) return

      if (!mesh.geometry.boundingBox) mesh.geometry.computeBoundingBox()
      const source = mesh.geometry.boundingBox
      if (!source) return
      localBounds.copy(source).applyMatrix4(mesh.matrixWorld)
      const box = localBounds
      const width = box.max.x - box.min.x
      const depth = box.max.z - box.min.z
      const height = box.max.y - box.min.y
      
      
      if (height < 0.48 || width > 36 || depth > 36 || box.max.y < 0.18 || box.min.y > 1.9) return
      if (box.max.x < -640 || box.min.x > 640 || box.max.z < -540 || box.min.z > 540) return

      indexed.current.add(mesh.uuid)
      const minX = Math.floor(box.min.x / CELL_SIZE), maxX = Math.floor(box.max.x / CELL_SIZE)
      const minZ = Math.floor(box.min.z / CELL_SIZE), maxZ = Math.floor(box.max.z / CELL_SIZE)
      for (let gx = minX; gx <= maxX; gx++) {
        for (let gz = minZ; gz <= maxZ; gz++) {
          const key = cellKey(gx, gz)
          const bucket = staticGrid.get(key) ?? []
          bucket.push(box.clone())
          staticGrid.set(key, bucket)
        }
      }
    })
  })

  return null
}

export function hitsSceneObstacle(x: number, z: number, radius: number, ignoreId?: string, ignorePedestrians = false) {
  const minX = Math.floor((x - radius) / CELL_SIZE), maxX = Math.floor((x + radius) / CELL_SIZE)
  const minZ = Math.floor((z - radius) / CELL_SIZE), maxZ = Math.floor((z + radius) / CELL_SIZE)
  for (let gx = minX; gx <= maxX; gx++) {
    for (let gz = minZ; gz <= maxZ; gz++) {
      for (const box of staticGrid.get(cellKey(gx, gz)) ?? []) {
        const closestX = THREE.MathUtils.clamp(x, box.min.x, box.max.x)
        const closestZ = THREE.MathUtils.clamp(z, box.min.z, box.max.z)
        const dx = x - closestX, dz = z - closestZ
        if (dx * dx + dz * dz < radius * radius) return true
      }
    }
  }
  for (const [id, obstacle] of movingObstacles) {
    if (id === ignoreId) continue
    if (ignorePedestrians && obstacle.pedestrian) continue
    const reach = radius + obstacle.radius
    const dx = x - obstacle.x, dz = z - obstacle.z
    if (dx * dx + dz * dz < reach * reach) return true
  }
  return false
}
