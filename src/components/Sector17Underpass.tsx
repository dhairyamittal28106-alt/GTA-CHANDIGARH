import { Suspense, useEffect, useMemo, useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { DynamicCharacter } from './DynamicCharacter'
import { removeMovingObstacle, setMovingObstacle } from './CollisionWorld'
import { useCharacterShopStore, type CharacterConfig } from './CharacterAndShopStore'

interface Sector17UnderpassProps {
  night: boolean
  playerPos?: { current: THREE.Vector3 }
}








function PassageVisitor({ index, baseConfig, playerPos }: { index: number; baseConfig: CharacterConfig; playerPos?: { current: THREE.Vector3 } }) {
  const actor = useRef<THREE.Group>(null)
  const active = useRef(false)
  const [nearby, setNearby] = useState(false)
  useEffect(() => () => removeMovingObstacle(`passage-pedestrian-${index}`), [index])
  const motion = useMemo(() => ({ current: 'walk' as const }), [])
  const config = useMemo<CharacterConfig>(() => ({
    ...baseConfig,
    archetype: index % 3 === 0 ? 'girl' : index % 3 === 1 ? 'man' : 'sardar',
    topColor: ['#d84b3f', '#315e8a', '#e4b33e', '#526f49', '#8c4f75', '#ddd1bd'][index],
    bottomColor: '#292923',
    hasShoppingBags: index % 2 === 0,
    hasDrink: false,
  }), [baseConfig, index])

  useFrame(({ clock }) => {
    const player = playerPos?.current
    if (player) {
      const dx = player.x + 18
      const dz = player.z + 54
      const distanceSq = dx * dx + dz * dz
      if (!active.current && distanceSq < 48 * 48) {
        active.current = true
        setNearby(true)
      } else if (active.current && distanceSq > 58 * 58) {
        active.current = false
        setNearby(false)
        removeMovingObstacle(`passage-pedestrian-${index}`)
        return
      }
    } else if (!active.current) {
      active.current = true
      setNearby(true)
    }

    if (!active.current || !actor.current) return
    const phase = clock.elapsedTime * 0.075 + index * 0.173
    const z = THREE.MathUtils.euclideanModulo(phase * 36 + index * 5.8, 48) - 24
    const side = index % 2 === 0 ? -1 : 1
    const x = side * (2.5 + (index % 3) * 1.25) + Math.sin(phase * 2.1) * 0.25
    actor.current.position.set(x, -3.05, z)
    actor.current.rotation.y = side < 0 ? Math.PI : 0
    setMovingObstacle(`passage-pedestrian-${index}`, x, z, 0.58)
  })

  if (!nearby) return null

  return (
    <group ref={actor} userData={{ sector17CollisionIgnore: true }}>
      <Suspense fallback={null}>
        <DynamicCharacter motion={motion} velocity={1.05} config={config} />
      </Suspense>
    </group>
  )
}

function WallArt({ z, title, color }: { z: number; title: string; color: string }) {
  const texture = useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 384
    canvas.height = 256
    const ctx = canvas.getContext('2d')!
    ctx.fillStyle = '#e8e0d1'
    ctx.fillRect(0, 0, 384, 256)
    ctx.fillStyle = '#b9aa91'
    ctx.fillRect(12, 12, 360, 232)
    ctx.fillStyle = color
    ctx.fillRect(25, 24, 334, 200)
    ctx.fillStyle = '#f5eee2'
    ctx.font = '700 22px Arial, sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText(title, 192, 207)
    const image = new THREE.CanvasTexture(canvas)
    image.colorSpace = THREE.SRGBColorSpace
    return image
  }, [title, color])
  return (
    <mesh position={[8.78, -1.55, z]} rotation={[0, -Math.PI / 2, 0]}>
      <planeGeometry args={[1.45, 1.05]} />
      <meshBasicMaterial map={texture} toneMapped={false} />
    </mesh>
  )
}

export function Sector17Underpass({ night, playerPos }: Sector17UnderpassProps) {
  const baseConfig = useCharacterShopStore(state => state.charConfig)
  const visitors = useMemo(() => Array.from({ length: 6 }, (_, index) => index), [])
  const lights = useMemo(() => Array.from({ length: 8 }, (_, index) => -24 + index * 6.8), [])

  return (
    <group position={[-18, 0, -54]}>
       
      <mesh position={[0, -1.6, 33]} rotation={[-0.24, 0, 0]} receiveShadow>
        <boxGeometry args={[18, 0.22, 13.8]} />
        <meshStandardMaterial color="#cbbda8" roughness={0.84} />
      </mesh>
      <mesh position={[0, -1.6, -33]} rotation={[0.24, 0, 0]} receiveShadow>
        <boxGeometry args={[18, 0.22, 13.8]} />
        <meshStandardMaterial color="#cbbda8" roughness={0.84} />
      </mesh>

       
      <mesh position={[0, -3.28, 0]} receiveShadow>
        <boxGeometry args={[18, 0.28, 54]} />
        <meshStandardMaterial color="#9b8874" roughness={0.42} metalness={0.04} />
      </mesh>
      <mesh position={[0, -3.12, 0]}>
        <planeGeometry args={[17.5, 53.5]} />
        <meshStandardMaterial color="#b39f89" roughness={0.37} metalness={0.05} />
      </mesh>
       
      {Array.from({ length: 18 }, (_, i) => (
        <mesh key={`joint-z-${i}`} position={[0, -3.105, -25.5 + i * 3]}>
          <boxGeometry args={[17.5, 0.008, 0.035]} />
          <meshBasicMaterial color="#826f5e" transparent opacity={0.38} />
        </mesh>
      ))}
      {[-6, -2, 2, 6].map(x => (
        <mesh key={`joint-x-${x}`} position={[x, -3.104, 0]}>
          <boxGeometry args={[0.035, 0.008, 53.5]} />
          <meshBasicMaterial color="#826f5e" transparent opacity={0.34} />
        </mesh>
      ))}

       
      {[-8.9, 8.9].map((x, side) => (
        <group key={x}>
          <mesh position={[x, -0.72, 0]} receiveShadow>
            <boxGeometry args={[0.48, 5.05, 55]} />
            <meshStandardMaterial color={side ? '#b7ad9b' : '#aaa18f'} roughness={0.88} />
          </mesh>
          <mesh position={[x + (side ? -0.26 : 0.26), -3.075, 0]}>
            <boxGeometry args={[0.12, 0.025, 53.5]} />
            <meshStandardMaterial color="#e0b62e" roughness={0.62} />
          </mesh>
           
          {[-24, -12, 0, 12, 24].map(z => (
            <mesh key={`${x}-${z}`} position={[x + (side ? -0.247 : 0.247), -0.7, z]}>
              <boxGeometry args={[0.012, 4.6, 0.045]} />
              <meshStandardMaterial color="#8d8477" roughness={0.92} />
            </mesh>
          ))}
        </group>
      ))}

       
      <mesh position={[0, 2.18, 0]} receiveShadow>
        <boxGeometry args={[18.2, 0.42, 55.5]} />
        <meshStandardMaterial color="#c7bdab" roughness={0.88} />
      </mesh>
      {lights.map((z, i) => (
        <group key={z} position={[0, 1.94, z]}>
          {[-5.8, 5.8].map(x => (
            <mesh key={x} position={[x, 0, 0]}>
              <boxGeometry args={[1.35, 0.065, 0.22]} />
              <meshBasicMaterial color="#fff2d7" toneMapped={false} />
            </mesh>
          ))}
          <pointLight position={[0, -0.05, 0]} color="#ffe2b4" intensity={night ? 13 : 8} distance={11} decay={2} />
          {i % 2 === 0 && <pointLight position={[0, -0.1, 0]} color="#fff4de" intensity={5} distance={22} decay={2} />}
        </group>
      ))}

       
      <WallArt z={-18} title="CHANDIGARH · PUBLIC ART" color="#52796f" />
      <WallArt z={-10} title="ROSE GARDEN" color="#a05a58" />
      <WallArt z={2} title="CITY CENTRE" color="#6d7386" />
      <WallArt z={14} title="SECTOR 17" color="#b78842" />

       
      {[-1, 1].map((side) => (
        <group key={side} position={[side * 7.2, -3.05, side < 0 ? 40 : -40]}>
          <mesh position={[0, 0.42, 0]}>
            <cylinderGeometry args={[0.42, 0.34, 0.84, 20]} />
            <meshStandardMaterial color="#9b563b" roughness={0.85} />
          </mesh>
          <mesh position={[0, 1.05, 0]}>
            <sphereGeometry args={[0.68, 14, 10]} />
            <meshStandardMaterial color="#54734b" roughness={0.92} />
          </mesh>
        </group>
      ))}

       
      {visitors.map(index => <PassageVisitor key={index} index={index} baseConfig={baseConfig} playerPos={playerPos} />)}
    </group>
  )
}
