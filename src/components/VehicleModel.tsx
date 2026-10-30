import { useGLTF } from '@react-three/drei'
import { VEHICLES, type VehicleId, type VehicleSpec } from './vehicleCatalog'

function ClassicSedan() {
  const { scene } = useGLTF('/models/1980s-sedan.glb')
  return <primitive object={scene} />
}

function Wheel({ x, z, radius, width }: { x: number; z: number; radius: number; width: number }) {
  return (
    <group name={`wheel_${x < 0 ? 'left' : 'right'}_${z > 0 ? 'front' : 'rear'}`} position={[x, radius, z]}>
      <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[radius, radius, width, 20]} />
        <meshStandardMaterial color="#17191b" roughness={0.88} />
      </mesh>
      <mesh rotation={[0, 0, Math.PI / 2]} position={[x < 0 ? -width * 0.53 : width * 0.53, 0, 0]}>
        <cylinderGeometry args={[radius * 0.53, radius * 0.53, 0.035, 16]} />
        <meshStandardMaterial color="#aeb4b7" metalness={0.72} roughness={0.28} />
      </mesh>
    </group>
  )
}

function ProceduralVehicle({ spec }: { spec: VehicleSpec }) {
  const { length, width, height } = spec
  const tireRadius = spec.style === 'sports' ? 0.32 : 0.35
  const wheelZ = length * 0.32
  const cabinLength = spec.style === 'hatch' ? length * 0.48 : spec.style === 'sports' ? length * 0.39 : length * 0.43
  const cabinCenter = spec.style === 'hatch' ? -0.02 : -0.06
  const glassHeight = Math.max(0.38, height * 0.42)
  const roofY = spec.style === 'sports' ? 1.38 : height
  const bodyPaint = spec.paint
  const glassColor = '#243946'

  return (
    <group name={`vehicle_${spec.id}`}>
      {/* Continuous lower body and bonnet give each body style a clear silhouette. */}
      <mesh position={[0, 0.66, 0]} castShadow receiveShadow>
        <boxGeometry args={[width, 0.48, length]} />
        <meshStandardMaterial color={bodyPaint} metalness={0.36} roughness={0.34} />
      </mesh>
      <mesh position={[0, 0.88, length * 0.29]} castShadow receiveShadow>
        <boxGeometry args={[width * 0.94, 0.22, length * 0.31]} />
        <meshStandardMaterial color={bodyPaint} metalness={0.36} roughness={0.34} />
      </mesh>
      <mesh position={[0, 0.82, -length * 0.34]} castShadow receiveShadow>
        <boxGeometry args={[width * 0.94, 0.23, length * 0.23]} />
        <meshStandardMaterial color={bodyPaint} metalness={0.36} roughness={0.34} />
      </mesh>

      {/* Cabin proportions distinguish hatchbacks, SUVs, off-roaders and sports SUVs. */}
      <mesh position={[0, 0.99 + glassHeight * 0.46, cabinCenter]} castShadow>
        <boxGeometry args={[width * 0.79, glassHeight, cabinLength * 0.91]} />
        <meshPhysicalMaterial color={glassColor} roughness={0.16} metalness={0.18} clearcoat={0.72} />
      </mesh>
      <mesh position={[0, roofY, cabinCenter]} castShadow>
        <boxGeometry args={[width * 0.83, 0.13, cabinLength]} />
        <meshStandardMaterial color={bodyPaint} metalness={0.32} roughness={0.31} />
      </mesh>

      {/* Pillars and side trim break up the glass into visible windows. */}
      {[-1, 1].map(side => (
        <group key={side}>
          {[-1, 1].map(end => (
            <mesh key={end} position={[side * width * 0.405, 1.16 + glassHeight * 0.28, cabinCenter + end * cabinLength * 0.4]} castShadow>
              <boxGeometry args={[0.075, glassHeight * 0.85, 0.09]} />
              <meshStandardMaterial color={bodyPaint} metalness={0.28} roughness={0.36} />
            </mesh>
          ))}
          <mesh position={[side * width * 0.51, 0.91, cabinCenter]}>
            <boxGeometry args={[0.035, 0.045, cabinLength * 0.72]} />
            <meshStandardMaterial color="#b8c0c3" metalness={0.8} roughness={0.24} />
          </mesh>
          <mesh position={[side * width * 0.53, 1.04, length * 0.12]} castShadow>
            <boxGeometry args={[0.18, 0.12, 0.24]} />
            <meshStandardMaterial color={bodyPaint} metalness={0.34} roughness={0.34} />
          </mesh>
        </group>
      ))}

      {/* Front grille, bumpers, and distinct head and tail lamps. */}
      <mesh position={[0, 0.62, length * 0.505]}>
        <boxGeometry args={[width * 0.36, 0.2, 0.045]} />
        <meshStandardMaterial color="#171b1e" metalness={0.45} roughness={0.38} />
      </mesh>
      <mesh position={[0, 0.38, length * 0.52]}>
        <boxGeometry args={[width * 0.9, 0.12, 0.13]} />
        <meshStandardMaterial color="#262c30" metalness={0.3} roughness={0.5} />
      </mesh>
      {[-1, 1].map(side => (
        <group key={side}>
          <mesh position={[side * width * 0.36, 0.82, length * 0.49]}>
            <boxGeometry args={[0.25, 0.12, 0.05]} />
            <meshStandardMaterial color="#fff0c2" emissive="#c0a967" emissiveIntensity={0.32} />
          </mesh>
          <mesh position={[side * width * 0.37, 0.77, -length * 0.5]}>
            <boxGeometry args={[0.24, 0.17, 0.045]} />
            <meshStandardMaterial color="#a82022" emissive="#5f0506" emissiveIntensity={0.3} />
          </mesh>
          <mesh position={[side * width * 0.48, 1.01, cabinCenter + cabinLength * 0.02]}>
            <boxGeometry args={[0.02, glassHeight * 0.48, cabinLength * 0.31]} />
            <meshStandardMaterial color="#182b36" roughness={0.18} metalness={0.1} />
          </mesh>
        </group>
      ))}

      {/* Roof rails on utility SUVs; exposed spare wheel on off-road models. */}
      {spec.style === 'suv' && [-1, 1].map(side => (
        <mesh key={side} position={[side * width * 0.32, roofY + 0.09, cabinCenter]}>
          <boxGeometry args={[0.045, 0.045, cabinLength * 0.84]} />
          <meshStandardMaterial color="#b7bec0" metalness={0.74} roughness={0.3} />
        </mesh>
      ))}
      {spec.style === 'offroad' && (
        <group position={[0, 1.08, -length * 0.53]} rotation={[Math.PI / 2, 0, 0]}>
          <mesh name="wheel_spare" castShadow>
            <cylinderGeometry args={[0.31, 0.31, 0.19, 20]} />
            <meshStandardMaterial color="#17191b" roughness={0.88} />
          </mesh>
          <mesh position={[0, 0.105, 0]}>
            <cylinderGeometry args={[0.15, 0.15, 0.025, 16]} />
            <meshStandardMaterial color="#aeb4b7" metalness={0.7} roughness={0.3} />
          </mesh>
        </group>
      )}

      {[-1, 1].flatMap(side => [-1, 1].map(end => (
        <Wheel key={`${side}_${end}`} x={side * width * 0.52} z={end * wheelZ} radius={tireRadius} width={0.25} />
      )))}
    </group>
  )
}

export function VehicleModel({ vehicleId }: { vehicleId: VehicleId }) {
  if (vehicleId === 'classic-sedan') return <ClassicSedan />
  return <ProceduralVehicle spec={VEHICLES[vehicleId]} />
}
