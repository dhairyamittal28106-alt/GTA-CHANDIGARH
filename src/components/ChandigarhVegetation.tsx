import { useMemo } from 'react'
import * as THREE from 'three'

interface ChandigarhVegetationProps {
  night: boolean
}

export function ChandigarhVegetation({ night }: ChandigarhVegetationProps) {
  // Street sign textures: "SECTOR 17-C", "PEDESTRIAN PLAZA", "CHANDIGARH POLICE"
  const signSector17 = useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 512
    canvas.height = 160
    const ctx = canvas.getContext('2d')!
    ctx.fillStyle = '#023e8a'
    ctx.fillRect(0, 0, 512, 160)
    ctx.strokeStyle = '#ffffff'
    ctx.lineWidth = 8
    ctx.strokeRect(10, 10, 492, 140)

    ctx.fillStyle = '#ffffff'
    ctx.font = 'bold 50px "DM Mono", sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText('SECTOR 17 · CITY CENTRE', 256, 70)

    ctx.font = 'bold 26px "DM Mono", monospace'
    ctx.fillStyle = '#ffd166'
    ctx.fillText('NO VEHICLES BEYOND THIS POINT', 256, 120)

    const tex = new THREE.CanvasTexture(canvas)
    tex.colorSpace = THREE.SRGBColorSpace
    return tex
  }, [])

  const policeSign = useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 512
    canvas.height = 256
    const ctx = canvas.getContext('2d')!
    ctx.fillStyle = '#001233'
    ctx.fillRect(0, 0, 512, 256)
    ctx.strokeStyle = '#ff0054'
    ctx.lineWidth = 10
    ctx.strokeRect(12, 12, 488, 232)

    ctx.fillStyle = '#ff0054'
    ctx.font = '900 44px "DM Mono", sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText('CHANDIGARH POLICE', 256, 85)

    ctx.fillStyle = '#ffffff'
    ctx.font = 'bold 30px "DM Mono", monospace'
    ctx.fillText('BEAT BOX · SECTOR 17 PLAZA', 256, 145)

    ctx.font = '22px "DM Mono", monospace'
    ctx.fillStyle = '#90e0ef'
    ctx.fillText('"WE CARE FOR YOU" · DIAL 112', 256, 195)

    const tex = new THREE.CanvasTexture(canvas)
    tex.colorSpace = THREE.SRGBColorSpace
    return tex
  }, [])

  // Tree locations around the plaza perimeter
  const trees = useMemo(() => {
    const list: Array<{ x: number; z: number; type: 'gulmohar' | 'amaltas' | 'green' | 'jacaranda' }> = []
    // North avenue
    for (let x = -48; x <= 48; x += 16) {
      list.push({ x, z: -46, type: x % 32 === 0 ? 'gulmohar' : 'amaltas' })
    }
    // South avenue
    for (let x = -48; x <= 48; x += 16) {
      list.push({ x, z: 46, type: x % 32 === 0 ? 'amaltas' : 'gulmohar' })
    }
    // East avenue
    for (let z = -32; z <= 32; z += 16) {
      list.push({ x: 50, z, type: z % 32 === 0 ? 'jacaranda' : 'green' })
    }
    // West avenue
    for (let z = -32; z <= 32; z += 16) {
      list.push({ x: -50, z, type: z % 32 === 0 ? 'gulmohar' : 'jacaranda' })
    }
    return list
  }, [])

  return (
    <group>
      {/* Lush Green Trees (Neem, Peepal, Sheesham, Ashoka & Banyan) */}
      {trees.map((t, i) => {
        // Natural harmonious shades of lush green foliage
        const greenFoliageShades = [
          '#2d6a4f', // Deep lush emerald green (Neem)
          '#386641', // Vibrant forest green (Peepal)
          '#2d5a27', // Rich botanical green (Sheesham)
          '#40916c', // Fresh foliage green (Ashoka)
          '#1e4620', // Deep grove green (Banyan)
        ]
        const foliageColor = greenFoliageShades[i % greenFoliageShades.length]

        return (
          <group key={`tree-${i}`} position={[t.x, 0, t.z]}>
            {/* Concrete Planter Curb */}
            <mesh position={[0, 0.2, 0]} castShadow receiveShadow>
              <cylinderGeometry args={[1.8, 2.0, 0.4, 16]} />
              <meshStandardMaterial color="#b3ada1" roughness={0.9} />
            </mesh>
            <mesh position={[0, 0.25, 0]}>
              <cylinderGeometry args={[1.65, 1.65, 0.35, 16]} />
              <meshStandardMaterial color="#4a3728" roughness={0.95} />
            </mesh>

            {/* Tree Trunk */}
            <mesh position={[0, 2.2, 0]} castShadow>
              <cylinderGeometry args={[0.22, 0.38, 4.0, 10]} />
              <meshStandardMaterial color="#54402e" roughness={0.9} />
            </mesh>

            {/* Tree Canopy Clusters - Rich Green Foliage */}
            <group position={[0, 4.4, 0]}>
              <mesh position={[0, 0.6, 0]} scale={[1.8, 1.2, 1.8]} castShadow>
                <dodecahedronGeometry args={[1.5, 1]} />
                <meshStandardMaterial color={foliageColor} roughness={0.88} />
              </mesh>
              <mesh position={[-0.8, -0.1, 0.7]} scale={[1.4, 1.0, 1.3]} castShadow>
                <dodecahedronGeometry args={[1.3, 1]} />
                <meshStandardMaterial color={foliageColor} roughness={0.9} />
              </mesh>
              <mesh position={[0.9, 0.2, -0.6]} scale={[1.3, 1.1, 1.4]} castShadow>
                <dodecahedronGeometry args={[1.3, 1]} />
                <meshStandardMaterial color={foliageColor} roughness={0.9} />
              </mesh>
              {/* Secondary green leaves underneath */}
              <mesh position={[0, -0.5, 0]} scale={[1.6, 0.6, 1.6]} castShadow>
                <dodecahedronGeometry args={[1.4, 1]} />
                <meshStandardMaterial color="#1b4332" roughness={0.9} />
              </mesh>
            </group>
          </group>
        )
      })}

      {/* Bougainvillea Concrete Planters along Central Pathway */}
      {[-24, -8, 8, 24].flatMap(x =>
        [-16, 16].map(z => (
          <group key={`flowerbed-${x}-${z}`} position={[x, 0, z]}>
            <mesh position={[0, 0.35, 0]} castShadow receiveShadow>
              <boxGeometry args={[3.2, 0.7, 1.4]} />
              <meshStandardMaterial color="#8e897d" roughness={0.9} />
            </mesh>
            {/* Rich Magenta Bougainvillea Blossoms */}
            {[-0.9, 0, 0.9].map((bx, bi) => (
              <mesh key={bi} position={[bx, 0.9, 0]} scale={[0.7, 0.6, 0.7]} castShadow>
                <sphereGeometry args={[0.5, 12, 10]} />
                <meshStandardMaterial
                  color={bi % 2 === 0 ? '#d81159' : '#ff477e'}
                  roughness={0.75}
                />
              </mesh>
            ))}
          </group>
        ))
      )}

      {/* Official Sector 17 Plaza Directional Signboard */}
      <group position={[0, 0, -38]}>
        <mesh position={[-1.8, 1.8, 0]} castShadow>
          <cylinderGeometry args={[0.07, 0.07, 3.6, 8]} />
          <meshStandardMaterial color="#495057" metalness={0.7} />
        </mesh>
        <mesh position={[1.8, 1.8, 0]} castShadow>
          <cylinderGeometry args={[0.07, 0.07, 3.6, 8]} />
          <meshStandardMaterial color="#495057" metalness={0.7} />
        </mesh>
        <mesh position={[0, 2.7, 0]}>
          <planeGeometry args={[4.4, 1.4]} />
          <meshStandardMaterial
            map={signSector17}
            emissive="#023e8a"
            emissiveIntensity={night ? 0.8 : 0.1}
          />
        </mesh>
      </group>

      {/* Chandigarh Police Beat Box Booth */}
      <group position={[-16, 0, -22]}>
        {/* Booth Cabin */}
        <mesh position={[0, 1.6, 0]} castShadow receiveShadow>
          <boxGeometry args={[2.8, 3.2, 2.8]} />
          <meshStandardMaterial color="#1a2f4c" roughness={0.6} />
        </mesh>
        {/* Roof overhang */}
        <mesh position={[0, 3.3, 0]} castShadow>
          <boxGeometry args={[3.4, 0.25, 3.4]} />
          <meshStandardMaterial color="#d90429" />
        </mesh>
        {/* Glass Windows */}
        <mesh position={[0, 1.9, 1.42]}>
          <planeGeometry args={[2.2, 1.2]} />
          <meshStandardMaterial color="#89c2d9" metalness={0.8} roughness={0.1} transparent opacity={0.75} />
        </mesh>
        {/* Police Crest Sign */}
        <mesh position={[0, 2.8, 1.42]}>
          <planeGeometry args={[2.4, 0.6]} />
          <meshStandardMaterial
            map={policeSign}
            emissive="#ff0054"
            emissiveIntensity={night ? 1.5 : 0.2}
          />
        </mesh>
        {/* Blue & Red Siren Light */}
        <group position={[0, 3.6, 0]}>
          <mesh position={[-0.3, 0, 0]}>
            <cylinderGeometry args={[0.1, 0.12, 0.22, 10]} />
            <meshStandardMaterial color="#d90429" emissive="#d90429" emissiveIntensity={night ? 3 : 0.5} />
          </mesh>
          <mesh position={[0.3, 0, 0]}>
            <cylinderGeometry args={[0.1, 0.12, 0.22, 10]} />
            <meshStandardMaterial color="#0077b6" emissive="#0077b6" emissiveIntensity={night ? 3 : 0.5} />
          </mesh>
          {night && (
            <pointLight position={[0, 0.4, 0]} color="#0077b6" intensity={15} distance={8} />
          )}
        </group>
      </group>
    </group>
  )
}
