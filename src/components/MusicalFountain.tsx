import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { sound } from './AudioEngine'
import { textures } from './TextureGenerator'

interface MusicalFountainProps {
  night: boolean
  active: boolean
  playerPos: THREE.Vector3
}

export function MusicalFountain({ night, active, playerPos }: MusicalFountainProps) {
  const centralJetRef = useRef<THREE.Mesh>(null)
  const innerRingGroupRef = useRef<THREE.Group>(null)
  const outerRingGroupRef = useRef<THREE.Group>(null)
  const waterPoolRef = useRef<THREE.Mesh>(null)
  const lightRef = useRef<THREE.PointLight>(null)

  const waterRipple = useMemo(() => textures.getWaterRippleTexture(), [])
  const beton = useMemo(() => textures.getBetonBrutTexture(), [])

  // Track player distance for audio attenuation & animate water waves
  useFrame(({ clock }) => {
    const t = clock.elapsedTime
    const dist = Math.hypot(playerPos.x, playerPos.z)
    sound.updateFountainDistance(dist)

    // Dynamic water ripples animation
    waterRipple.offset.x = (t * 0.04) % 1
    waterRipple.offset.y = (t * 0.03) % 1

    // Water jets height choreography
    const intensity = active ? 1.8 : 1.0

    // Central high geyser
    if (centralJetRef.current) {
      const h = (active ? 3.6 : 1.8) + Math.sin(t * 3.5) * (active ? 0.5 : 0.2)
      centralJetRef.current.scale.set(1, h / 2.5, 1)
      centralJetRef.current.position.y = 0.5 + h / 2
    }

    // Inner ring of dancing jets (8 jets)
    if (innerRingGroupRef.current) {
      innerRingGroupRef.current.children.forEach((child, i) => {
        const mesh = child as THREE.Mesh
        const phase = i * (Math.PI / 4)
        const wave = Math.sin(t * (active ? 4 : 2) + phase) * 0.5 + 0.5
        const h = (1.3 + wave * (active ? 2.6 : 1.3)) * intensity
        mesh.scale.set(1, h / 1.6, 1)
        mesh.position.y = 0.4 + h / 2
      })
    }

    // Outer ring of arched jets (16 jets)
    if (outerRingGroupRef.current) {
      outerRingGroupRef.current.children.forEach((child, i) => {
        const mesh = child as THREE.Mesh
        const phase = i * (Math.PI / 8)
        const wave = Math.cos(t * (active ? 4.5 : 2.2) - phase) * 0.5 + 0.5
        const h = (0.9 + wave * (active ? 2.0 : 0.9)) * intensity
        mesh.scale.set(1, h / 1.2, 1)
        mesh.position.y = 0.35 + h / 2
      })
    }

    // Underwater light cycle
    if (lightRef.current && night) {
      const hue = active ? (t * 0.3) % 1 : 0.55 // Cyan or rainbow
      lightRef.current.color.setHSL(hue, 0.95, 0.65)
      lightRef.current.intensity = active ? 85 : 36
    }
  })

  return (
    <group position={[0, 0, 0]}>
      {/* Sunken Stepped Amphitheatre Seating Surrounding the Fountain */}
      {/* Tier 1 (Outer) */}
      <mesh position={[0, 0.08, 0]} receiveShadow>
        <cylinderGeometry args={[15.5, 16.5, 0.2, 48]} />
        <meshStandardMaterial
          color="#b5ae9f"
          bumpMap={beton.bump}
          bumpScale={0.03}
          roughness={0.88}
        />
      </mesh>
      {/* Tier 2 */}
      <mesh position={[0, 0.22, 0]} receiveShadow>
        <cylinderGeometry args={[13.2, 14.2, 0.22, 48]} />
        <meshStandardMaterial
          color="#9c9588"
          bumpMap={beton.bump}
          bumpScale={0.03}
          roughness={0.9}
        />
      </mesh>
      {/* Tier 3 */}
      <mesh position={[0, 0.36, 0]} receiveShadow>
        <cylinderGeometry args={[11.2, 12.0, 0.22, 48]} />
        <meshStandardMaterial
          color="#c3bcac"
          bumpMap={beton.bump}
          bumpScale={0.03}
          roughness={0.86}
        />
      </mesh>

      {/* Main Fountain Coping & Outer Wall */}
      <mesh position={[0, 0.55, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[9.4, 9.8, 0.45, 48]} />
        <meshStandardMaterial
          color="#948d7e"
          bumpMap={beton.bump}
          bumpScale={0.04}
          roughness={0.88}
        />
      </mesh>

      {/* Red Sandstone Inner Trim (Authentic Chandigarh detail) */}
      <mesh position={[0, 0.78, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[9.5, 9.5, 0.08, 48]} />
        <meshStandardMaterial
          color="#a85947"
          roughness={0.7}
          metalness={0.1}
        />
      </mesh>

      {/* Dynamic Glistening Water Pool Surface */}
      <mesh ref={waterPoolRef} position={[0, 0.64, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[9.1, 48]} />
        <meshStandardMaterial
          color={night ? '#0f2b3c' : '#1f6562'}
          bumpMap={waterRipple}
          bumpScale={0.06}
          roughness={0.08}
          metalness={0.8}
          transparent
          opacity={0.92}
        />
      </mesh>

      {/* Central Raised Pedestal */}
      <mesh position={[0, 0.75, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[2.0, 2.4, 0.4, 24]} />
        <meshStandardMaterial
          color="#7f796d"
          bumpMap={beton.bump}
          bumpScale={0.03}
          roughness={0.92}
        />
      </mesh>

      {/* Central High Geyser Water Jet */}
      <mesh ref={centralJetRef} position={[0, 1.8, 0]}>
        <cylinderGeometry args={[0.08, 0.42, 2.5, 16]} />
        <meshStandardMaterial
          color={night ? (active ? '#ffd166' : '#90e0ef') : '#e0fbfc'}
          transparent
          opacity={0.78}
          roughness={0.05}
          metalness={0.2}
          emissive={night ? (active ? '#ffd166' : '#64dfdf') : '#bbf2f6'}
          emissiveIntensity={night ? (active ? 2.4 : 1.2) : 0.25}
        />
      </mesh>

      {/* Foam Ring at Base of Geyser */}
      <mesh position={[0, 0.68, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.3, 1.2, 24]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.65} />
      </mesh>

      {/* Inner Ring of 8 Water Jets */}
      <group ref={innerRingGroupRef}>
        {Array.from({ length: 8 }, (_, i) => {
          const angle = (i * Math.PI * 2) / 8
          const r = 4.2
          return (
            <group key={`inner-${i}`} position={[Math.cos(angle) * r, 0, Math.sin(angle) * r]}>
              <mesh position={[0, 1.0, 0]}>
                <cylinderGeometry args={[0.05, 0.24, 1.6, 12]} />
                <meshStandardMaterial
                  color={night ? (active ? '#ff3366' : '#48cae4') : '#e0fbfc'}
                  transparent
                  opacity={0.72}
                  roughness={0.08}
                  emissive={night ? (active ? '#ff3366' : '#00b4d8') : '#a5f3fc'}
                  emissiveIntensity={night ? (active ? 2.2 : 0.9) : 0.15}
                />
              </mesh>
              {/* Foam base */}
              <mesh position={[0, 0.66, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                <ringGeometry args={[0.1, 0.5, 16]} />
                <meshBasicMaterial color="#ffffff" transparent opacity={0.5} />
              </mesh>
            </group>
          )
        })}
      </group>

      {/* Outer Ring of 16 Water Jets */}
      <group ref={outerRingGroupRef}>
        {Array.from({ length: 16 }, (_, i) => {
          const angle = (i * Math.PI * 2) / 16
          const r = 7.0
          return (
            <group key={`outer-${i}`} position={[Math.cos(angle) * r, 0, Math.sin(angle) * r]}>
              <mesh position={[0, 0.8, 0]}>
                <cylinderGeometry args={[0.04, 0.18, 1.2, 10]} />
                <meshStandardMaterial
                  color={night ? (active ? '#06d6a0' : '#ade8f4') : '#e0fbfc'}
                  transparent
                  opacity={0.68}
                  roughness={0.08}
                  emissive={night ? (active ? '#06d6a0' : '#0096c7') : '#a5f3fc'}
                  emissiveIntensity={night ? (active ? 2.0 : 0.8) : 0.12}
                />
              </mesh>
              <mesh position={[0, 0.66, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                <ringGeometry args={[0.08, 0.35, 12]} />
                <meshBasicMaterial color="#ffffff" transparent opacity={0.45} />
              </mesh>
            </group>
          )
        })}
      </group>

      {/* Underwater Illuminations */}
      <pointLight
        ref={lightRef}
        position={[0, 1.2, 0]}
        color={night ? (active ? '#ff00ff' : '#00f5d4') : '#ffffff'}
        intensity={night ? (active ? 85 : 36) : 0}
        distance={22}
        decay={2}
      />

      {/* Modernist Plaza Sunken Lights on Amphitheatre Step Rims */}
      {Array.from({ length: 12 }, (_, i) => {
        const angle = (i * Math.PI * 2) / 12
        const r = 12.6
        return (
          <group key={`step-light-${i}`} position={[Math.cos(angle) * r, 0.38, Math.sin(angle) * r]}>
            <mesh>
              <boxGeometry args={[0.35, 0.08, 0.14]} />
              <meshStandardMaterial
                color="#fff3d6"
                emissive="#ffbe76"
                emissiveIntensity={night ? 3.5 : 0.1}
              />
            </mesh>
          </group>
        )
      })}
    </group>
  )
}
