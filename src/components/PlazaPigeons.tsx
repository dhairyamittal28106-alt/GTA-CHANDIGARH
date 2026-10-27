import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface PlazaPigeonsProps {
  playerPos: THREE.Vector3
}

interface PigeonData {
  baseX: number
  baseZ: number
  curX: number
  curY: number
  curZ: number
  yaw: number
  peckPhase: number
  flying: boolean
  flyTimer: number
}

export function PlazaPigeons({ playerPos }: PlazaPigeonsProps) {
  const meshRef = useRef<THREE.InstancedMesh>(null)
  const dummy = useMemo(() => new THREE.Object3D(), [])

  
  const pigeons = useMemo<PigeonData[]>(() => {
    const list: PigeonData[] = []
    for (let i = 0; i < 24; i++) {
      const angle = (i * Math.PI * 2) / 24 + (Math.random() - 0.5) * 0.4
      const r = 10 + (i % 4) * 2.2 + Math.random() * 3
      const x = Math.cos(angle) * r
      const z = Math.sin(angle) * r
      list.push({
        baseX: x,
        baseZ: z,
        curX: x,
        curY: 0.12,
        curZ: z,
        yaw: Math.random() * Math.PI * 2,
        peckPhase: Math.random() * Math.PI * 2,
        flying: false,
        flyTimer: 0,
      })
    }
    return list
  }, [])

  
  const pigeonGeometry = useMemo(() => {
    const geo = new THREE.ConeGeometry(0.12, 0.32, 6)
    geo.rotateX(Math.PI / 2)
    return geo
  }, [])

  const pigeonMaterial = useMemo(
    () => new THREE.MeshStandardMaterial({ color: '#525b68', roughness: 0.8 }),
    []
  )

  useFrame((_, dt) => {
    if (!meshRef.current) return
    const p = playerPos

    pigeons.forEach((pig, i) => {
      const distToPlayer = Math.hypot(pig.curX - p.x, pig.curZ - p.z)

      
      if (distToPlayer < 3.2 && !pig.flying) {
        pig.flying = true
        pig.flyTimer = 0
        pig.yaw = Math.atan2(pig.curX - p.x, pig.curZ - p.z)
      }

      if (pig.flying) {
        pig.flyTimer += dt
        
        pig.curY = 0.12 + Math.sin(Math.min(Math.PI, pig.flyTimer * 2.5)) * 2.5
        pig.curX += Math.sin(pig.yaw) * 4.5 * dt
        pig.curZ += Math.cos(pig.yaw) * 4.5 * dt

        if (pig.flyTimer > 2.5) {
          pig.flying = false
          pig.curY = 0.12
          pig.baseX = pig.curX
          pig.baseZ = pig.curZ
        }
      } else {
        
        pig.peckPhase += dt * 5
        const bob = Math.abs(Math.sin(pig.peckPhase)) * 0.05
        pig.curY = 0.12 + bob
        
        if (Math.random() < 0.01) {
          pig.yaw += (Math.random() - 0.5) * 1.5
        }
      }

      dummy.position.set(pig.curX, pig.curY, pig.curZ)
      dummy.rotation.set(0, pig.yaw, 0)
      dummy.scale.set(1.2, 1, 1.4)
      dummy.updateMatrix()
      meshRef.current!.setMatrixAt(i, dummy.matrix)
    })

    meshRef.current.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh
      ref={meshRef}
      args={[pigeonGeometry, pigeonMaterial, pigeons.length]}
      castShadow
    />
  )
}
