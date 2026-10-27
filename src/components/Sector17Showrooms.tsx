import { useMemo } from 'react'
import * as THREE from 'three'
import { textures } from './TextureGenerator'
import { useCharacterShopStore } from './CharacterAndShopStore'

interface Sector17ShowroomsProps {
  night: boolean
}









export function Sector17Showrooms({ night }: Sector17ShowroomsProps) {
  const beton = useMemo(() => textures.getBetonBrutTexture(), [])
  const openShop = useCharacterShopStore((s) => s.openShop)

  
  const nikeSign = useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 512
    canvas.height = 160
    const ctx = canvas.getContext('2d')!

    ctx.fillStyle = '#111111'
    ctx.fillRect(0, 0, 512, 160)

    
    ctx.strokeStyle = '#ff5500'
    ctx.lineWidth = 6
    ctx.strokeRect(6, 6, 500, 148)

    
    ctx.fillStyle = '#ff5500'
    ctx.beginPath()
    ctx.moveTo(80, 85)
    ctx.bezierCurveTo(120, 80, 170, 45, 230, 25)
    ctx.bezierCurveTo(180, 65, 140, 95, 105, 115)
    ctx.bezierCurveTo(90, 122, 75, 120, 70, 110)
    ctx.bezierCurveTo(65, 100, 72, 90, 80, 85)
    ctx.fill()

    
    ctx.font = '900 68px "Arial Black", "DM Mono", Impact, sans-serif'
    ctx.fillStyle = '#ffffff'
    ctx.textAlign = 'left'
    ctx.fillText('NIKE', 245, 90)

    ctx.font = 'bold 18px "DM Mono", monospace'
    ctx.fillStyle = '#ff5500'
    ctx.fillText('FLAGSHIP SHOWROOM · SECTOR 17-C', 245, 125)

    const tex = new THREE.CanvasTexture(canvas)
    tex.colorSpace = THREE.SRGBColorSpace
    return tex
  }, [])

  
  const adidasSign = useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 512
    canvas.height = 160
    const ctx = canvas.getContext('2d')!

    ctx.fillStyle = '#005f73'
    ctx.fillRect(0, 0, 512, 160)

    ctx.strokeStyle = '#94d2bd'
    ctx.lineWidth = 6
    ctx.strokeRect(6, 6, 500, 148)

    
    ctx.fillStyle = '#ffffff'
    ctx.beginPath()
    ctx.ellipse(100, 75, 22, 42, -0.4, 0, Math.PI * 2)
    ctx.fill()
    ctx.beginPath()
    ctx.ellipse(140, 65, 24, 46, 0, 0, Math.PI * 2)
    ctx.fill()
    ctx.beginPath()
    ctx.ellipse(180, 75, 22, 42, 0.4, 0, Math.PI * 2)
    ctx.fill()

    ctx.font = 'bold 54px "Arial Black", "DM Mono", sans-serif'
    ctx.fillStyle = '#ffffff'
    ctx.fillText('adidas', 240, 85)

    ctx.font = 'bold 20px "DM Mono", monospace'
    ctx.fillStyle = '#94d2bd'
    ctx.fillText('ORIGINALS · SECTOR 17-C', 240, 122)

    const tex = new THREE.CanvasTexture(canvas)
    tex.colorSpace = THREE.SRGBColorSpace
    return tex
  }, [])

  
  const reebokSign = useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 512
    canvas.height = 160
    const ctx = canvas.getContext('2d')!

    ctx.fillStyle = '#0a192f'
    ctx.fillRect(0, 0, 512, 160)

    ctx.strokeStyle = '#e63946'
    ctx.lineWidth = 6
    ctx.strokeRect(6, 6, 500, 148)

    
    ctx.fillStyle = '#e63946'
    ctx.beginPath()
    ctx.moveTo(60, 45)
    ctx.lineTo(130, 80)
    ctx.lineTo(130, 105)
    ctx.lineTo(60, 70)
    ctx.closePath()
    ctx.fill()

    ctx.beginPath()
    ctx.moveTo(130, 80)
    ctx.lineTo(200, 45)
    ctx.lineTo(200, 70)
    ctx.lineTo(130, 105)
    ctx.closePath()
    ctx.fill()

    
    ctx.fillStyle = '#457b9d'
    ctx.beginPath()
    ctx.moveTo(90, 85)
    ctx.lineTo(170, 85)
    ctx.lineTo(190, 120)
    ctx.lineTo(70, 120)
    ctx.closePath()
    ctx.fill()

    ctx.font = '900 58px "Arial Black", "DM Mono", Impact, sans-serif'
    ctx.fillStyle = '#ffffff'
    ctx.fillText('Reebok', 225, 88)

    ctx.font = 'bold 18px "DM Mono", monospace'
    ctx.fillStyle = '#e63946'
    ctx.fillText('CLASSIC & HERITAGE · SECTOR 17', 225, 124)

    const tex = new THREE.CanvasTexture(canvas)
    tex.colorSpace = THREE.SRGBColorSpace
    return tex
  }, [])

  
  const skechersSign = useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 512
    canvas.height = 160
    const ctx = canvas.getContext('2d')!

    ctx.fillStyle = '#0f172a'
    ctx.fillRect(0, 0, 512, 160)

    ctx.strokeStyle = '#06b6d4'
    ctx.lineWidth = 6
    ctx.strokeRect(6, 6, 500, 148)

    
    ctx.fillStyle = '#06b6d4'
    ctx.beginPath()
    ctx.ellipse(125, 80, 45, 50, 0, 0, Math.PI * 2)
    ctx.fill()

    ctx.fillStyle = '#0f172a'
    ctx.beginPath()
    ctx.ellipse(125, 80, 28, 32, 0, 0, Math.PI * 2)
    ctx.fill()

    ctx.fillStyle = '#ffffff'
    ctx.font = 'italic 900 60px "Arial Black", sans-serif'
    ctx.fillText('S', 105, 102)

    
    ctx.font = 'italic 900 52px "Arial Black", sans-serif'
    ctx.fillStyle = '#ffffff'
    ctx.fillText('SKECHERS', 200, 88)

    ctx.font = 'bold 18px "DM Mono", monospace'
    ctx.fillStyle = '#38bdf8'
    ctx.fillText('COMFORT INCLUDED · SECTOR 17', 200, 124)

    const tex = new THREE.CanvasTexture(canvas)
    tex.colorSpace = THREE.SRGBColorSpace
    return tex
  }, [])

  return (
    <group position={[-2, 0, -32]}>
       
       
       
       
      <mesh position={[0, 6.6, 0]} castShadow receiveShadow>
        <boxGeometry args={[34, 4.4, 9.6]} />
        <meshStandardMaterial
          map={beton.diffuse}
          bumpMap={beton.bump}
          roughness={0.9}
          metalness={0.1}
          color="#d2d5d8"
        />
      </mesh>

       
      <mesh position={[0, 2.2, -1.8]} castShadow receiveShadow>
        <boxGeometry args={[34, 4.4, 6.0]} />
        <meshStandardMaterial color="#1a1d20" roughness={0.7} />
      </mesh>

       
      {[-14, -10, -6, -2, 2, 6, 10, 14].map((lx, idx) => (
        <mesh key={idx} position={[lx, 6.8, 5.0]} castShadow>
          <boxGeometry args={[0.2, 3.6, 0.8]} />
          <meshStandardMaterial map={beton.diffuse} bumpMap={beton.bump} color="#c8cbce" />
        </mesh>
      ))}

       
      {[-15, -9, -3, 3, 9, 15].map((px, idx) => (
        <group key={idx} position={[px, 2.2, 4.2]}>
          <mesh castShadow receiveShadow>
            <cylinderGeometry args={[0.38, 0.42, 4.4, 20]} />
            <meshStandardMaterial map={beton.diffuse} bumpMap={beton.bump} color="#d5d8dc" roughness={0.88} />
          </mesh>
           
          <mesh position={[0, 2.1, 0]}>
            <boxGeometry args={[1.0, 0.2, 1.0]} />
            <meshStandardMaterial map={beton.diffuse} bumpMap={beton.bump} color="#c8cbce" />
          </mesh>
        </group>
      ))}

       
      <mesh position={[0, 0.02, 2.2]} receiveShadow>
        <planeGeometry args={[34, 4.5]} />
        <meshStandardMaterial color="#475569" roughness={0.4} metalness={0.2} />
      </mesh>

       
       
       
      <group position={[-8.5, 0, 1.2]}>
         
        <mesh position={[0, 4.15, -0.05]}>
          <planeGeometry args={[8.0, 1.8]} />
          <meshBasicMaterial map={nikeSign} />
        </mesh>

         
        <mesh position={[0, 1.8, 0]}>
          <boxGeometry args={[7.8, 3.4, 0.08]} />
          <meshPhysicalMaterial
            color="#ffffff"
            transmission={0.9}
            opacity={0.3}
            transparent
            roughness={0.08}
            metalness={0.1}
          />
        </mesh>

         
        <mesh position={[0, 3.5, 0.02]}>
          <boxGeometry args={[7.8, 0.08, 0.08]} />
          <meshStandardMaterial color="#111111" />
        </mesh>
        {[-3.9, -1.3, 1.3, 3.9].map((mullionX, i) => (
          <mesh key={i} position={[mullionX, 1.8, 0.02]}>
            <boxGeometry args={[0.08, 3.4, 0.08]} />
            <meshStandardMaterial color="#111111" />
          </mesh>
        ))}

         
        <mesh position={[0, 0.03, -1.8]} receiveShadow>
          <planeGeometry args={[7.8, 3.6]} />
          <meshStandardMaterial color="#22252a" roughness={0.3} metalness={0.3} />
        </mesh>

         
        <mesh position={[0, 2.4, -3.5]}>
          <boxGeometry args={[3.8, 0.5, 0.04]} />
          <meshStandardMaterial
            color="#ff5500"
            emissive="#ff5500"
            emissiveIntensity={night ? 2.5 : 0.8}
          />
        </mesh>

         
         
         
        <group position={[-2.2, 0.8, -1.5]}>
           
          <mesh position={[0, 1.0, 0]}>
            <boxGeometry args={[2.8, 2.2, 0.1]} />
            <meshStandardMaterial color="#181a1e" roughness={0.6} />
          </mesh>

           
          {[0.2, 0.7, 1.2, 1.7].map((shelfY, sIdx) => {
            const sneakerColors = [
              { base: '#d90429', accent: '#ffffff' }, 
              { base: '#1e293b', accent: '#00f5d4' }, 
              { base: '#43281c', accent: '#f5ebe0' }, 
              { base: '#0077b6', accent: '#ffffff' }, 
            ]
            const col = sneakerColors[sIdx % sneakerColors.length]
            return (
              <group key={sIdx} position={[0, shelfY, 0.1]}>
                 
                <mesh position={[0, 0, 0.15]}>
                  <boxGeometry args={[2.5, 0.04, 0.35]} />
                  <meshStandardMaterial
                    color="#ffffff"
                    emissive="#ffffff"
                    emissiveIntensity={night ? 0.8 : 0.2}
                  />
                </mesh>

                 
                {[-0.75, 0, 0.75].map((shoeX, shoeIdx) => (
                  <group
                    key={shoeIdx}
                    position={[shoeX, 0.08, 0.15]}
                    rotation={[0, 0.25, 0]}
                  >
                     
                    <mesh position={[0, 0.02, 0]}>
                      <boxGeometry args={[0.26, 0.035, 0.1]} />
                      <meshStandardMaterial color="#ffffff" roughness={0.3} />
                    </mesh>
                     
                    <mesh position={[0, 0.065, 0]}>
                      <boxGeometry args={[0.25, 0.055, 0.095]} />
                      <meshStandardMaterial color={col.base} roughness={0.6} />
                    </mesh>
                     
                    <mesh position={[-0.04, 0.11, 0]}>
                      <boxGeometry args={[0.13, 0.065, 0.09]} />
                      <meshStandardMaterial color={col.accent} roughness={0.6} />
                    </mesh>
                     
                    <mesh position={[0, 0.065, 0.052]}>
                      <boxGeometry args={[0.14, 0.018, 0.01]} />
                      <meshStandardMaterial color={col.accent} />
                    </mesh>
                  </group>
                ))}
              </group>
            )
          })}
        </group>

         
        <group position={[1.8, 0, -1.0]} rotation={[0, -0.4, 0]}>
           
          <mesh position={[0, 0.03, 0]}>
            <cylinderGeometry args={[0.3, 0.3, 0.04, 16]} />
            <meshStandardMaterial color="#444444" metalness={0.8} />
          </mesh>
           
          <mesh position={[0, 1.1, 0]} castShadow>
            <cylinderGeometry args={[0.18, 0.15, 0.75, 12]} />
            <meshStandardMaterial color="#d90429" />
          </mesh>
           
          <mesh position={[0, 1.25, 0.16]}>
            <boxGeometry args={[0.12, 0.14, 0.01]} />
            <meshStandardMaterial color="#ffffff" />
          </mesh>
           
          <mesh position={[0, 0.65, 0]}>
            <cylinderGeometry args={[0.2, 0.22, 0.45, 12]} />
            <meshStandardMaterial color="#111111" />
          </mesh>
           
          <mesh position={[0, 1.55, 0]}>
            <cylinderGeometry args={[0.08, 0.1, 0.2, 12]} />
            <meshStandardMaterial color="#2b2d42" metalness={0.7} />
          </mesh>
        </group>

         
        <group position={[0, 1.2, 0.1]} onClick={() => openShop('nike')}>
          <mesh>
            <boxGeometry args={[2.2, 0.45, 0.05]} />
            <meshStandardMaterial
              color="#ff5500"
              emissive="#ff5500"
              emissiveIntensity={night ? 1.8 : 0.8}
            />
          </mesh>
        </group>

         
        <pointLight
          position={[0, 3.2, -1.5]}
          color="#ffb703"
          intensity={night ? 25 : 8}
          distance={10}
        />
      </group>

       
       
       
      <group position={[-0.5, 0, 1.2]}>
         
        <mesh position={[0, 4.15, -0.05]}>
          <planeGeometry args={[8.0, 1.8]} />
          <meshBasicMaterial map={adidasSign} />
        </mesh>

         
        <mesh position={[0, 1.8, 0]}>
          <boxGeometry args={[7.8, 3.4, 0.08]} />
          <meshPhysicalMaterial
            color="#ffffff"
            transmission={0.9}
            opacity={0.3}
            transparent
            roughness={0.08}
          />
        </mesh>

         
        <mesh position={[0, 3.5, 0.02]}>
          <boxGeometry args={[7.8, 0.08, 0.08]} />
          <meshStandardMaterial color="#005f73" />
        </mesh>

         
        <group position={[-1.8, 0, -1.2]} rotation={[0, 0.3, 0]}>
          <mesh position={[0, 1.05, 0]} castShadow>
            <cylinderGeometry args={[0.2, 0.16, 0.8, 12]} />
            <meshStandardMaterial color="#005f73" />
          </mesh>
          <mesh position={[-0.22, 1.05, 0]} rotation={[0, 0, 0.2]}>
            <boxGeometry args={[0.04, 0.65, 0.08]} />
            <meshStandardMaterial color="#ffffff" />
          </mesh>
          <mesh position={[0.22, 1.05, 0]} rotation={[0, 0, -0.2]}>
            <boxGeometry args={[0.04, 0.65, 0.08]} />
            <meshStandardMaterial color="#ffffff" />
          </mesh>
        </group>

         
        {[-0.6, 0.8, 2.2].map((podiumX, pIdx) => (
          <group key={pIdx} position={[podiumX, 0, -1.3]}>
            <mesh position={[0, 0.45, 0]} castShadow>
              <cylinderGeometry args={[0.38, 0.42, 0.9, 16]} />
              <meshStandardMaterial color="#0f172a" roughness={0.3} />
            </mesh>
             
            <mesh position={[0, 0.95, 0]} rotation={[0, 0.35, 0]}>
              <boxGeometry args={[0.28, 0.08, 0.12]} />
              <meshStandardMaterial color={pIdx === 0 ? '#ffffff' : pIdx === 1 ? '#0f172a' : '#38bdf8'} />
            </mesh>
          </group>
        ))}

         
        <group position={[0, 1.2, 0.1]} onClick={() => openShop('adidas')}>
          <mesh>
            <boxGeometry args={[2.2, 0.45, 0.05]} />
            <meshStandardMaterial
              color="#0284c7"
              emissive="#0284c7"
              emissiveIntensity={night ? 1.8 : 0.8}
            />
          </mesh>
        </group>

        <pointLight
          position={[0, 3.2, -1.5]}
          color="#94d2bd"
          intensity={night ? 25 : 8}
          distance={10}
        />
      </group>

       
       
       
      <group position={[7.5, 0, 1.2]}>
         
        <mesh position={[0, 4.15, -0.05]}>
          <planeGeometry args={[8.0, 1.8]} />
          <meshBasicMaterial map={reebokSign} />
        </mesh>

         
        <mesh position={[0, 1.8, 0]}>
          <boxGeometry args={[7.8, 3.4, 0.08]} />
          <meshPhysicalMaterial
            color="#ffffff"
            transmission={0.9}
            opacity={0.3}
            transparent
            roughness={0.08}
          />
        </mesh>

         
        <mesh position={[0, 3.5, 0.02]}>
          <boxGeometry args={[7.8, 0.08, 0.08]} />
          <meshStandardMaterial color="#e63946" />
        </mesh>

         
        <group position={[0, 0, -1.4]}>
          <mesh position={[0, 0.5, 0]} castShadow>
            <boxGeometry args={[3.2, 1.0, 0.9]} />
            <meshStandardMaterial color="#1d3557" roughness={0.4} />
          </mesh>
           
          {[-0.8, 0, 0.8].map((rx, idx) => (
            <group key={idx} position={[rx, 1.06, 0]} rotation={[0, 0.3, 0]}>
              <mesh>
                <boxGeometry args={[0.26, 0.08, 0.11]} />
                <meshStandardMaterial color="#fefae0" roughness={0.5} />
              </mesh>
              <mesh position={[0, 0.02, 0.056]}>
                <boxGeometry args={[0.08, 0.02, 0.01]} />
                <meshStandardMaterial color="#2d6a4f" />
              </mesh>
            </group>
          ))}
        </group>

         
        <group position={[0, 1.2, 0.1]} onClick={() => openShop('reebok')}>
          <mesh>
            <boxGeometry args={[2.2, 0.45, 0.05]} />
            <meshStandardMaterial
              color="#e63946"
              emissive="#e63946"
              emissiveIntensity={night ? 1.8 : 0.8}
            />
          </mesh>
        </group>

        <pointLight
          position={[0, 3.2, -1.5]}
          color="#f4a261"
          intensity={night ? 25 : 8}
          distance={10}
        />
      </group>

       
       
       
      <group position={[15.5, 0, 1.2]}>
         
        <mesh position={[0, 4.15, -0.05]}>
          <planeGeometry args={[7.2, 1.8]} />
          <meshBasicMaterial map={skechersSign} />
        </mesh>

         
        <mesh position={[0, 1.8, 0]}>
          <boxGeometry args={[7.0, 3.4, 0.08]} />
          <meshPhysicalMaterial
            color="#ffffff"
            transmission={0.9}
            opacity={0.3}
            transparent
            roughness={0.08}
          />
        </mesh>

         
        <mesh position={[0, 3.5, 0.02]}>
          <boxGeometry args={[7.0, 0.08, 0.08]} />
          <meshStandardMaterial color="#06b6d4" />
        </mesh>

         
        <group position={[0, 0, -1.4]}>
          <mesh position={[0, 0.45, 0]} castShadow>
            <boxGeometry args={[3.2, 0.9, 1.1]} />
            <meshStandardMaterial color="#0f172a" roughness={0.5} />
          </mesh>
           
          {[-0.9, 0, 0.9].map((sx, idx) => (
            <mesh key={idx} position={[sx, 0.96, 0]} rotation={[0, 0.25, 0]}>
              <boxGeometry args={[0.27, 0.09, 0.12]} />
              <meshStandardMaterial color={idx === 0 ? '#1e293b' : idx === 1 ? '#0284c7' : '#ffffff'} />
            </mesh>
          ))}
        </group>

         
        <group position={[0, 1.2, 0.1]} onClick={() => openShop('skechers')}>
          <mesh>
            <boxGeometry args={[2.2, 0.45, 0.05]} />
            <meshStandardMaterial
              color="#06b6d4"
              emissive="#06b6d4"
              emissiveIntensity={night ? 1.8 : 0.8}
            />
          </mesh>
        </group>

        <pointLight
          position={[0, 3.2, -1.5]}
          color="#38bdf8"
          intensity={night ? 25 : 8}
          distance={10}
        />
      </group>
    </group>
  )
}
