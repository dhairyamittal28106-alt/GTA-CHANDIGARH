import { useMemo } from 'react'
import * as THREE from 'three'
import { textures } from './TextureGenerator'

interface ColonnadeShopsProps {
  night: boolean
}

export function ColonnadeShops({ night }: ColonnadeShopsProps) {
  const beton = useMemo(() => textures.getBetonBrutTexture(), [])
  const brick = useMemo(() => textures.getChandigarhBrickTexture(), [])

  // Shop Sign Textures
  const ichSign = useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 512
    canvas.height = 128
    const ctx = canvas.getContext('2d')!
    ctx.fillStyle = '#6f1d1b'
    ctx.fillRect(0, 0, 512, 128)
    ctx.strokeStyle = '#ffe6a7'
    ctx.lineWidth = 6
    ctx.strokeRect(8, 8, 496, 112)

    ctx.fillStyle = '#ffffff'
    ctx.font = 'bold 38px "DM Mono", sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText('INDIAN COFFEE HOUSE', 256, 56)

    ctx.font = '20px "DM Mono", monospace'
    ctx.fillStyle = '#ffe6a7'
    ctx.fillText('ESTD 1957 · SECTOR 17 PLAZA', 256, 96)

    const tex = new THREE.CanvasTexture(canvas)
    tex.colorSpace = THREE.SRGBColorSpace
    return tex
  }, [])

  const softySign = useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 512
    canvas.height = 128
    const ctx = canvas.getContext('2d')!
    ctx.fillStyle = '#9d0208'
    ctx.fillRect(0, 0, 512, 128)
    ctx.strokeStyle = '#ffd166'
    ctx.lineWidth = 6
    ctx.strokeRect(8, 8, 496, 112)

    ctx.fillStyle = '#ffd166'
    ctx.font = '900 44px "DM Mono", Impact, sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText('🍦 SOFTY CORNER 🍦', 256, 58)

    ctx.font = 'bold 20px "DM Mono", monospace'
    ctx.fillStyle = '#ffffff'
    ctx.fillText('THE ICONIC SECTOR 17 SWIRL', 256, 98)

    const tex = new THREE.CanvasTexture(canvas)
    tex.colorSpace = THREE.SRGBColorSpace
    return tex
  }, [])

  const sindhiSign = useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 512
    canvas.height = 128
    const ctx = canvas.getContext('2d')!
    ctx.fillStyle = '#143601'
    ctx.fillRect(0, 0, 512, 128)
    ctx.strokeStyle = '#fefae0'
    ctx.lineWidth = 6
    ctx.strokeRect(8, 8, 496, 112)

    ctx.fillStyle = '#fefae0'
    ctx.font = 'bold 40px "DM Mono", sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText('SINDHI SWEETS', 256, 56)

    ctx.font = '20px "DM Mono", monospace'
    ctx.fillStyle = '#d4a373'
    ctx.fillText('FAMOUS CHOLE BHATURE & MITHAI', 256, 96)

    const tex = new THREE.CanvasTexture(canvas)
    tex.colorSpace = THREE.SRGBColorSpace
    return tex
  }, [])

  const hotMillionsSign = useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 512
    canvas.height = 128
    const ctx = canvas.getContext('2d')!
    ctx.fillStyle = '#e63946'
    ctx.fillRect(0, 0, 512, 128)
    ctx.strokeStyle = '#f1faee'
    ctx.lineWidth = 6
    ctx.strokeRect(8, 8, 496, 112)

    ctx.fillStyle = '#f1faee'
    ctx.font = '900 42px "DM Mono", Impact, sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText('HOT MILLIONS', 256, 58)

    ctx.font = '20px "DM Mono", monospace'
    ctx.fillStyle = '#a8dadc'
    ctx.fillText('CHANDIGARH LEGEND SINCE 1979', 256, 98)

    const tex = new THREE.CanvasTexture(canvas)
    tex.colorSpace = THREE.SRGBColorSpace
    return tex
  }, [])

  const phulkariSign = useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 512
    canvas.height = 128
    const ctx = canvas.getContext('2d')!
    ctx.fillStyle = '#7209b7'
    ctx.fillRect(0, 0, 512, 128)
    ctx.strokeStyle = '#f72585'
    ctx.lineWidth = 6
    ctx.strokeRect(8, 8, 496, 112)

    ctx.fillStyle = '#ffffff'
    ctx.font = 'bold 36px "DM Mono", sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText('PHULKARI · PUNJAB EMPORIUM', 256, 58)

    ctx.font = '18px "DM Mono", monospace'
    ctx.fillStyle = '#4cc9f0'
    ctx.fillText('HANDLOOM · DUPATTAS · CRAFTS', 256, 98)

    const tex = new THREE.CanvasTexture(canvas)
    tex.colorSpace = THREE.SRGBColorSpace
    return tex
  }, [])

  // Planet Fashion Signboard (Louis Philippe / Van Heusen / Allen Solly - from video 01:30)
  const planetFashionSign = useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 512
    canvas.height = 140
    const ctx = canvas.getContext('2d')!
    ctx.fillStyle = '#b91c1c'
    ctx.fillRect(0, 0, 512, 140)

    ctx.strokeStyle = '#ffffff'
    ctx.lineWidth = 6
    ctx.strokeRect(6, 6, 500, 128)

    ctx.fillStyle = '#ffffff'
    ctx.font = '900 48px "Arial Black", Impact, sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText('PLANET FASHION', 256, 62)

    ctx.font = 'bold 16px "DM Mono", monospace'
    ctx.fillStyle = '#fde047'
    ctx.fillText('LOUIS PHILIPPE · VAN HEUSEN · ALLEN SOLLY', 256, 105)

    const tex = new THREE.CanvasTexture(canvas)
    tex.colorSpace = THREE.SRGBColorSpace
    return tex
  }, [])

  // Kapsons Mega Flagship Signboard (from video 01:26 & 01:32)
  const kapsonsSign = useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 512
    canvas.height = 140
    const ctx = canvas.getContext('2d')!
    ctx.fillStyle = '#0a192f'
    ctx.fillRect(0, 0, 512, 140)

    ctx.strokeStyle = '#f59e0b'
    ctx.lineWidth = 6
    ctx.strokeRect(6, 6, 500, 128)

    ctx.fillStyle = '#f59e0b'
    ctx.font = '900 52px "Arial Black", Impact, sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText('KAPSONS', 256, 64)

    ctx.font = 'bold 18px "DM Mono", monospace'
    ctx.fillStyle = '#ffffff'
    ctx.fillText('GLOBAL FASHION · ESTD SECTOR 17', 256, 105)

    const tex = new THREE.CanvasTexture(canvas)
    tex.colorSpace = THREE.SRGBColorSpace
    return tex
  }, [])

  // United Colors of Benetton Signboard (from video 01:34)
  const benettonSign = useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 512
    canvas.height = 140
    const ctx = canvas.getContext('2d')!
    ctx.fillStyle = '#15803d'
    ctx.fillRect(0, 0, 512, 140)

    ctx.fillStyle = '#ffffff'
    ctx.font = 'bold 36px -apple-system, "Arial Black", sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText('UNITED COLORS', 256, 58)
    ctx.fillText('OF BENETTON.', 256, 102)

    const tex = new THREE.CanvasTexture(canvas)
    tex.colorSpace = THREE.SRGBColorSpace
    return tex
  }, [])

  // Clock Tower Texture
  const clockFaceTexture = useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 256
    canvas.height = 256
    const ctx = canvas.getContext('2d')!
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, 256, 256)
    ctx.strokeStyle = '#111827'
    ctx.lineWidth = 8
    ctx.beginPath()
    ctx.arc(128, 128, 110, 0, Math.PI * 2)
    ctx.stroke()

    // Hour ticks
    for (let i = 0; i < 12; i++) {
      const angle = (i * Math.PI) / 6
      const x1 = 128 + Math.sin(angle) * 90
      const y1 = 128 - Math.cos(angle) * 90
      const x2 = 128 + Math.sin(angle) * 105
      const y2 = 128 - Math.cos(angle) * 105
      ctx.lineWidth = i % 3 === 0 ? 6 : 3
      ctx.beginPath()
      ctx.moveTo(x1, y1)
      ctx.lineTo(x2, y2)
      ctx.stroke()
    }

    // Hands showing 6:30 PM (Evening in Sector 17)
    ctx.lineWidth = 6
    ctx.beginPath()
    ctx.moveTo(128, 128)
    ctx.lineTo(128, 180) // Hour hand down
    ctx.stroke()

    ctx.lineWidth = 4
    ctx.beginPath()
    ctx.moveTo(128, 128)
    ctx.lineTo(128, 50) // Minute hand up
    ctx.stroke()

    const tex = new THREE.CanvasTexture(canvas)
    tex.colorSpace = THREE.SRGBColorSpace
    return tex
  }, [])

  return (
    <group>
      {/* ================================================================= */}
      {/* SOUTH COLONNADE: Indian Coffee House & Sindhi Sweets */}
      {/* ================================================================= */}
      <group position={[-20, 0, 32]}>
        {/* Shaded Covered Arcade Roof */}
        <mesh position={[0, 4.4, 0]} castShadow receiveShadow>
          <boxGeometry args={[36, 0.45, 8]} />
          <meshStandardMaterial color="#beb7a7" roughness={0.9} />
        </mesh>

        {/* Massive Concrete Pillars (Pilotis) Facing the Plaza */}
        {[-16, -10, -4, 2, 8, 14].map((x, i) => (
          <group key={`south-pillar-${i}`} position={[x, 2.2, -3.6]}>
            <mesh castShadow receiveShadow>
              <boxGeometry args={[0.7, 4.4, 0.7]} />
              <meshStandardMaterial color="#a9a292" roughness={0.94} />
            </mesh>
            {/* Corbusier Capital Detail */}
            <mesh position={[0, 2.0, 0]}>
              <boxGeometry args={[0.9, 0.3, 0.9]} />
              <meshStandardMaterial color="#8b8577" />
            </mesh>
          </group>
        ))}

        {/* Indian Coffee House Stall & Outdoor Cane Chairs */}
        <group position={[-10, 0, 3.2]}>
          {/* Shop Front Wall */}
          <mesh position={[0, 2.2, 0]}>
            <boxGeometry args={[14, 4.4, 0.3]} />
            <meshStandardMaterial color="#ddd6c7" roughness={0.9} />
          </mesh>
          {/* Signboard */}
          <mesh position={[0, 3.6, -0.2]}>
            <planeGeometry args={[7.2, 1.3]} />
            <meshStandardMaterial
              map={ichSign}
              emissive="#ffe6a7"
              emissiveIntensity={night ? 1.6 : 0.15}
            />
          </mesh>
          {/* Service counter */}
          <mesh position={[0, 1.0, -1.8]} castShadow>
            <boxGeometry args={[5, 1.1, 1.2]} />
            <meshStandardMaterial color="#5e503f" />
          </mesh>
          {/* Coffee cups & urns */}
          <mesh position={[-1.2, 1.8, -1.8]}>
            <cylinderGeometry args={[0.2, 0.25, 0.5, 12]} />
            <meshStandardMaterial color="#e0e1dd" metalness={0.9} roughness={0.1} />
          </mesh>
          <mesh position={[-0.4, 1.65, -1.8]}>
            <cylinderGeometry args={[0.08, 0.06, 0.16, 8]} />
            <meshStandardMaterial color="#ffffff" />
          </mesh>
          {/* Outdoor Cafe Table & Cane Chairs */}
          <group position={[2.5, 0, -2.2]}>
            <mesh position={[0, 0.72, 0]} castShadow>
              <cylinderGeometry args={[0.7, 0.7, 0.06, 16]} />
              <meshStandardMaterial color="#495057" />
            </mesh>
            <mesh position={[0, 0.36, 0]}>
              <cylinderGeometry args={[0.06, 0.06, 0.72, 8]} />
              <meshStandardMaterial color="#212529" />
            </mesh>
            {[-0.9, 0.9].map((cx, idx) => (
              <mesh key={idx} position={[cx, 0.45, 0]} castShadow>
                <boxGeometry args={[0.45, 0.06, 0.45]} />
                <meshStandardMaterial color="#c68b59" />
              </mesh>
            ))}
          </group>
        </group>

        {/* Sindhi Sweets */}
        <group position={[8, 0, 3.2]}>
          <mesh position={[0, 2.2, 0]}>
            <boxGeometry args={[14, 4.4, 0.3]} />
            <meshStandardMaterial color="#e5ded0" roughness={0.9} />
          </mesh>
          {/* Signboard */}
          <mesh position={[0, 3.6, -0.2]}>
            <planeGeometry args={[7.2, 1.3]} />
            <meshStandardMaterial
              map={sindhiSign}
              emissive="#fefae0"
              emissiveIntensity={night ? 1.6 : 0.15}
            />
          </mesh>
          {/* Glass display showcase */}
          <mesh position={[0, 1.0, -1.6]} castShadow>
            <boxGeometry args={[6, 1.1, 1.4]} />
            <meshStandardMaterial color="#222" metalness={0.4} roughness={0.2} />
          </mesh>
          <mesh position={[0, 1.05, -1.6]}>
            <boxGeometry args={[5.8, 1.0, 1.3]} />
            <meshStandardMaterial color="#e9d8a6" transparent opacity={0.7} />
          </mesh>
        </group>
      </group>

      {/* ================================================================= */}
      {/* EAST COLONNADE: Softy Corner & Hot Millions */}
      {/* ================================================================= */}
      <group position={[28, 0, 24]} rotation={[0, -Math.PI / 2, 0]}>
        {/* Covered Arcade Roof */}
        <mesh position={[0, 4.4, 0]} castShadow receiveShadow>
          <boxGeometry args={[30, 0.45, 8]} />
          <meshStandardMaterial color="#beb7a7" roughness={0.9} />
        </mesh>

        {/* Concrete Pillars */}
        {[-12, -6, 0, 6, 12].map((x, i) => (
          <group key={`east-pillar-${i}`} position={[x, 2.2, -3.6]}>
            <mesh castShadow receiveShadow>
              <boxGeometry args={[0.7, 4.4, 0.7]} />
              <meshStandardMaterial color="#a9a292" roughness={0.94} />
            </mesh>
          </group>
        ))}

        {/* Softy Corner Kiosk */}
        <group position={[-6, 0, 3.2]}>
          <mesh position={[0, 2.2, 0]}>
            <boxGeometry args={[11, 4.4, 0.3]} />
            <meshStandardMaterial color="#f0ece1" roughness={0.9} />
          </mesh>
          {/* Signboard */}
          <mesh position={[0, 3.6, -0.2]}>
            <planeGeometry args={[6.8, 1.25]} />
            <meshStandardMaterial
              map={softySign}
              emissive="#ffd166"
              emissiveIntensity={night ? 2.0 : 0.2}
            />
          </mesh>
          {/* Giant Stylized 3D Ice Cream Cone on Top! */}
          <group position={[0, 5.2, -0.5]}>
            {/* Waffle Cone */}
            <mesh rotation={[Math.PI, 0, 0]} castShadow>
              <coneGeometry args={[0.55, 1.4, 12]} />
              <meshStandardMaterial color="#d4a373" roughness={0.8} />
            </mesh>
            {/* Vanilla & Chocolate Swirl */}
            <mesh position={[0, 0.8, 0]} castShadow>
              <sphereGeometry args={[0.65, 16, 12]} />
              <meshStandardMaterial color="#fdf0d5" roughness={0.4} />
            </mesh>
            <mesh position={[0, 1.2, 0]} castShadow>
              <sphereGeometry args={[0.45, 14, 10]} />
              <meshStandardMaterial color="#7f4f24" roughness={0.4} />
            </mesh>
            <mesh position={[0, 1.55, 0]}>
              <sphereGeometry args={[0.22, 10, 8]} />
              <meshStandardMaterial color="#d90429" emissive="#d90429" emissiveIntensity={0.5} />
            </mesh>
          </group>

          {/* Service counter */}
          <mesh position={[0, 1.0, -1.6]} castShadow>
            <boxGeometry args={[4.8, 1.1, 1.2]} />
            <meshStandardMaterial color="#d90429" />
          </mesh>
        </group>

        {/* Hot Millions Fast Food */}
        <group position={[6, 0, 3.2]}>
          <mesh position={[0, 2.2, 0]}>
            <boxGeometry args={[11, 4.4, 0.3]} />
            <meshStandardMaterial color="#ede8dd" roughness={0.9} />
          </mesh>
          {/* Signboard */}
          <mesh position={[0, 3.6, -0.2]}>
            <planeGeometry args={[6.8, 1.25]} />
            <meshStandardMaterial
              map={hotMillionsSign}
              emissive="#f1faee"
              emissiveIntensity={night ? 1.8 : 0.2}
            />
          </mesh>
          {/* Glass Doors */}
          <mesh position={[0, 1.4, -0.2]}>
            <boxGeometry args={[4, 2.6, 0.1]} />
            <meshStandardMaterial color="#1d3557" metalness={0.7} roughness={0.2} />
          </mesh>
        </group>
      </group>

      {/* ================================================================= */}
      {/* WEST ARCADE: Phulkari Punjab Emporium */}
      {/* ================================================================= */}
      <group position={[-28, 0, -8]} rotation={[0, Math.PI / 2, 0]}>
        <mesh position={[0, 4.4, 0]} castShadow receiveShadow>
          <boxGeometry args={[18, 0.45, 8]} />
          <meshStandardMaterial color="#beb7a7" roughness={0.9} />
        </mesh>
        {[-7, 0, 7].map((x, i) => (
          <mesh key={i} position={[x, 2.2, -3.6]} castShadow receiveShadow>
            <boxGeometry args={[0.7, 4.4, 0.7]} />
            <meshStandardMaterial color="#a9a292" roughness={0.94} />
          </mesh>
        ))}
        <group position={[0, 0, 3.2]}>
          <mesh position={[0, 2.2, 0]}>
            <boxGeometry args={[15, 4.4, 0.3]} />
            <meshStandardMaterial color="#f0ece1" roughness={0.9} />
          </mesh>
          <mesh position={[0, 3.6, -0.2]}>
            <planeGeometry args={[8.5, 1.3]} />
            <meshStandardMaterial
              map={phulkariSign}
              emissive="#f72585"
              emissiveIntensity={night ? 1.8 : 0.2}
            />
          </mesh>
          {/* Colorful Dupattas in Display */}
          {[-3, -1, 1, 3].map((dx, di) => (
            <mesh key={di} position={[dx, 1.5, -0.15]}>
              <planeGeometry args={[1.5, 2.2]} />
              <meshStandardMaterial
                color={['#f72585', '#4cc9f0', '#7209b7', '#ffb703'][di]}
                roughness={0.7}
              />
            </mesh>
          ))}
        </group>
      </group>

      {/* ================================================================= */}
      {/* BRUTALIST CONCRETE CLOCK TOWER */}
      {/* ================================================================= */}
      <group position={[-38, 0, 5]}>
        {/* Stepped Base */}
        <mesh position={[0, 0.3, 0]} castShadow receiveShadow>
          <boxGeometry args={[4.2, 0.6, 4.2]} />
          <meshStandardMaterial color="#8e897d" roughness={0.94} />
        </mesh>
        <mesh position={[0, 0.8, 0]} castShadow receiveShadow>
          <boxGeometry args={[3.4, 0.6, 3.4]} />
          <meshStandardMaterial color="#a8a294" roughness={0.92} />
        </mesh>

        {/* Tall Brutalist Obelisk Shaft */}
        <mesh position={[0, 8.5, 0]} castShadow receiveShadow>
          <boxGeometry args={[2.4, 15, 2.4]} />
          <meshStandardMaterial
            color="#b5afa3"
            map={beton.diffuse}
            bumpMap={beton.bump}
            bumpScale={0.06}
            roughness={0.92}
          />
        </mesh>

        {/* Deep Horizontal & Vertical Architectural Shadow Slots (Corbusier Style) */}
        {[3, 6, 9, 12].map(y => (
          <mesh key={y} position={[0, y, 0]}>
            <boxGeometry args={[2.55, 0.2, 2.55]} />
            <meshStandardMaterial color="#5e594f" roughness={0.95} />
          </mesh>
        ))}

        {/* Clock Faces on all 4 Sides at Top */}
        {[
          { pos: [0, 14.5, 1.25], rot: [0, 0, 0] },
          { pos: [0, 14.5, -1.25], rot: [0, Math.PI, 0] },
          { pos: [1.25, 14.5, 0], rot: [0, Math.PI / 2, 0] },
          { pos: [-1.25, 14.5, 0], rot: [0, -Math.PI / 2, 0] },
        ].map((face, fi) => (
          <mesh key={fi} position={face.pos as [number, number, number]} rotation={face.rot as [number, number, number]}>
            <planeGeometry args={[1.8, 1.8]} />
            <meshStandardMaterial
              map={clockFaceTexture}
              emissive="#fff8e7"
              emissiveIntensity={night ? 2.2 : 0.2}
            />
          </mesh>
        ))}

        {/* Pyramid Peak */}
        <mesh position={[0, 16.7, 0]} rotation={[0, Math.PI / 4, 0]} castShadow>
          <coneGeometry args={[1.7, 1.6, 4]} />
          <meshStandardMaterial
            color="#9c3826"
            map={brick.diffuse}
            bumpMap={brick.bump}
            bumpScale={0.08}
            roughness={0.85}
          />
        </mesh>

      </group>

      {/* ================================================================= */}
      {/* NORTH-EAST PROMENADE: Kapsons, Planet Fashion & Benetton          */}
      {/* (Exact replica of showrooms shown in video 01:22 - 01:37)         */}
      {/* ================================================================= */}
      <group position={[18, 0, -18]}>
        {/* Covered 2-Story Arcade Structure (32m x 5m x 8m) */}
        <mesh position={[0, 4.2, 0]} castShadow receiveShadow>
          <boxGeometry args={[32, 8.4, 6]} />
          <meshStandardMaterial
            map={beton.diffuse}
            bumpMap={beton.bump}
            color="#d5d8dc"
            roughness={0.9}
          />
        </mesh>

        {/* Shaded Colonnade Columns with White Cylindrical Pillars */}
        {[-14, -7, 0, 7, 14].map((px, idx) => (
          <group key={idx} position={[px, 2.2, 3.2]}>
            <mesh castShadow receiveShadow>
              <cylinderGeometry args={[0.36, 0.4, 4.4, 20]} />
              <meshStandardMaterial color="#f8fafc" roughness={0.4} />
            </mesh>
            {/* Square pillar capital */}
            <mesh position={[0, 2.1, 0]}>
              <boxGeometry args={[0.9, 0.2, 0.9]} />
              <meshStandardMaterial color="#e2e8f0" />
            </mesh>
          </group>
        ))}

        {/* Cascading Golden Fairy Light Curtains (Exact replica from video 01:22-01:36) */}
        <group position={[0, 4.2, 3.2]}>
          {Array.from({ length: 48 }).map((_, li) => {
            const lx = (li - 23.5) * 0.65
            const lh = 3.6 + Math.sin(li * 1.5) * 0.4
            return (
              <group key={li} position={[lx, -lh / 2, 0]}>
                {/* Vertical shimmering light wire */}
                <mesh>
                  <cylinderGeometry args={[0.008, 0.008, lh, 4]} />
                  <meshStandardMaterial
                    color="#fef08a"
                    emissive="#fde047"
                    emissiveIntensity={night ? 2.5 : 0.4}
                  />
                </mesh>
              </group>
            )
          })}
        </group>

        {/* 1. KAPSONS MEGA FLAGSHIP SHOWROOM (Left Wing, X = -10) */}
        <group position={[-10, 0, 2.8]}>
          <mesh position={[0, 3.8, 0.1]}>
            <planeGeometry args={[8.8, 1.8]} />
            <meshBasicMaterial map={kapsonsSign} />
          </mesh>
          {/* Floor-to-ceiling plate glass windows */}
          <mesh position={[0, 1.8, 0.1]}>
            <boxGeometry args={[8.6, 3.4, 0.08]} />
            <meshPhysicalMaterial
              color="#ffffff"
              transmission={0.9}
              opacity={0.3}
              transparent
              roughness={0.08}
            />
          </mesh>
          {/* Mannequins in evening attire */}
          {[-2, 0, 2].map((mx, idx) => (
            <group key={idx} position={[mx, 0, -0.8]}>
              <mesh position={[0, 0.9, 0]} castShadow>
                <cylinderGeometry args={[0.18, 0.14, 0.9, 10]} />
                <meshStandardMaterial color={idx === 0 ? '#1e293b' : idx === 1 ? '#b45309' : '#047857'} />
              </mesh>
              <mesh position={[0, 1.55, 0]}>
                <sphereGeometry args={[0.12, 10, 10]} />
                <meshStandardMaterial color="#d4a373" />
              </mesh>
            </group>
          ))}
        </group>

        {/* 2. PLANET FASHION SHOWROOM (Center Wing, X = 0, Video 01:30) */}
        <group position={[0, 0, 2.8]}>
          <mesh position={[0, 3.8, 0.1]}>
            <planeGeometry args={[8.8, 1.8]} />
            <meshBasicMaterial map={planetFashionSign} />
          </mesh>
          {/* Red Glowing Trim Portal */}
          <mesh position={[0, 1.8, 0.1]}>
            <boxGeometry args={[8.6, 3.4, 0.08]} />
            <meshPhysicalMaterial
              color="#ffffff"
              transmission={0.9}
              opacity={0.3}
              transparent
              roughness={0.08}
            />
          </mesh>
          <mesh position={[0, 3.5, 0.12]}>
            <boxGeometry args={[8.6, 0.08, 0.08]} />
            <meshStandardMaterial color="#b91c1c" emissive="#b91c1c" emissiveIntensity={1} />
          </mesh>
          {/* Formal Shirt Displays */}
          {[-2.2, 0, 2.2].map((fx, idx) => (
            <mesh key={idx} position={[fx, 1.2, -0.6]} castShadow>
              <boxGeometry args={[1.2, 0.8, 0.4]} />
              <meshStandardMaterial color={idx === 0 ? '#ffffff' : idx === 1 ? '#0284c7' : '#e2e8f0'} />
            </mesh>
          ))}
        </group>

        {/* 3. UNITED COLORS OF BENETTON (Right Wing, X = 10, Video 01:34) */}
        <group position={[10, 0, 2.8]}>
          <mesh position={[0, 3.8, 0.1]}>
            <planeGeometry args={[8.8, 1.8]} />
            <meshBasicMaterial map={benettonSign} />
          </mesh>
          <mesh position={[0, 1.8, 0.1]}>
            <boxGeometry args={[8.6, 3.4, 0.08]} />
            <meshPhysicalMaterial
              color="#ffffff"
              transmission={0.9}
              opacity={0.3}
              transparent
              roughness={0.08}
            />
          </mesh>
          {/* Colorful folded sweaters in window */}
          {[-2.4, -0.8, 0.8, 2.4].map((bx, idx) => (
            <mesh key={idx} position={[bx, 1.0, -0.6]} castShadow>
              <boxGeometry args={[0.9, 0.6, 0.4]} />
              <meshStandardMaterial color={['#facc15', '#06b6d4', '#ec4899', '#10b981'][idx]} />
            </mesh>
          ))}
        </group>
      </group>

      {/* ================================================================= */}
      {/* "I ❤️ CHD" PHOTO MONUMENT (Exact replica from video 01:26)         */}
      {/* ================================================================= */}
      <group position={[2, 0, -22]}>
        {/* Concrete Pedestal Base */}
        <mesh position={[0, 0.25, 0]} receiveShadow>
          <boxGeometry args={[4.8, 0.5, 1.2]} />
          <meshStandardMaterial
            map={beton.diffuse}
            bumpMap={beton.bump}
            color="#cbd5e1"
            roughness={0.88}
          />
        </mesh>

        {/* 3D Letter 'I' */}
        <group position={[-1.6, 1.2, 0]}>
          <mesh castShadow>
            <boxGeometry args={[0.3, 1.4, 0.3]} />
            <meshStandardMaterial color="#ffffff" roughness={0.2} metalness={0.1} />
          </mesh>
          <mesh position={[0, 0.65, 0]}>
            <boxGeometry args={[0.7, 0.15, 0.3]} />
            <meshStandardMaterial color="#ffffff" />
          </mesh>
          <mesh position={[0, -0.65, 0]}>
            <boxGeometry args={[0.7, 0.15, 0.3]} />
            <meshStandardMaterial color="#ffffff" />
          </mesh>
        </group>

        {/* Glowing 3D Heart Symbol '❤️' */}
        <group position={[-0.5, 1.3, 0]}>
          {/* Left heart lobe */}
          <mesh position={[-0.25, 0.2, 0]} rotation={[0, 0, Math.PI / 4]} castShadow>
            <cylinderGeometry args={[0.38, 0.38, 0.32, 24]} />
            <meshStandardMaterial
              color="#e11d48"
              emissive="#e11d48"
              emissiveIntensity={night ? 2.5 : 0.6}
              roughness={0.2}
            />
          </mesh>
          {/* Right heart lobe */}
          <mesh position={[0.25, 0.2, 0]} rotation={[0, 0, -Math.PI / 4]} castShadow>
            <cylinderGeometry args={[0.38, 0.38, 0.32, 24]} />
            <meshStandardMaterial
              color="#e11d48"
              emissive="#e11d48"
              emissiveIntensity={night ? 2.5 : 0.6}
              roughness={0.2}
            />
          </mesh>
          {/* Lower pointed heart base */}
          <mesh position={[0, -0.25, 0]} rotation={[0, 0, Math.PI]}>
            <coneGeometry args={[0.55, 0.8, 24]} />
            <meshStandardMaterial
              color="#e11d48"
              emissive="#e11d48"
              emissiveIntensity={night ? 2.5 : 0.6}
              roughness={0.2}
            />
          </mesh>
        </group>

        {/* 3D Letters 'C H D' */}
        {/* Letter C */}
        <group position={[0.6, 1.2, 0]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.65, 0.65, 0.3, 24, 1, false, 0.8, Math.PI * 1.5]} />
            <meshStandardMaterial color="#ffffff" roughness={0.2} />
          </mesh>
        </group>

        {/* Letter H */}
        <group position={[1.4, 1.2, 0]}>
          <mesh position={[-0.3, 0, 0]} castShadow>
            <boxGeometry args={[0.2, 1.4, 0.3]} />
            <meshStandardMaterial color="#ffffff" />
          </mesh>
          <mesh position={[0.3, 0, 0]} castShadow>
            <boxGeometry args={[0.2, 1.4, 0.3]} />
            <meshStandardMaterial color="#ffffff" />
          </mesh>
          <mesh position={[0, 0, 0]} castShadow>
            <boxGeometry args={[0.5, 0.2, 0.3]} />
            <meshStandardMaterial color="#ffffff" />
          </mesh>
        </group>

        {/* Letter D */}
        <group position={[2.1, 1.2, 0]}>
          <mesh position={[-0.2, 0, 0]} castShadow>
            <boxGeometry args={[0.2, 1.4, 0.3]} />
            <meshStandardMaterial color="#ffffff" />
          </mesh>
          <mesh position={[0.1, 0, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
            <cylinderGeometry args={[0.7, 0.7, 0.3, 24, 1, false, 0, Math.PI]} />
            <meshStandardMaterial color="#ffffff" />
          </mesh>
        </group>
      </group>
    </group>
  )
}
