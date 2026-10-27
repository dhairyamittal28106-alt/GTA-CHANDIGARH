import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface OpenHandProps {
  night: boolean
}

export function OpenHandMonument({ night }: OpenHandProps) {
  const handRef = useRef<THREE.Group>(null)

  
  const handGeometry = useMemo(() => {
    const shape = new THREE.Shape()

    
    shape.moveTo(-0.8, 0)
    shape.lineTo(0.8, 0)
    
    shape.quadraticCurveTo(1.4, 1.2, 1.5, 2.4)
    
    shape.lineTo(1.6, 3.8)
    shape.quadraticCurveTo(1.4, 4.3, 1.1, 4.2)
    shape.lineTo(0.9, 3.0)
    
    shape.lineTo(0.9, 4.7)
    shape.quadraticCurveTo(0.65, 5.1, 0.4, 4.9)
    shape.lineTo(0.3, 3.3)
    
    shape.lineTo(0.2, 5.4)
    shape.quadraticCurveTo(-0.05, 5.7, -0.3, 5.4)
    shape.lineTo(-0.35, 3.4)
    
    shape.lineTo(-0.5, 4.8)
    shape.quadraticCurveTo(-0.8, 5.0, -1.0, 4.6)
    shape.lineTo(-0.95, 3.0)
    
    shape.quadraticCurveTo(-1.6, 2.5, -2.4, 2.8)
    shape.quadraticCurveTo(-2.8, 2.6, -2.7, 2.0)
    shape.quadraticCurveTo(-2.2, 1.3, -1.3, 1.0)
    
    shape.quadraticCurveTo(-1.0, 0.4, -0.8, 0)

    const extrudeSettings = {
      depth: 0.28,
      bevelEnabled: true,
      bevelSegments: 4,
      steps: 1,
      bevelSize: 0.08,
      bevelThickness: 0.08,
    }

    const geo = new THREE.ExtrudeGeometry(shape, extrudeSettings)
    geo.center()
    return geo
  }, [])

  
  const plaqueTexture = useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 512
    canvas.height = 256
    const ctx = canvas.getContext('2d')!

    ctx.fillStyle = '#2b2621'
    ctx.fillRect(0, 0, 512, 256)

    ctx.strokeStyle = '#c5a059'
    ctx.lineWidth = 8
    ctx.strokeRect(12, 12, 488, 232)

    ctx.fillStyle = '#f4e5c3'
    ctx.font = 'bold 32px "DM Mono", sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText('THE OPEN HAND MONUMENT', 256, 75)

    ctx.font = '22px "DM Mono", monospace'
    ctx.fillStyle = '#dcd4be'
    ctx.fillText('LA MAIN OUVERTE · LE CORBUSIER', 256, 125)

    ctx.font = 'italic 20px Georgia, serif'
    ctx.fillStyle = '#f9ecc8'
    ctx.fillText('"Open to give, open to receive"', 256, 175)

    ctx.font = '16px "DM Mono", monospace'
    ctx.fillStyle = '#9c8e76'
    ctx.fillText('CHANDIGARH · THE CITY BEAUTIFUL', 256, 215)

    const tex = new THREE.CanvasTexture(canvas)
    tex.colorSpace = THREE.SRGBColorSpace
    return tex
  }, [])

  
  useFrame(({ clock }) => {
    if (handRef.current) {
      const t = clock.elapsedTime * 0.35
      
      handRef.current.rotation.y = Math.sin(t) * 0.8 + Math.cos(t * 0.4) * 0.3
    }
  })

  return (
    <group position={[36, 0, -28]}>
       
      <mesh position={[0, 0.08, 0]} receiveShadow>
        <cylinderGeometry args={[8.5, 9.2, 0.22, 32]} />
        <meshStandardMaterial color="#b3ada1" roughness={0.92} />
      </mesh>

       
      <mesh position={[0, 0.5, 0]} castShadow receiveShadow>
        <boxGeometry args={[5.2, 0.6, 5.2]} />
        <meshStandardMaterial color="#a39d91" roughness={0.9} />
      </mesh>
      <mesh position={[0, 1.1, 0]} castShadow receiveShadow>
        <boxGeometry args={[4.2, 0.6, 4.2]} />
        <meshStandardMaterial color="#8e897d" roughness={0.92} />
      </mesh>
      <mesh position={[0, 2.4, 0]} castShadow receiveShadow>
        <boxGeometry args={[2.2, 2.0, 2.2]} />
        <meshStandardMaterial color="#b2aba0" roughness={0.88} />
      </mesh>

       
      <mesh position={[0, 4.4, 0]} castShadow>
        <cylinderGeometry args={[0.22, 0.32, 2.2, 16]} />
        <meshStandardMaterial color="#495057" metalness={0.7} roughness={0.3} />
      </mesh>
      <mesh position={[0, 5.5, 0]} castShadow>
        <sphereGeometry args={[0.38, 16, 16]} />
        <meshStandardMaterial color="#d4af37" metalness={0.85} roughness={0.2} />
      </mesh>

       
      <group ref={handRef} position={[0, 7.8, 0]}>
        <mesh geometry={handGeometry} castShadow receiveShadow>
          <meshStandardMaterial
            color="#cf8e42"
            metalness={0.65}
            roughness={0.35}
          />
        </mesh>
      </group>

       
      <mesh position={[0, 1.8, 1.12]} rotation={[0, 0, 0]}>
        <planeGeometry args={[2.0, 1.0]} />
        <meshStandardMaterial
          map={plaqueTexture}
          emissive="#c5a059"
          emissiveIntensity={night ? 0.4 : 0.05}
        />
      </mesh>

       

       
      {Array.from({ length: 8 }, (_, i) => {
        const angle = (i * Math.PI * 2) / 8
        const r = 4.2
        return (
          <group key={i} position={[Math.cos(angle) * r, 0.45, Math.sin(angle) * r]}>
            <mesh castShadow>
              <cylinderGeometry args={[0.08, 0.1, 0.9, 10]} />
              <meshStandardMaterial color="#3d4043" metalness={0.5} roughness={0.5} />
            </mesh>
            <mesh position={[0, 0.45, 0]}>
              <sphereGeometry args={[0.1, 10, 10]} />
              <meshStandardMaterial color="#d4af37" metalness={0.8} roughness={0.2} />
            </mesh>
          </group>
        )
      })}
    </group>
  )
}
