import { Suspense, useCallback, useEffect, useMemo, useState, type RefObject } from 'react'
import { useGLTF } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { VEHICLES, type VehicleId, type VehicleSpec } from './vehicleCatalog'

type VehicleModelProps = {
  vehicleId: VehicleId
  wheelRotationDelta: RefObject<number>
}

function buildVehicleModel(scene: THREE.Group, spec: VehicleSpec) {
  const root = new THREE.Group()
  const model = scene.clone(true)
  model.rotation.y += spec.modelRotationY
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

    const isJeepWheel = spec.id === 'jeep-wrangler' && /^(FRW|FLW|RLW|RRW)$/i.test(node.name)
    const isUrusWheel = spec.id === 'lamborghini-urus' && /^wheel\d*$/i.test(node.name)
    if (isJeepWheel || isUrusWheel) {
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
        <LoadedVehicle
          vehicleId={displayedVehicleId}
          onReady={keepDisplayedVehicle}
          wheelRotationDelta={wheelRotationDelta}
        />
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
