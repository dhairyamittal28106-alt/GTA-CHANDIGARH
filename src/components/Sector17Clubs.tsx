import { useMemo, useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { sound } from './AudioEngine'

interface Sector17ClubsProps {
  night: boolean
  playerPos?: { current: THREE.Vector3 }
  onTeleport?: (x: number, z: number, yaw: number) => void
}

/**
 * Sector 17 Iconic Nightclubs & Discotheques:
 * Featuring SCORE CLUB 17 (SCO 54-55, Sector 17-D)
 * - Brutalist nightclub facade with animated neon equalizer & signage
 * - VIP Red Carpet with golden brass stanchions & door bouncer
 * - Interactive 8x8 animated LED reactive dance floor
 * - Rotating mirror disco ball casting sparkling reflections
 * - Elevated DJ stage with Pioneer CDJs, animated DJ, and laser light show
 * - Pulsing subwoofers & VIP bottle service lounge
 * - Dynamic sound proximity (muffled bass outside -> roaring stereo inside)
 */
export function Sector17Clubs({ night, playerPos, onTeleport }: Sector17ClubsProps) {
  const [insideClub, setInsideClub] = useState(false)
  const transitionLock = useRef(0)
  const discoBallRef = useRef<THREE.Group>(null)
  const lasersRef = useRef<THREE.Group>(null)
  const eqBarsRef = useRef<THREE.Group>(null)
  const subwoofersRef = useRef<THREE.Group>(null)
  const danceFloorRef = useRef<THREE.Group>(null)
  const djRef = useRef<THREE.Group>(null)

  // Neon sign textures created with procedural HTML Canvas
  const scoreSign = useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 512
    canvas.height = 128
    const ctx = canvas.getContext('2d')!

    ctx.fillStyle = '#0a0d10'
    ctx.fillRect(0, 0, 512, 128)

    // Glowing border
    ctx.strokeStyle = '#00f5d4'
    ctx.lineWidth = 6
    ctx.strokeRect(8, 8, 496, 112)

    // Neon text
    ctx.font = '900 48px "DM Mono", Impact, sans-serif'
    ctx.fillStyle = '#00f5d4'
    ctx.textAlign = 'center'
    ctx.shadowColor = '#00f5d4'
    ctx.shadowBlur = 18
    ctx.fillText('⚡ SCORE CLUB 17 ⚡', 256, 58)

    ctx.font = 'bold 20px "DM Mono", monospace'
    ctx.fillStyle = '#f72585'
    ctx.shadowColor = '#f72585'
    ctx.shadowBlur = 12
    ctx.fillText('DISCOTHEQUE & UNDERGROUND LOUNGE', 256, 98)

    const tex = new THREE.CanvasTexture(canvas)
    tex.colorSpace = THREE.SRGBColorSpace
    return tex
  }, [])

  // Event poster lightbox
  const posterTex = useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 256
    canvas.height = 384
    const ctx = canvas.getContext('2d')!

    ctx.fillStyle = '#11001c'
    ctx.fillRect(0, 0, 256, 384)

    ctx.strokeStyle = '#f72585'
    ctx.lineWidth = 4
    ctx.strokeRect(6, 6, 244, 372)

    ctx.fillStyle = '#ffbe0b'
    ctx.font = 'bold 24px "DM Mono", sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText('SATURDAY NIGHT', 128, 44)

    ctx.fillStyle = '#ffffff'
    ctx.font = '900 32px "DM Mono", Impact, sans-serif'
    ctx.fillText('PUNJABI BASS', 128, 92)
    ctx.fillText('& RETRO DISCO', 128, 130)

    ctx.fillStyle = '#00f5d4'
    ctx.font = 'bold 20px "DM Mono", monospace'
    ctx.fillText('FEAT. DJ SUKHI', 128, 185)

    ctx.fillStyle = '#f72585'
    ctx.font = '14px "DM Mono", monospace'
    ctx.fillText('SCO 54 · SECTOR 17-D', 128, 230)
    ctx.fillText('DOORS OPEN 8 PM', 128, 255)

    // Equalizer graphic
    ctx.fillStyle = '#7209b7'
    for (let i = 0; i < 8; i++) {
      const h = 20 + Math.sin(i * 1.2) * 15
      ctx.fillRect(40 + i * 22, 330 - h, 14, h)
    }

    const tex = new THREE.CanvasTexture(canvas)
    tex.colorSpace = THREE.SRGBColorSpace
    return tex
  }, [])

  // Dance floor tile materials (64 tiles)
  const floorColors = useMemo(
    () => ['#f72585', '#7209b7', '#3a0ca3', '#4361ee', '#4cc9f0', '#00f5d4', '#fee440'],
    []
  )

  useFrame(({ clock }, dt) => {
    const t = clock.elapsedTime

    // Step on the pink entry/exit pad to move through the decorative facade.
    if (transitionLock.current > 0) transitionLock.current = Math.max(0, transitionLock.current - dt)
    if (playerPos && transitionLock.current <= 0) {
      const { x, z } = playerPos.current
      const entryDistance = Math.hypot(x - 28.2, z + 2)
      const exitDistance = Math.hypot(x - 32.6, z + 2)
      if (!insideClub && entryDistance < 1.45) {
        transitionLock.current = 1.2
        setInsideClub(true)
        onTeleport?.(34.2, -2, Math.PI / 2)
      } else if (insideClub && exitDistance < 1.25) {
        transitionLock.current = 1.2
        setInsideClub(false)
        onTeleport?.(26.4, -2, -Math.PI / 2)
      }
    }

    // 1. Dynamic audio proximity update
    if (playerPos) {
      sound.updateClubProximity(playerPos.current.x, playerPos.current.z)
    }

    // 2. Rotate Mirror Disco Ball
    if (discoBallRef.current) {
      discoBallRef.current.rotation.y = t * 0.45
    }

    // 3. Sweeping Laser Beams
    if (lasersRef.current) {
      lasersRef.current.children.forEach((child, idx) => {
        const offset = idx * (Math.PI / 2)
        child.rotation.z = Math.sin(t * 2.2 + offset) * 0.45
        child.rotation.x = Math.cos(t * 1.8 + offset) * 0.35
      })
    }

    // 4. Facade Equalizer Bars
    if (eqBarsRef.current) {
      eqBarsRef.current.children.forEach((child, idx) => {
        const scaleY = 0.3 + Math.abs(Math.sin(t * 6 + idx * 0.8)) * 1.4
        child.scale.y = scaleY
      })
    }

    // 5. Pulsing Subwoofers (Thump on 128 BPM kick)
    if (subwoofersRef.current) {
      const kickPulse = Math.pow(Math.sin(t * Math.PI * (128 / 60)), 8)
      subwoofersRef.current.scale.set(1 + kickPulse * 0.08, 1 + kickPulse * 0.08, 1)
    }

    // 6. Reactive LED Dance Floor Color Shifts
    if (danceFloorRef.current) {
      const beat = Math.floor(t * (128 / 60))
      danceFloorRef.current.children.forEach((child, i) => {
        const mesh = child as THREE.Mesh
        const mat = mesh.material as THREE.MeshStandardMaterial
        if (mat) {
          const colorIdx = (i + beat) % floorColors.length
          mat.color.set(floorColors[colorIdx])
          mat.emissive.set(floorColors[colorIdx])
          mat.emissiveIntensity = 0.5 + Math.sin(t * 8 + i) * 0.4
        }
      })
    }

    // 7. DJ Scratching & Head Bobbing
    if (djRef.current) {
      djRef.current.rotation.y = Math.sin(t * 4) * 0.15
      djRef.current.position.y = 0.8 + Math.abs(Math.sin(t * 8)) * 0.04
    }
  })

  return (
    <group position={[38, 0, -2]} rotation={[0, -Math.PI / 2, 0]} userData={{ sector17CollisionIgnore: true }}>
      {/* =================================================================== */}
      {/* A. EXTERIOR CLUB FACADE & MARQUEE                                   */}
      {/* =================================================================== */}
      <group position={[0, 0, 0]}>
        {/* Open shell: separate walls leave a real doorway and walkable room. */}
        {[-8.8, 8.8].map(x => (
          <mesh key={`club-side-${x}`} position={[x, 4.2, 0]} castShadow receiveShadow>
            <boxGeometry args={[0.55, 8.4, 14.6]} />
            <meshStandardMaterial color="#13171a" roughness={0.85} metalness={0.2} />
          </mesh>
        ))}
        <mesh position={[0, 4.2, -7]} castShadow receiveShadow>
          <boxGeometry args={[18, 8.4, 0.55]} />
          <meshStandardMaterial color="#13171a" roughness={0.85} metalness={0.2} />
        </mesh>
        <mesh position={[0, 8.55, 0]} receiveShadow>
          <boxGeometry args={[18.4, 0.5, 14.8]} />
          <meshStandardMaterial color="#101416" roughness={0.7} metalness={0.25} />
        </mesh>
        {[-5.3, 5.3].map(x => (
          <mesh key={`club-front-${x}`} position={[x, 4.2, 7.05]} castShadow receiveShadow>
            <boxGeometry args={[7.4, 8.4, 0.6]} />
            <meshStandardMaterial color="#0c0e10" roughness={0.3} metalness={0.5} />
          </mesh>
        ))}
        <mesh position={[0, 6.3, 7.05]} castShadow receiveShadow>
          <boxGeometry args={[3.2, 4.2, 0.6]} />
          <meshStandardMaterial color="#0c0e10" roughness={0.3} metalness={0.5} />
        </mesh>

        {/* Glowing Entrance Portal Frame */}
        <group position={[0, 2.5, 7.6]}>
          {[-1.9, 1.9].map(x => (
            <mesh key={x} position={[x, 0, 0]}>
              <boxGeometry args={[0.4, 4.6, 0.4]} />
              <meshStandardMaterial color="#ff007f" emissive="#ff007f" emissiveIntensity={night ? 1.5 : 0.35} />
            </mesh>
          ))}
          <mesh position={[0, 2.1, 0]}>
            <boxGeometry args={[4.2, 0.4, 0.4]} />
            <meshStandardMaterial color="#ff007f" emissive="#ff007f" emissiveIntensity={night ? 1.5 : 0.35} />
          </mesh>
        </group>

        {/* Entrance Doorway Cutout (Walk-through opening) */}
        {/* Velvet Entrance Curtains */}
        <mesh position={[-1.4, 2.1, 7.8]} rotation={[0, 0.2, 0]}>
          <boxGeometry args={[0.7, 3.8, 0.1]} />
          <meshStandardMaterial color="#7209b7" roughness={0.9} />
        </mesh>
        <mesh position={[1.4, 2.1, 7.8]} rotation={[0, -0.2, 0]}>
          <boxGeometry args={[0.7, 3.8, 0.1]} />
          <meshStandardMaterial color="#7209b7" roughness={0.9} />
        </mesh>

        {/* Massive Neon Signboard */}
        <mesh position={[0, 6.2, 7.6]}>
          <planeGeometry args={[9.5, 2.4]} />
          <meshBasicMaterial map={scoreSign} />
        </mesh>

        {/* Neon Light Strip Accents on Roofline */}
        <mesh position={[0, 8.5, 7.55]}>
          <boxGeometry args={[18, 0.15, 0.2]} />
          <meshStandardMaterial
            color="#00f5d4"
            emissive="#00f5d4"
            emissiveIntensity={night ? 1.5 : 0.4}
          />
        </mesh>
        <mesh position={[0, 0.1, 7.55]}>
          <boxGeometry args={[18, 0.15, 0.2]} />
          <meshStandardMaterial
            color="#f72585"
            emissive="#f72585"
            emissiveIntensity={night ? 1.5 : 0.4}
          />
        </mesh>

        {/* Animated Neon Equalizer Bars on Front Wall */}
        <group ref={eqBarsRef} position={[6.2, 5.8, 7.6]}>
          {Array.from({ length: 8 }).map((_, i) => (
            <mesh key={i} position={[(i - 3.5) * 0.35, 0, 0]}>
              <boxGeometry args={[0.22, 1.8, 0.08]} />
              <meshStandardMaterial
                color={i < 5 ? '#00f5d4' : i < 7 ? '#fee440' : '#f72585'}
                emissive={i < 5 ? '#00f5d4' : i < 7 ? '#fee440' : '#f72585'}
                emissiveIntensity={night ? 1.2 : 0.3}
              />
            </mesh>
          ))}
        </group>

        {/* Event Poster Lightbox on Left Facade */}
        <group position={[-6.2, 5.5, 7.6]}>
          <mesh>
            <planeGeometry args={[2.2, 3.2]} />
            <meshBasicMaterial map={posterTex} />
          </mesh>
          {/* Backlight frame */}
          <mesh position={[0, 0, -0.05]}>
            <boxGeometry args={[2.4, 3.4, 0.1]} />
            <meshStandardMaterial color="#ffbe0b" emissive="#ffbe0b" emissiveIntensity={0.3} />
          </mesh>
        </group>
      </group>

      {/* =================================================================== */}
      {/* B. VIP RED CARPET, STANCHIONS & BOUNCER                             */}
      {/* =================================================================== */}
      <group position={[0, 0, 7.6]}>
        {/* Plush Red Carpet */}
        <mesh position={[0, 0.015, 3.8]} receiveShadow>
          <planeGeometry args={[2.4, 7.6]} />
          <meshStandardMaterial color="#8b0000" roughness={0.92} />
        </mesh>

        {/* Brass Stanchions & Velvet Ropes */}
        {[-3, -1.5, 0, 1.5, 3].map((z, idx) => (
          <group key={idx}>
            {/* Left side stanchions */}
            <mesh position={[-1.35, 0.5, z + 3.8]} castShadow>
              <cylinderGeometry args={[0.025, 0.035, 1.0, 12]} />
              <meshStandardMaterial color="#ffd700" metalness={0.9} roughness={0.15} />
            </mesh>
            <mesh position={[-1.35, 1.02, z + 3.8]}>
              <sphereGeometry args={[0.045, 8, 8]} />
              <meshStandardMaterial color="#ffd700" metalness={0.9} />
            </mesh>

            {/* Right side stanchions */}
            <mesh position={[1.35, 0.5, z + 3.8]} castShadow>
              <cylinderGeometry args={[0.025, 0.035, 1.0, 12]} />
              <meshStandardMaterial color="#ffd700" metalness={0.9} roughness={0.15} />
            </mesh>
            <mesh position={[1.35, 1.02, z + 3.8]}>
              <sphereGeometry args={[0.045, 8, 8]} />
              <meshStandardMaterial color="#ffd700" metalness={0.9} />
            </mesh>

            {/* Velvet connecting rope */}
            {idx < 4 && (
              <>
                <mesh position={[-1.35, 0.78, z + 4.55]} rotation={[0.15, 0, 0]}>
                  <cylinderGeometry args={[0.018, 0.018, 1.5, 8]} />
                  <meshStandardMaterial color="#9d0208" roughness={0.8} />
                </mesh>
                <mesh position={[1.35, 0.78, z + 4.55]} rotation={[0.15, 0, 0]}>
                  <cylinderGeometry args={[0.018, 0.018, 1.5, 8]} />
                  <meshStandardMaterial color="#9d0208" roughness={0.8} />
                </mesh>
              </>
            )}
          </group>
        ))}

        {/* VIP Bouncer Character Standing Guard */}
        <group position={[1.9, 0, 1.2]} rotation={[0, -0.4, 0]}>
          {/* Black suit body */}
          <mesh position={[0, 1.1, 0]} castShadow>
            <boxGeometry args={[0.55, 0.95, 0.32]} />
            <meshStandardMaterial color="#0a0a0c" roughness={0.85} />
          </mesh>
          {/* White collar & black tie */}
          <mesh position={[0, 1.45, 0.17]}>
            <boxGeometry args={[0.12, 0.16, 0.02]} />
            <meshStandardMaterial color="#ffffff" />
          </mesh>
          <mesh position={[0, 1.3, 0.18]}>
            <boxGeometry args={[0.04, 0.24, 0.02]} />
            <meshStandardMaterial color="#000000" />
          </mesh>
          {/* Head & Sunglasses */}
          <mesh position={[0, 1.82, 0]} castShadow>
            <sphereGeometry args={[0.14, 14, 12]} />
            <meshStandardMaterial color="#c68b59" roughness={0.7} />
          </mesh>
          <mesh position={[0, 1.84, 0.12]}>
            <boxGeometry args={[0.18, 0.05, 0.04]} />
            <meshStandardMaterial color="#050505" roughness={0.1} metalness={0.9} />
          </mesh>
          {/* Crossed Arms */}
          <mesh position={[0, 1.05, 0.22]} rotation={[0, 0, 0]}>
            <boxGeometry args={[0.52, 0.18, 0.16]} />
            <meshStandardMaterial color="#0a0a0c" />
          </mesh>
          {/* Legs */}
          <mesh position={[-0.14, 0.45, 0]} castShadow>
            <boxGeometry args={[0.2, 0.9, 0.24]} />
            <meshStandardMaterial color="#0a0a0c" />
          </mesh>
          <mesh position={[0.14, 0.45, 0]} castShadow>
            <boxGeometry args={[0.2, 0.9, 0.24]} />
            <meshStandardMaterial color="#0a0a0c" />
          </mesh>
        </group>

        {/* Entrance Area Glow Light */}
        <pointLight
          position={[0, 3.8, 4.0]}
          color="#f72585"
          intensity={night ? 45 : 15}
          distance={16}
        />
      </group>

      {/* =================================================================== */}
      {/* C. INTERIOR DISCOTHEQUE (UNDERGROUND DANCE FLOOR & STAGE)           */}
      {/* =================================================================== */}
      <group position={[0, 0, -0.5]}>
        {/* Interior Dark Floor */}
        <mesh position={[0, 0.02, 0]} receiveShadow>
          <planeGeometry args={[16, 12]} />
          <meshStandardMaterial color="#080a0c" roughness={0.4} metalness={0.6} />
        </mesh>

        {/* Interior Acoustic Walls with Neon Accents */}
        <mesh position={[-7.9, 3.5, 0]}>
          <boxGeometry args={[0.2, 7.0, 12]} />
          <meshStandardMaterial color="#0a0c10" roughness={0.9} />
        </mesh>
        <mesh position={[7.9, 3.5, 0]}>
          <boxGeometry args={[0.2, 7.0, 12]} />
          <meshStandardMaterial color="#0a0c10" roughness={0.9} />
        </mesh>
        <mesh position={[0, 3.5, -5.9]}>
          <boxGeometry args={[16, 7.0, 0.2]} />
          <meshStandardMaterial color="#0a0c10" roughness={0.9} />
        </mesh>

        {/* Vertical Neon Light Strips along the walls */}
        {[-4, -2, 0, 2, 4].map(z => (
          <group key={z}>
            <mesh position={[-7.8, 3.5, z]}>
              <boxGeometry args={[0.06, 6.0, 0.08]} />
              <meshStandardMaterial color="#3a0ca3" emissive="#3a0ca3" emissiveIntensity={2} />
            </mesh>
            <mesh position={[7.8, 3.5, z]}>
              <boxGeometry args={[0.06, 6.0, 0.08]} />
              <meshStandardMaterial color="#4cc9f0" emissive="#4cc9f0" emissiveIntensity={2} />
            </mesh>
          </group>
        ))}

        {/* ----------------------------------------------------------------- */}
        {/* 1. 8x8 INTERACTIVE LED REACTIVE DANCE FLOOR                       */}
        {/* ----------------------------------------------------------------- */}
        <group ref={danceFloorRef} position={[0, 0.05, 0]}>
          {Array.from({ length: 64 }).map((_, idx) => {
            const row = Math.floor(idx / 8) - 3.5
            const col = (idx % 8) - 3.5
            const defaultColor = floorColors[idx % floorColors.length]
            return (
              <mesh key={idx} position={[col * 0.95, 0, row * 0.95]} receiveShadow>
                <boxGeometry args={[0.88, 0.04, 0.88]} />
                <meshStandardMaterial
                  color={defaultColor}
                  emissive={defaultColor}
                  emissiveIntensity={0.6}
                  roughness={0.15}
                  metalness={0.2}
                />
              </mesh>
            )
          })}
        </group>

        {/* ----------------------------------------------------------------- */}
        {/* 2. ROTATING MIRROR DISCO BALL                                     */}
        {/* ----------------------------------------------------------------- */}
        <group position={[0, 5.2, 0]}>
          {/* Steel suspension cable */}
          <mesh position={[0, 0.8, 0]}>
            <cylinderGeometry args={[0.01, 0.01, 1.6, 6]} />
            <meshStandardMaterial color="#aaaaaa" metalness={0.9} />
          </mesh>

          {/* Faceted Mirror Disco Ball */}
          <group ref={discoBallRef}>
            <mesh castShadow>
              <sphereGeometry args={[0.55, 24, 20]} />
              <meshStandardMaterial
                color="#ffffff"
                metalness={0.98}
                roughness={0.05}
                envMapIntensity={2.5}
              />
            </mesh>
          </group>

          {/* Focused Spotlights on Disco Ball */}
          <pointLight color="#f72585" intensity={night ? 35 : 12} distance={12} />
          <pointLight color="#00f5d4" intensity={night ? 35 : 12} distance={12} position={[1, -0.5, 1]} />
        </group>

        {/* ----------------------------------------------------------------- */}
        {/* 3. ELEVATED DJ STAGE & BOOTH (AT BACK WALL)                       */}
        {/* ----------------------------------------------------------------- */}
        <group position={[0, 0, -4.6]}>
          {/* DJ Stage Riser */}
          <mesh position={[0, 0.4, 0]} castShadow receiveShadow>
            <boxGeometry args={[6.4, 0.8, 2.2]} />
            <meshStandardMaterial color="#1a1c20" roughness={0.5} metalness={0.4} />
          </mesh>

          {/* Glowing Stage Edge Lip */}
          <mesh position={[0, 0.8, 1.1]}>
            <boxGeometry args={[6.4, 0.08, 0.08]} />
            <meshStandardMaterial color="#00f5d4" emissive="#00f5d4" emissiveIntensity={2} />
          </mesh>

          {/* DJ Table Console */}
          <mesh position={[0, 1.25, 0.2]} castShadow>
            <boxGeometry args={[3.2, 0.85, 0.9]} />
            <meshStandardMaterial color="#0f1114" roughness={0.3} metalness={0.7} />
          </mesh>

          {/* Pioneer CDJ Decks with Glowing Jog Wheels */}
          {[-0.8, 0.8].map((deckX, i) => (
            <group key={i} position={[deckX, 1.7, 0.2]}>
              <mesh>
                <boxGeometry args={[0.5, 0.05, 0.6]} />
                <meshStandardMaterial color="#1f2429" />
              </mesh>
              {/* Glowing Jog Wheel */}
              <mesh position={[0, 0.03, 0]}>
                <cylinderGeometry args={[0.18, 0.18, 0.02, 24]} />
                <meshStandardMaterial
                  color="#00f5d4"
                  emissive="#00f5d4"
                  emissiveIntensity={1.5}
                />
              </mesh>
            </group>
          ))}

          {/* Central DJ Mixer with LED VU Meters */}
          <mesh position={[0, 1.7, 0.2]}>
            <boxGeometry args={[0.6, 0.06, 0.55]} />
            <meshStandardMaterial color="#15181c" />
          </mesh>
          <mesh position={[0, 1.74, 0.2]}>
            <boxGeometry args={[0.1, 0.01, 0.35]} />
            <meshStandardMaterial color="#fee440" emissive="#fee440" emissiveIntensity={1.8} />
          </mesh>

          {/* DJ Laptop */}
          <group position={[-0.4, 1.75, 0.35]} rotation={[0, 0.2, 0]}>
            <mesh position={[0, 0.02, 0]}>
              <boxGeometry args={[0.35, 0.02, 0.25]} />
              <meshStandardMaterial color="#c0c0c0" metalness={0.8} />
            </mesh>
            <mesh position={[0, 0.14, -0.1]} rotation={[-0.3, 0, 0]}>
              <boxGeometry args={[0.35, 0.22, 0.02]} />
              <meshStandardMaterial color="#00f5d4" emissive="#00f5d4" emissiveIntensity={0.8} />
            </mesh>
          </group>

          {/* DJ Sukhi Character Animated Behind Console */}
          <group ref={djRef} position={[0, 0.8, -0.4]}>
            {/* Body / Graphic Tee */}
            <mesh position={[0, 0.7, 0]} castShadow>
              <boxGeometry args={[0.48, 0.65, 0.28]} />
              <meshStandardMaterial color="#1d3557" />
            </mesh>
            {/* Head & Cap */}
            <mesh position={[0, 1.2, 0]} castShadow>
              <sphereGeometry args={[0.13, 12, 10]} />
              <meshStandardMaterial color="#d4a373" />
            </mesh>
            {/* Backward DJ Cap */}
            <mesh position={[0, 1.28, -0.02]} rotation={[-0.2, 0, 0]}>
              <sphereGeometry args={[0.135, 12, 10, 0, Math.PI * 2, 0, Math.PI / 2]} />
              <meshStandardMaterial color="#e63946" />
            </mesh>
            {/* DJ Headphones around neck */}
            <mesh position={[0, 1.15, 0.06]} rotation={[Math.PI / 2, 0, 0]}>
              <torusGeometry args={[0.14, 0.025, 8, 16]} />
              <meshStandardMaterial color="#ffd166" metalness={0.7} />
            </mesh>
            {/* Arms reaching to mixer */}
            <mesh position={[-0.28, 0.75, 0.25]} rotation={[0.6, 0.3, -0.4]}>
              <cylinderGeometry args={[0.045, 0.045, 0.45, 8]} />
              <meshStandardMaterial color="#1d3557" />
            </mesh>
            <mesh position={[0.28, 0.75, 0.25]} rotation={[0.6, -0.3, 0.4]}>
              <cylinderGeometry args={[0.045, 0.045, 0.45, 8]} />
              <meshStandardMaterial color="#1d3557" />
            </mesh>
          </group>

          {/* Wall of Concert Subwoofers on Left & Right */}
          <group ref={subwoofersRef}>
            {[-2.6, 2.6].map((subX, i) => (
              <group key={i} position={[subX, 1.0, 0]}>
                {/* Dual Subwoofer Enclosure */}
                <mesh castShadow>
                  <boxGeometry args={[1.2, 2.0, 0.9]} />
                  <meshStandardMaterial color="#090a0c" roughness={0.9} />
                </mesh>
                {/* Top Speaker Cone */}
                <mesh position={[0, 0.45, 0.46]} rotation={[Math.PI / 2, 0, 0]}>
                  <cylinderGeometry args={[0.35, 0.25, 0.06, 20]} />
                  <meshStandardMaterial color="#1e232a" roughness={0.3} />
                </mesh>
                {/* Bottom Speaker Cone */}
                <mesh position={[0, -0.45, 0.46]} rotation={[Math.PI / 2, 0, 0]}>
                  <cylinderGeometry args={[0.35, 0.25, 0.06, 20]} />
                  <meshStandardMaterial color="#1e232a" roughness={0.3} />
                </mesh>
              </group>
            ))}
          </group>

          {/* Overhead Aluminum Concert Truss with Stage Lights */}
          <group position={[0, 4.8, 0]}>
            {/* Horizontal Truss */}
            <mesh>
              <boxGeometry args={[7.2, 0.25, 0.25]} />
              <meshStandardMaterial color="#c0c0c0" metalness={0.75} roughness={0.28} />
            </mesh>

            {/* Stage Par Cans / Moving Head Lights */}
            {[-2.5, -1.2, 0, 1.2, 2.5].map((lightX, idx) => (
              <group key={idx} position={[lightX, -0.2, 0]}>
                <mesh rotation={[0.4, 0, 0]}>
                  <cylinderGeometry args={[0.08, 0.12, 0.28, 12]} />
                  <meshStandardMaterial color="#222222" />
                </mesh>
                <spotLight
                  position={[0, 0, 0]}
                  target-position={[lightX * 0.8, -4, 3]}
                  color={idx % 2 === 0 ? '#ff007f' : '#00f5d4'}
                  intensity={night ? 80 : 25}
                  angle={0.4}
                  penumbra={0.8}
                  distance={14}
                />
              </group>
            ))}
          </group>

          {/* Dynamic Laser Beam System */}
          <group ref={lasersRef} position={[0, 4.6, 0]}>
            {/* 4 Laser Cones */}
            {[-2.0, -0.7, 0.7, 2.0].map((lx, lIdx) => {
              const laserColors = ['#00f5d4', '#f72585', '#39ff14', '#ffbe0b']
              const lColor = laserColors[lIdx % laserColors.length]
              return (
                <mesh
                  key={lIdx}
                  position={[lx, 0, 0]}
                  rotation={[0.3, 0, (lIdx - 1.5) * 0.15]}
                >
                  <coneGeometry args={[0.45, 8.5, 12, 1, true]} />
                  <meshBasicMaterial
                    color={lColor}
                    transparent
                    opacity={night ? 0.35 : 0.1}
                    side={THREE.DoubleSide}
                  />
                </mesh>
              )
            })}
          </group>
        </group>

        {/* ----------------------------------------------------------------- */}
        {/* 4. VIP BOTTLE SERVICE LOUNGE (RIGHT SIDE)                         */}
        {/* ----------------------------------------------------------------- */}
        <group position={[5.2, 0, 0]}>
          {/* Semicircular Plush Leather VIP Booth */}
          <mesh position={[0, 0.5, 0]} castShadow>
            <cylinderGeometry args={[2.0, 2.0, 1.0, 16, 1, false, 0, Math.PI]} />
            <meshStandardMaterial color="#240046" roughness={0.6} />
          </mesh>

          {/* Glowing Acrylic Cocktail Table */}
          <mesh position={[0, 0.55, 0.8]}>
            <cylinderGeometry args={[0.6, 0.6, 0.05, 16]} />
            <meshStandardMaterial
              color="#00f5d4"
              emissive="#00f5d4"
              emissiveIntensity={0.8}
              transparent
              opacity={0.85}
            />
          </mesh>
          <mesh position={[0, 0.28, 0.8]}>
            <cylinderGeometry args={[0.06, 0.14, 0.55, 12]} />
            <meshStandardMaterial color="#ffd700" metalness={0.9} />
          </mesh>

          {/* Champagne Ice Bucket & Bottles */}
          <mesh position={[0, 0.65, 0.8]} castShadow>
            <cylinderGeometry args={[0.12, 0.08, 0.16, 12]} />
            <meshStandardMaterial color="#e0e0e0" metalness={0.9} roughness={0.1} />
          </mesh>
          <mesh position={[0.02, 0.76, 0.8]} rotation={[0.2, 0, 0.1]}>
            <cylinderGeometry args={[0.025, 0.035, 0.24, 8]} />
            <meshStandardMaterial color="#1b4332" roughness={0.1} />
          </mesh>
        </group>

        {/* ----------------------------------------------------------------- */}
        {/* 5. BACKLIT ILLUMINATED LIQUOR BAR (LEFT SIDE)                     */}
        {/* ----------------------------------------------------------------- */}
        <group
          position={[-5.4, 0, 0]}
          onClick={() => {
            sound.playDrinkToast()
            const store = (window as unknown as { __charShopStore?: { setCharConfig: (c: { hasDrink: boolean }) => void } }).__charShopStore
            if (store) store.setCharConfig({ hasDrink: true })
          }}
        >
          {/* Black Marble Bar Counter */}
          <mesh position={[0, 0.6, 0]} castShadow receiveShadow>
            <boxGeometry args={[1.2, 1.2, 5.5]} />
            <meshStandardMaterial color="#0e1114" roughness={0.2} metalness={0.5} />
          </mesh>
          {/* Glowing Bar Top Rim */}
          <mesh position={[0.6, 1.2, 0]}>
            <boxGeometry args={[0.06, 0.04, 5.5]} />
            <meshStandardMaterial color="#ff007f" emissive="#ff007f" emissiveIntensity={2} />
          </mesh>

          {/* Interactive Bar Drink Sign */}
          <group position={[0.2, 1.4, 0]}>
            <mesh>
              <boxGeometry args={[0.6, 0.25, 1.8]} />
              <meshStandardMaterial
                color="#00f5d4"
                emissive="#00f5d4"
                emissiveIntensity={1.2}
              />
            </mesh>
          </group>

          {/* Backlit 3-Tier Bottle Shelves */}
          <group position={[-1.8, 1.2, 0]}>
            {[0, 0.8, 1.6].map((shelfY, sIdx) => (
              <group key={sIdx} position={[0, shelfY, 0]}>
                {/* Glowing Glass Shelf */}
                <mesh>
                  <boxGeometry args={[0.5, 0.04, 4.8]} />
                  <meshStandardMaterial
                    color="#00f5d4"
                    emissive="#00f5d4"
                    emissiveIntensity={1.2}
                  />
                </mesh>
                {/* Glowing Bottles */}
                {Array.from({ length: 9 }).map((_, bIdx) => {
                  const bColors = ['#ffd166', '#06d6a0', '#118ab2', '#ef476f']
                  const col = bColors[bIdx % bColors.length]
                  return (
                    <mesh key={bIdx} position={[0, 0.16, (bIdx - 4) * 0.48]}>
                      <cylinderGeometry args={[0.035, 0.045, 0.28, 8]} />
                      <meshStandardMaterial
                        color={col}
                        emissive={col}
                        emissiveIntensity={0.5}
                        transparent
                        opacity={0.85}
                      />
                    </mesh>
                  )
                })}
              </group>
            ))}
          </group>

          {/* Chrome Bar Stools */}
          {[-1.8, -0.6, 0.6, 1.8].map((stoolZ, sIdx) => (
            <group key={sIdx} position={[1.1, 0, stoolZ]}>
              <mesh position={[0, 0.4, 0]}>
                <cylinderGeometry args={[0.02, 0.02, 0.8, 8]} />
                <meshStandardMaterial color="#ffffff" metalness={0.9} />
              </mesh>
              <mesh position={[0, 0.8, 0]}>
                <cylinderGeometry args={[0.18, 0.18, 0.08, 16]} />
                <meshStandardMaterial color="#d90429" roughness={0.6} />
              </mesh>
            </group>
          ))}
        </group>

        {/* ----------------------------------------------------------------- */}
        {/* 6. CLUBBERS / DANCERS ON THE DANCE FLOOR                          */}
        {/* ----------------------------------------------------------------- */}
        {[
          { x: -1.2, z: -1.0, color: '#f72585', hair: '#111111' },
          { x: 1.4, z: -0.8, color: '#4cc9f0', hair: '#3a2010' },
          { x: -0.5, z: 1.2, color: '#fee440', hair: '#111111' },
          { x: 1.8, z: 1.4, color: '#7209b7', hair: '#553311' },
          { x: 0.2, z: -1.5, color: '#06d6a0', hair: '#111111' },
          { x: -1.8, z: 0.5, color: '#e63946', hair: '#222222' },
        ].map((dancer, dIdx) => (
          <group key={dIdx} position={[dancer.x, 0, dancer.z]}>
            {/* Stylish Party Outfit Torso */}
            <mesh position={[0, 0.9, 0]} castShadow>
              <cylinderGeometry args={[0.18, 0.14, 0.9, 10]} />
              <meshStandardMaterial color={dancer.color} roughness={0.5} />
            </mesh>
            {/* Head */}
            <mesh position={[0, 1.55, 0]} castShadow>
              <sphereGeometry args={[0.12, 12, 10]} />
              <meshStandardMaterial color="#d4a373" roughness={0.7} />
            </mesh>
            {/* Hair */}
            <mesh position={[0, 1.62, 0]}>
              <sphereGeometry args={[0.125, 10, 10]} />
              <meshStandardMaterial color={dancer.hair} roughness={0.8} />
            </mesh>
            {/* Dancing arms in party pose */}
            <mesh position={[-0.22, 1.1, 0.1]} rotation={[0.4, 0, 0.6]}>
              <boxGeometry args={[0.08, 0.45, 0.08]} />
              <meshStandardMaterial color={dancer.color} />
            </mesh>
            <mesh position={[0.22, 1.1, 0.1]} rotation={[0.4, 0, -0.6]}>
              <boxGeometry args={[0.08, 0.45, 0.08]} />
              <meshStandardMaterial color={dancer.color} />
            </mesh>
          </group>
        ))}
      </group>

      {/* Stand on the pink marker to enter; a matching marker inside exits. */}
      <group position={[0, 0, 9.8]} visible={!insideClub}>
        <mesh position={[0, 0.035, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[1.35, 40]} />
          <meshBasicMaterial color="#ff4fa3" transparent opacity={0.58} depthWrite={false} />
        </mesh>
        <mesh position={[0, 0.07, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <torusGeometry args={[1.28, 0.075, 8, 40]} />
          <meshStandardMaterial color="#ff83c1" emissive="#ff168f" emissiveIntensity={2.4} />
        </mesh>
      </group>
      <group position={[0, 0, 5.4]} visible={insideClub}>
        <mesh position={[0, 0.035, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[1.15, 40]} />
          <meshBasicMaterial color="#ff4fa3" transparent opacity={0.48} depthWrite={false} />
        </mesh>
        <mesh position={[0, 0.07, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <torusGeometry args={[1.08, 0.075, 8, 40]} />
          <meshStandardMaterial color="#ff83c1" emissive="#ff168f" emissiveIntensity={2.4} />
        </mesh>
      </group>
    </group>
  )
}
