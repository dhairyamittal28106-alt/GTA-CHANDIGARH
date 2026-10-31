import { Suspense, useCallback, useEffect, useMemo, useState, type RefObject } from 'react'
import { useGLTF } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js'
import { VEHICLES, type VehicleId, type VehicleSpec } from './vehicleCatalog'

type VehicleModelProps = {
  vehicleId: VehicleId
  wheelRotationDelta: RefObject<number>
}

const optimizedVehicleScenes = new WeakMap<THREE.Group, THREE.Group>()

function isWheelRoot(node: THREE.Object3D, vehicleId: VehicleId) {
  return (vehicleId === 'jeep-wrangler' && /^(FRW|FLW|RLW|RRW)$/i.test(node.name))
    || (vehicleId === 'lamborghini-urus' && /^wheel\d*$/i.test(node.name))
}

function getOptimizedVehicleScene(scene: THREE.Group, spec: VehicleSpec) {
  const cached = optimizedVehicleScenes.get(scene)
  if (cached) return cached

  const model = scene.clone(true)
  model.rotation.y += spec.modelRotationY
  model.updateMatrixWorld(true)

  const wheelRoots = new Set<THREE.Object3D>()
  model.traverse(node => {
    if (isWheelRoot(node, spec.id)) {
      node.userData.vehicleWheelSpin = true
      wheelRoots.add(node)
    }
  })

  const buckets = new Map<string, {
    material: THREE.Material
    geometries: THREE.BufferGeometry[]
    sourceMeshes: THREE.Mesh[]
  }>()
  const inverseModelMatrix = model.matrixWorld.clone().invert()

  model.traverse(node => {
    if (!(node instanceof THREE.Mesh) || node.children.length > 0 || node instanceof THREE.SkinnedMesh) return
    if (!node.visible || node.morphTargetInfluences?.length || Object.keys(node.geometry.morphAttributes).length) return
    if (node.geometry.groups.length || node.geometry.drawRange.start !== 0 || node.geometry.drawRange.count !== Infinity) return
    if (node.matrixWorld.determinant() < 0 || node.onBeforeRender !== THREE.Object3D.prototype.onBeforeRender) return
    const attributes = node.geometry.attributes as Record<string, THREE.BufferAttribute | THREE.InterleavedBufferAttribute>
    if (Object.values(attributes).some(attribute => attribute instanceof THREE.InterleavedBufferAttribute)) return
    for (let parent: THREE.Object3D | null = node; parent && parent !== model; parent = parent.parent) {
      if (wheelRoots.has(parent)) return
    }
    if (Array.isArray(node.material) || node.material.transparent) return

    const attributeSignature = Object.entries(attributes)
      .map(([name, attribute]) => `${name}:${attribute.itemSize}:${attribute.normalized}:${attribute.array.constructor.name}`)
      .sort()
      .join(',')
    const key = `${node.material.uuid}|${attributeSignature}|indexed:${Boolean(node.geometry.index)}|order:${node.renderOrder}|layers:${node.layers.mask}|frustum:${node.frustumCulled}`
    let bucket = buckets.get(key)
    if (!bucket) {
      bucket = { material: node.material, geometries: [], sourceMeshes: [] }
      buckets.set(key, bucket)
    }

    const geometry = node.geometry.clone()
    geometry.clearGroups()
    const relativeMatrix = inverseModelMatrix.clone().multiply(node.matrixWorld)
    geometry.applyMatrix4(relativeMatrix)
    bucket.geometries.push(geometry)
    bucket.sourceMeshes.push(node)
  })

  for (const bucket of buckets.values()) {
    if (bucket.geometries.length < 2) {
      bucket.geometries.forEach(geometry => geometry.dispose())
      continue
    }

    let geometry: THREE.BufferGeometry | null = null
    try {
      geometry = mergeGeometries(bucket.geometries, false)
    } catch {
      geometry = null
    }

    if (!geometry) {
      bucket.geometries.forEach(source => source.dispose())
      continue
    }

    geometry.computeBoundingBox()
    geometry.computeBoundingSphere()
    model.add(new THREE.Mesh(geometry, bucket.material))
    bucket.sourceMeshes.forEach(mesh => mesh.removeFromParent())
    bucket.geometries.forEach(source => source.dispose())
  }

  optimizedVehicleScenes.set(scene, model)
  return model
}

function buildVehicleModel(scene: THREE.Group, spec: VehicleSpec) {
  const root = new THREE.Group()
  const model = getOptimizedVehicleScene(scene, spec).clone(true)
  root.add(model)
  model.updateMatrixWorld(true)

  const bounds = new THREE.Box3().setFromObject(model)
  const sourceSize = bounds.getSize(new THREE.Vector3())
  const center = bounds.getCenter(new THREE.Vector3())
  const scale = new THREE.Vector3(
    spec.width / Math.max(sourceSize.x, 0.001),
    spec.height / Math.max(sourceSize.y, 0.001),
    spec.length / Math.max(sourceSize.z, 0.001),
  )

  model.position.set(-center.x, -bounds.min.y, -center.z)
  root.scale.copy(scale)

  const wheels: THREE.Object3D[] = []
  model.traverse(node => {
    if (node instanceof THREE.Mesh) {
      node.castShadow = true
      node.receiveShadow = true
    }

    if (node.userData.vehicleWheelSpin) {
      node.userData.vehicleWheelSpin = true
      wheels.push(node)
    }
  })

  return { root, wheels }
}

function WheelSpin({ wheels, rotationDelta }: { wheels: THREE.Object3D[]; rotationDelta: RefObject<number> }) {
  useFrame(() => {
    // oxlint-disable-next-line react/immutability -- Three.js transforms are advanced imperatively in the R3F frame loop.
    for (const wheel of wheels) wheel.rotation.x += rotationDelta.current
  })

  return null
}

function LoadedVehicle({
  vehicleId,
  onReady,
  wheelRotationDelta,
}: {
  vehicleId: VehicleId
  onReady: (id: VehicleId) => void
  wheelRotationDelta: RefObject<number>
}) {
  const spec = VEHICLES[vehicleId]
  const { scene } = useGLTF(spec.modelPath)
  const vehicle = useMemo(() => buildVehicleModel(scene, spec), [scene, spec])

  useEffect(() => {
    onReady(vehicleId)
  }, [onReady, vehicleId])

  return (
    <group>
      <primitive object={vehicle.root} dispose={null} />
      <WheelSpin wheels={vehicle.wheels} rotationDelta={wheelRotationDelta} />
    </group>
  )
}

export function VehicleModel({ vehicleId, wheelRotationDelta }: VehicleModelProps) {
  const [displayedVehicleId, setDisplayedVehicleId] = useState(vehicleId)
  const keepDisplayedVehicle = useCallback((id: VehicleId) => setDisplayedVehicleId(id), [])

  return (
    <Suspense
      fallback={(
        displayedVehicleId === vehicleId ? null : (
          <LoadedVehicle
            vehicleId={displayedVehicleId}
            onReady={keepDisplayedVehicle}
            wheelRotationDelta={wheelRotationDelta}
          />
        )
      )}
    >
      <LoadedVehicle
        vehicleId={vehicleId}
        onReady={keepDisplayedVehicle}
        wheelRotationDelta={wheelRotationDelta}
      />
    </Suspense>
  )
}
