import { useMemo } from 'react'
import * as THREE from 'three'

export type TurbanStyle = 'patiala' | 'royal' | 'morni' | 'dumalla'

export interface PunjabiTurbanProps {
  style?: TurbanStyle
  color?: string
  fiftyColor?: string
  scale?: number
  hasKalgi?: boolean
  hasBeard?: boolean
  beardColor?: string
}













export function PunjabiTurban({
  style = 'patiala',
  color = '#b81d24', 
  fiftyColor = '#f5eedb', 
  scale = 1.0,
  hasKalgi = false,
}: PunjabiTurbanProps) {
  
  const clothTexture = useMemo(() => {
    const size = 512
    const canvas = document.createElement('canvas')
    canvas.width = size
    canvas.height = size
    const ctx = canvas.getContext('2d')!

    ctx.fillStyle = '#808080'
    ctx.fillRect(0, 0, size, size)

    
    ctx.fillStyle = '#9c9c9c'
    for (let x = 0; x < size; x += 4) {
      for (let y = 0; y < size; y += 4) {
        if ((x * 2 + y) % 8 === 0) {
          ctx.fillRect(x, y, 2, 2)
        }
      }
    }

    
    ctx.fillStyle = '#6a6a6a'
    for (let i = 0; i < size; i += 8) {
      ctx.fillRect(0, i, size, 1)
      ctx.fillRect(i, 0, 1, size)
    }

    const tex = new THREE.CanvasTexture(canvas)
    tex.wrapS = THREE.RepeatWrapping
    tex.wrapT = THREE.RepeatWrapping
    tex.repeat.set(8, 8)
    return tex
  }, [])

  const showKalgi = hasKalgi || style === 'royal'

  return (
    <group scale={[scale, scale, scale]}>
       
       
       
       
      <group position={[0, 0.118, 0.098]} rotation={[-0.22, 0, 0]}>
         
        <mesh position={[-0.035, -0.004, 0]} rotation={[0, 0, 0.28]} castShadow>
          <boxGeometry args={[0.07, 0.016, 0.008]} />
          <meshStandardMaterial
            color={fiftyColor}
            roughness={0.92}
            bumpMap={clothTexture}
            bumpScale={0.012}
          />
        </mesh>
         
        <mesh position={[0.035, -0.004, 0]} rotation={[0, 0, -0.28]} castShadow>
          <boxGeometry args={[0.07, 0.016, 0.008]} />
          <meshStandardMaterial
            color={fiftyColor}
            roughness={0.92}
            bumpMap={clothTexture}
            bumpScale={0.012}
          />
        </mesh>
         
        <mesh position={[0, 0.004, 0.002]} rotation={[0, 0, Math.PI / 4]}>
          <boxGeometry args={[0.014, 0.014, 0.009]} />
          <meshStandardMaterial
            color={fiftyColor}
            roughness={0.92}
            bumpMap={clothTexture}
            bumpScale={0.012}
          />
        </mesh>
      </group>

       
       
       
       
      <mesh position={[0, 0.158, 0.005]} scale={[1.12, 0.78, 1.2]} castShadow>
        <sphereGeometry args={[0.096, 24, 18]} />
        <meshStandardMaterial
          color={color}
          roughness={0.88}
          bumpMap={clothTexture}
          bumpScale={0.016}
        />
      </mesh>

       
      <mesh position={[0, 0.138, 0.088]} scale={[1.05, 0.45, 0.4]} castShadow>
        <sphereGeometry args={[0.075, 16, 12]} />
        <meshStandardMaterial
          color={color}
          roughness={0.88}
          bumpMap={clothTexture}
          bumpScale={0.015}
        />
      </mesh>

       
       
       
       
      {style !== 'dumalla' && (
        <group>
           
          <group
            position={[-0.01, 0.128, 0.024]}
            rotation={[
              style === 'morni' ? 0.28 : 0.22,
              -0.16,
              style === 'morni' ? 0.18 : 0.14,
            ]}
          >
            <mesh scale={[1.18, 0.55, 1.14]} castShadow receiveShadow>
              <torusGeometry args={[0.096, 0.022, 16, 36]} />
              <meshStandardMaterial
                color={color}
                roughness={0.84}
                bumpMap={clothTexture}
                bumpScale={0.02}
              />
            </mesh>
          </group>

           
          <group
            position={[0.012, 0.146, 0.02]}
            rotation={[0.18, 0.18, style === 'morni' ? -0.18 : -0.14]}
          >
            <mesh scale={[1.2, 0.55, 1.14]} castShadow receiveShadow>
              <torusGeometry args={[0.098, 0.022, 16, 36]} />
              <meshStandardMaterial
                color={color}
                roughness={0.84}
                bumpMap={clothTexture}
                bumpScale={0.02}
              />
            </mesh>
          </group>

           
          <group
            position={[-0.012, 0.164, 0.014]}
            rotation={[
              style === 'morni' ? 0.22 : 0.16,
              -0.2,
              style === 'morni' ? 0.2 : 0.16,
            ]}
          >
            <mesh scale={[1.22, 0.55, 1.14]} castShadow receiveShadow>
              <torusGeometry args={[0.099, 0.022, 16, 36]} />
              <meshStandardMaterial
                color={color}
                roughness={0.84}
                bumpMap={clothTexture}
                bumpScale={0.02}
              />
            </mesh>
          </group>

           
          <group
            position={[0.012, 0.182, 0.008]}
            rotation={[0.13, 0.18, style === 'morni' ? -0.16 : -0.13]}
          >
            <mesh scale={[1.2, 0.55, 1.14]} castShadow receiveShadow>
              <torusGeometry args={[0.097, 0.021, 16, 36]} />
              <meshStandardMaterial
                color={color}
                roughness={0.84}
                bumpMap={clothTexture}
                bumpScale={0.02}
              />
            </mesh>
          </group>

           
          <group
            position={[-0.01, 0.198, 0.002]}
            rotation={[0.1, -0.16, style === 'morni' ? 0.16 : 0.12]}
          >
            <mesh scale={[1.18, 0.55, 1.14]} castShadow receiveShadow>
              <torusGeometry args={[0.095, 0.02, 16, 36]} />
              <meshStandardMaterial
                color={color}
                roughness={0.84}
                bumpMap={clothTexture}
                bumpScale={0.02}
              />
            </mesh>
          </group>

           
          <group position={[0.006, 0.212, -0.005]} rotation={[0.06, 0.1, -0.08]}>
            <mesh scale={[1.14, 0.52, 1.12]} castShadow receiveShadow>
              <torusGeometry args={[0.092, 0.019, 16, 36]} />
              <meshStandardMaterial
                color={color}
                roughness={0.84}
                bumpMap={clothTexture}
                bumpScale={0.02}
              />
            </mesh>
          </group>

           
           
           
           
          <group position={[0.052, 0.162, 0.012]} rotation={[-0.04, 0.14, -0.18]}>
            <mesh scale={[0.42, 1.15, 1.3]} castShadow>
              <sphereGeometry args={[0.092, 18, 14]} />
              <meshStandardMaterial
                color={color}
                roughness={0.86}
                bumpMap={clothTexture}
                bumpScale={0.018}
              />
            </mesh>
          </group>

           
           
           
           
          <mesh
            position={[0, 0.134, 0.1]}
            rotation={[style === 'morni' ? -0.38 : -0.28, 0, 0]}
            scale={[0.36, style === 'morni' ? 1.05 : 0.76, 0.35]}
            castShadow
          >
            <coneGeometry args={[0.03, 0.064, 16]} />
            <meshStandardMaterial
              color={color}
              roughness={0.83}
              bumpMap={clothTexture}
              bumpScale={0.022}
            />
          </mesh>
        </group>
      )}

       
       
       
      {style === 'dumalla' && (
        <group>
          {Array.from({ length: 6 }).map((_, i) => (
            <mesh
              key={i}
              position={[0, 0.13 + i * 0.02, 0.012 - i * 0.003]}
              scale={[1 - i * 0.03, 0.65, 1 - i * 0.03]}
              castShadow
            >
              <torusGeometry args={[0.098 - i * 0.003, 0.022, 14, 32]} />
              <meshStandardMaterial
                color={color}
                roughness={0.88}
                bumpMap={clothTexture}
                bumpScale={0.02}
              />
            </mesh>
          ))}
           
          <mesh position={[0, 0.195, 0.022]} rotation={[Math.PI / 2.3, 0, 0]} castShadow>
            <torusGeometry args={[0.082, 0.0045, 8, 36]} />
            <meshStandardMaterial
              color="#dcdcdc"
              metalness={0.92}
              roughness={0.18}
            />
          </mesh>
           
          <mesh position={[0, 0.265, 0.005]} rotation={[-0.2, 0, 0]} castShadow>
            <boxGeometry args={[0.048, 0.085, 0.01]} />
            <meshStandardMaterial
              color={color}
              roughness={0.9}
              bumpMap={clothTexture}
            />
          </mesh>
        </group>
      )}

       
       
       
       
      <mesh
        position={[0, style === 'dumalla' ? 0.245 : 0.218, -0.012]}
        scale={[1.18, style === 'dumalla' ? 0.65 : 0.38, 1.2]}
        castShadow
      >
        <sphereGeometry args={[0.092, 22, 16]} />
        <meshStandardMaterial
          color={color}
          roughness={0.87}
          bumpMap={clothTexture}
          bumpScale={0.02}
        />
      </mesh>

       
      <mesh
        position={[0, style === 'dumalla' ? 0.258 : 0.23, -0.012]}
        rotation={[Math.PI / 2, 0, 0]}
      >
        <cylinderGeometry args={[0.0025, 0.0025, 0.13, 8]} />
        <meshStandardMaterial color={color} roughness={0.95} />
      </mesh>

       
       
       
       
      <group position={[0, 0.078, -0.088]} rotation={[0.26, 0, 0]}>
         
        <mesh scale={[0.85, 0.58, 0.72]} castShadow>
          <boxGeometry args={[0.082, 0.075, 0.032]} />
          <meshStandardMaterial
            color={color}
            roughness={0.92}
            bumpMap={clothTexture}
            bumpScale={0.02}
          />
        </mesh>
         
        <mesh position={[0, -0.042, 0.006]} rotation={[0.1, 0, 0]} castShadow>
          <boxGeometry args={[0.062, 0.055, 0.011]} />
          <meshStandardMaterial
            color={color}
            roughness={0.94}
            bumpMap={clothTexture}
            bumpScale={0.015}
          />
        </mesh>
      </group>

       
       
       
      {showKalgi && (
        <group position={[0, 0.182, 0.104]} rotation={[-0.18, 0, 0]}>
           
          <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
            <cylinderGeometry args={[0.014, 0.016, 0.005, 18]} />
            <meshStandardMaterial
              color="#ffcc00"
              metalness={0.92}
              roughness={0.16}
            />
          </mesh>

           
          {Array.from({ length: 10 }).map((_, i) => {
            const angle = (i / 10) * Math.PI * 2
            return (
              <mesh
                key={i}
                position={[Math.cos(angle) * 0.016, Math.sin(angle) * 0.016, 0.003]}
              >
                <sphereGeometry args={[0.0022, 8, 8]} />
                <meshStandardMaterial
                  color="#ffffff"
                  roughness={0.2}
                  metalness={0.1}
                />
              </mesh>
            )
          })}

           
          <mesh position={[0, 0, 0.004]} scale={[0.85, 1.1, 0.6]}>
            <sphereGeometry args={[0.0075, 14, 10]} />
            <meshStandardMaterial
              color="#d90429"
              roughness={0.08}
              metalness={0.3}
            />
          </mesh>

           
          <group position={[0, -0.02, 0.003]}>
            <mesh>
              <sphereGeometry args={[0.0038, 10, 10]} />
              <meshStandardMaterial
                color="#ffffff"
                roughness={0.15}
                metalness={0.1}
              />
            </mesh>
            <mesh position={[0, 0.005, 0]}>
              <cylinderGeometry args={[0.0008, 0.0008, 0.007, 6]} />
              <meshStandardMaterial color="#ffcc00" metalness={0.9} />
            </mesh>
          </group>

           
          <group position={[0, 0.022, 0.002]} rotation={[0, 0, 0.08]}>
             
            <mesh position={[0, 0.026, 0]}>
              <cylinderGeometry args={[0.0013, 0.002, 0.055, 8]} />
              <meshStandardMaterial
                color="#ffd700"
                metalness={0.9}
                roughness={0.2}
              />
            </mesh>
             
            <mesh position={[0.003, 0.03, -0.002]} rotation={[0, 0, 0.12]}>
              <coneGeometry args={[0.011, 0.058, 10]} />
              <meshStandardMaterial
                color="#fff8e7"
                roughness={0.8}
                metalness={0.1}
              />
            </mesh>
             
            <mesh position={[0.005, 0.056, 0]}>
              <sphereGeometry args={[0.0022, 8, 8]} />
              <meshStandardMaterial color="#ffd700" metalness={0.95} />
            </mesh>
          </group>
        </group>
      )}
    </group>
  )
}
