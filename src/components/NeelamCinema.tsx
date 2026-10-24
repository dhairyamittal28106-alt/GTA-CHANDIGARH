import { useMemo } from 'react'
import * as THREE from 'three'
import { textures } from './TextureGenerator'

interface NeelamCinemaProps {
  night: boolean
  onInteract?: () => void
}

export function NeelamCinema({ night }: NeelamCinemaProps) {
  const beton = useMemo(() => textures.getBetonBrutTexture(), [])
  const brick = useMemo(() => textures.getChandigarhBrickTexture(), [])

  // Canvas textures for vintage movie posters & neon typography
  const neelamSignTexture = useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 1024
    canvas.height = 256
    const ctx = canvas.getContext('2d')!

    ctx.fillStyle = '#141212'
    ctx.fillRect(0, 0, 1024, 256)

    // Red neon border
    ctx.lineWidth = 12
    ctx.strokeStyle = '#e63946'
    ctx.strokeRect(16, 16, 992, 224)

    // Gold inner pinstripe
    ctx.lineWidth = 4
    ctx.strokeStyle = '#f4a261'
    ctx.strokeRect(34, 34, 956, 188)

    // English "NEELAM"
    ctx.font = '900 115px "DM Mono", Impact, sans-serif'
    ctx.textAlign = 'center'
    ctx.fillStyle = '#ff2a3b'
    ctx.shadowColor = '#ff2a3b'
    ctx.shadowBlur = 28
    ctx.fillText('NEELAM', 512, 132)

    // Subtitle
    ctx.font = '700 36px "DM Mono", sans-serif'
    ctx.fillStyle = '#fce4a6'
    ctx.shadowBlur = 12
    ctx.fillText('नीलम सिनेमा · SECTOR 17 · PREMIER THEATRE', 512, 188)

    const tex = new THREE.CanvasTexture(canvas)
    tex.colorSpace = THREE.SRGBColorSpace
    return tex
  }, [])

  const posterTextures = useMemo(() => {
    const movies = [
      { title: 'SHOLAY', tag: '70mm STEREOPHONIC SOUND', bg: '#8b1e16', text: '#fcd34d' },
      { title: 'D.D.L.J.', tag: 'COME FALL IN LOVE', bg: '#1e3a5f', text: '#ffffff' },
      { title: '3 IDIOTS', tag: 'ALL IZZ WELL', bg: '#2b580c', text: '#fde047' },
    ]

    return movies.map(m => {
      const canvas = document.createElement('canvas')
      canvas.width = 512
      canvas.height = 768
      const ctx = canvas.getContext('2d')!

      ctx.fillStyle = m.bg
      ctx.fillRect(0, 0, 512, 768)

      ctx.strokeStyle = '#d4af37'
      ctx.lineWidth = 14
      ctx.strokeRect(20, 20, 472, 728)

      ctx.fillStyle = '#ffffff'
      ctx.font = 'bold 36px sans-serif'
      ctx.textAlign = 'center'
      ctx.fillText('NOW SHOWING', 256, 120)

      ctx.fillStyle = m.text
      ctx.font = '900 68px "DM Mono", Impact, sans-serif'
      ctx.fillText(m.title, 256, 380)

      ctx.fillStyle = '#f3f4f6'
      ctx.font = 'bold 28px sans-serif'
      ctx.fillText(m.tag, 256, 460)

      ctx.fillStyle = '#d4af37'
      ctx.font = '24px monospace'
      ctx.fillText('NEELAM THEATRE · 4 SHOWS DAILY', 256, 680)

      const tex = new THREE.CanvasTexture(canvas)
      tex.colorSpace = THREE.SRGBColorSpace
      return tex
    })
  }, [])

  return (
    <group position={[-42, 0, -34]} rotation={[0, Math.PI / 4, 0]}>
      {/* Main Brutalist Building Mass with Béton Brut Formwork */}
      <mesh position={[0, 7.5, 0]} castShadow receiveShadow>
        <boxGeometry args={[26, 15, 20]} />
        <meshStandardMaterial
          color="#a39d91"
          map={beton.diffuse}
          bumpMap={beton.bump}
          bumpScale={0.06}
          roughness={0.92}
        />
      </mesh>

      {/* Stepped Brick Parapet / Attic Tower */}
      <mesh position={[0, 16.2, 0]} castShadow>
        <boxGeometry args={[22, 2.4, 16]} />
        <meshStandardMaterial
          color="#9c3826"
          map={brick.diffuse}
          bumpMap={brick.bump}
          bumpScale={0.08}
          roughness={0.85}
        />
      </mesh>
      <mesh position={[0, 18, 0]} castShadow>
        <boxGeometry args={[14, 1.4, 10]} />
        <meshStandardMaterial
          color="#9e998d"
          bumpMap={beton.bump}
          bumpScale={0.04}
          roughness={0.9}
        />
      </mesh>

      {/* Deep Board-Marked Concrete Recesses */}
      <mesh position={[0, 10, 10.05]} castShadow>
        <boxGeometry args={[24, 6, 0.4]} />
        <meshStandardMaterial
          color="#7d786d"
          bumpMap={beton.bump}
          bumpScale={0.05}
          roughness={0.95}
        />
      </mesh>

      {/* Cantilevered Canopy / Portico */}
      <mesh position={[0, 4.6, 13.5]} castShadow receiveShadow>
        <boxGeometry args={[22, 0.65, 8]} />
        <meshStandardMaterial
          color="#b8b2a3"
          bumpMap={beton.bump}
          bumpScale={0.04}
          roughness={0.88}
        />
      </mesh>

      {/* Under-Canopy Recessed Downlights illuminating entrance steps */}
      {[-6, -2, 2, 6].map(x => (
        <group key={`downlight-${x}`} position={[x, 4.25, 13.5]}>
          <mesh>
            <cylinderGeometry args={[0.2, 0.2, 0.05, 12]} />
            <meshStandardMaterial
              color="#fff8db"
              emissive="#ffd17b"
              emissiveIntensity={night ? 3.5 : 0.4}
            />
          </mesh>
        </group>
      ))}

      {/* Slanted Concrete Support Brackets */}
      {[-8, -2.8, 2.8, 8].map((x, i) => (
        <mesh key={i} position={[x, 3.8, 11]} rotation={[-0.4, 0, 0]} castShadow>
          <boxGeometry args={[0.55, 2.2, 3.8]} />
          <meshStandardMaterial
            color="#8e897d"
            bumpMap={beton.bump}
            bumpScale={0.04}
            roughness={0.9}
          />
        </mesh>
      ))}

      {/* Illuminated NEELAM Marquee Sign */}
      <mesh position={[0, 6.2, 16.8]}>
        <planeGeometry args={[16, 2.8]} />
        <meshStandardMaterial
          map={neelamSignTexture}
          emissive="#ff2a3b"
          emissiveIntensity={night ? 3.2 : 0.8}
          toneMapped={false}
        />
      </mesh>

      {/* Grand Entrance Steps in Terracotta/Sandstone */}
      <group position={[0, 0, 10]}>
        {[0, 1, 2, 3].map(step => (
          <mesh key={step} position={[0, step * 0.22, step * 0.7]} receiveShadow>
            <boxGeometry args={[24 - step * 0.8, 0.24, 1.2]} />
            <meshStandardMaterial
              color={step % 2 === 0 ? '#8a8377' : '#965243'}
              bumpMap={beton.bump}
              bumpScale={0.02}
              roughness={0.88}
            />
          </mesh>
        ))}
      </group>

      {/* Glass Entrance Doors & Pillars */}
      <group position={[0, 2.2, 9.9]}>
        {[-8, -4, 0, 4, 8].map((x, i) => (
          <mesh key={`pillar-${i}`} position={[x, 0, 0]} castShadow>
            <boxGeometry args={[0.6, 3.8, 0.6]} />
            <meshStandardMaterial color="#3a3c3b" roughness={0.4} metalness={0.5} />
          </mesh>
        ))}
        {[-6, -2, 2, 6].map((x, i) => (
          <mesh key={`glass-${i}`} position={[x, 0, 0]}>
            <boxGeometry args={[3.2, 3.5, 0.1]} />
            <meshStandardMaterial
              color="#2a3f45"
              metalness={0.8}
              roughness={0.1}
              transparent
              opacity={0.8}
              emissive="#ffbe76"
              emissiveIntensity={night ? 0.45 : 0.08}
            />
          </mesh>
        ))}
      </group>

      {/* Vintage Movie Poster Marquees */}
      {[-8, 0, 8].map((x, i) => (
        <group key={`poster-${i}`} position={[x, 3.2, 17.4]}>
          <mesh castShadow>
            <boxGeometry args={[2.8, 3.8, 0.16]} />
            <meshStandardMaterial color="#2d2826" metalness={0.5} roughness={0.5} />
          </mesh>
          <mesh position={[0, 0, 0.09]}>
            <planeGeometry args={[2.5, 3.5]} />
            <meshStandardMaterial
              map={posterTextures[i]}
              emissive="#ffffff"
              emissiveIntensity={night ? 0.6 : 0.15}
            />
          </mesh>
        </group>
      ))}

      {/* Ticket Counter Booth */}
      <group position={[11, 1.2, 12]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[2.6, 2.4, 2.6]} />
          <meshStandardMaterial
            color="#7a7368"
            bumpMap={beton.bump}
            bumpScale={0.03}
            roughness={0.9}
          />
        </mesh>
        <mesh position={[0, 0.3, 1.32]}>
          <planeGeometry args={[1.8, 0.9]} />
          <meshStandardMaterial color="#1e293b" metalness={0.85} roughness={0.15} />
        </mesh>
        {/* Ticket window glow */}
        <mesh position={[0, 1.4, 1.32]}>
          <planeGeometry args={[2.2, 0.4]} />
          <meshStandardMaterial color="#d97706" emissive="#d97706" emissiveIntensity={night ? 1.5 : 0.3} />
        </mesh>
      </group>
    </group>
  )
}
