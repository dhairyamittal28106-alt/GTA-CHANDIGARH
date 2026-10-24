import { useEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import * as SkeletonUtils from 'three/addons/utils/SkeletonUtils.js'
import { PunjabiTurban } from './PunjabiTurban'
import type { CharacterConfig } from './CharacterAndShopStore'

interface DynamicCharacterProps {
  motion: { current: 'idle' | 'walk' | 'run' }
  velocity?: number
  isDancing?: boolean
  config: CharacterConfig
}

/**
 * Procedural hair styles for urban men and women in Chandigarh
 */
function ModernMaleHair({ style, color }: { style: string; color: string }) {
  return (
    <group position={[0, 0.05, 0]}>
      {/* Hair Volume Mass */}
      <mesh position={[0, 0.12, -0.02]} castShadow>
        <sphereGeometry args={[0.13, 16, 14]} />
        <meshStandardMaterial color={color} roughness={0.85} />
      </mesh>
      {/* Front Quiff / Pompadour volume */}
      {style === 'pompadour' && (
        <mesh position={[0, 0.17, 0.06]} rotation={[-0.2, 0, 0]} castShadow>
          <boxGeometry args={[0.14, 0.08, 0.12]} />
          <meshStandardMaterial color={color} roughness={0.8} />
        </mesh>
      )}
      {/* Textured sides / fade */}
      <mesh position={[0.11, 0.1, -0.01]}>
        <boxGeometry args={[0.03, 0.1, 0.14]} />
        <meshStandardMaterial color={color} roughness={0.9} />
      </mesh>
      <mesh position={[-0.11, 0.1, -0.01]}>
        <boxGeometry args={[0.03, 0.1, 0.14]} />
        <meshStandardMaterial color={color} roughness={0.9} />
      </mesh>
    </group>
  )
}

function FemaleHairstyle({ style, color }: { style: string; color: string }) {
  return (
    <group position={[0, 0.04, 0]}>
      {/* Crown volume */}
      <mesh position={[0, 0.12, -0.02]} castShadow>
        <sphereGeometry args={[0.135, 18, 16]} />
        <meshStandardMaterial color={color} roughness={0.75} />
      </mesh>

      {/* Front parted bangs / side fringe */}
      <mesh position={[-0.06, 0.12, 0.08]} rotation={[0, 0.2, -0.15]}>
        <boxGeometry args={[0.08, 0.06, 0.08]} />
        <meshStandardMaterial color={color} roughness={0.8} />
      </mesh>
      <mesh position={[0.06, 0.12, 0.08]} rotation={[0, -0.2, 0.15]}>
        <boxGeometry args={[0.08, 0.06, 0.08]} />
        <meshStandardMaterial color={color} roughness={0.8} />
      </mesh>

      {/* Traditional Punjabi Braid with Golden Parandi tassels */}
      {style === 'girl_braid' && (
        <group position={[0, 0.06, -0.13]}>
          {/* Main woven braid segments */}
          {[0, -0.12, -0.24, -0.36, -0.48].map((by, i) => (
            <mesh key={i} position={[0, by, 0]} rotation={[0.08, 0, (i % 2 ? 0.08 : -0.08)]} castShadow>
              <capsuleGeometry args={[0.045 - i * 0.005, 0.12, 8, 8]} />
              <meshStandardMaterial color={color} roughness={0.8} />
            </mesh>
          ))}
          {/* Traditional Golden Parandi tassels at braid end */}
          <group position={[0, -0.58, 0]}>
            <mesh>
              <cylinderGeometry args={[0.025, 0.04, 0.08, 10]} />
              <meshStandardMaterial color="#eab308" metalness={0.8} roughness={0.3} />
            </mesh>
            {[-0.025, 0, 0.025].map((tx, idx) => (
              <mesh key={idx} position={[tx, -0.07, 0]} castShadow>
                <coneGeometry args={[0.022, 0.09, 8]} />
                <meshStandardMaterial color={idx === 1 ? '#d90429' : '#eab308'} metalness={0.7} roughness={0.4} />
              </mesh>
            ))}
          </group>
        </group>
      )}

      {/* High Ponytail */}
      {style === 'girl_ponytail' && (
        <group position={[0, 0.16, -0.12]} rotation={[-0.3, 0, 0]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.05, 0.03, 0.35, 10]} />
            <meshStandardMaterial color={color} roughness={0.8} />
          </mesh>
          {/* Hair scrunchie */}
          <mesh position={[0, 0.15, 0]}>
            <torusGeometry args={[0.05, 0.02, 8, 16]} />
            <meshStandardMaterial color="#ec4899" roughness={0.6} />
          </mesh>
        </group>
      )}

      {/* Shoulder Bob Waves */}
      {style === 'girl_bob' && (
        <>
          <mesh position={[-0.12, 0.01, -0.01]} castShadow>
            <cylinderGeometry args={[0.03, 0.05, 0.22, 8]} />
            <meshStandardMaterial color={color} roughness={0.75} />
          </mesh>
          <mesh position={[0.12, 0.01, -0.01]} castShadow>
            <cylinderGeometry args={[0.03, 0.05, 0.22, 8]} />
            <meshStandardMaterial color={color} roughness={0.75} />
          </mesh>
        </>
      )}
    </group>
  )
}

/**
 * Traditional Punjabi Jhumkas (Golden dangling earrings)
 */
function Jhumkas() {
  return (
    <group position={[0, 0.02, 0.01]}>
      {/* Left Earring */}
      <group position={[-0.115, -0.05, 0]}>
        <mesh>
          <sphereGeometry args={[0.015, 8, 8]} />
          <meshStandardMaterial color="#eab308" metalness={0.85} roughness={0.25} />
        </mesh>
        {/* Bell / Umbrella dome */}
        <mesh position={[0, -0.025, 0]}>
          <coneGeometry args={[0.022, 0.025, 10]} />
          <meshStandardMaterial color="#eab308" metalness={0.85} roughness={0.25} />
        </mesh>
        {/* Dangling pearls */}
        <mesh position={[0, -0.045, 0]}>
          <sphereGeometry args={[0.008, 6, 6]} />
          <meshStandardMaterial color="#ffffff" roughness={0.1} />
        </mesh>
      </group>

      {/* Right Earring */}
      <group position={[0.115, -0.05, 0]}>
        <mesh>
          <sphereGeometry args={[0.015, 8, 8]} />
          <meshStandardMaterial color="#eab308" metalness={0.85} roughness={0.25} />
        </mesh>
        <mesh position={[0, -0.025, 0]}>
          <coneGeometry args={[0.022, 0.025, 10]} />
          <meshStandardMaterial color="#eab308" metalness={0.85} roughness={0.25} />
        </mesh>
        <mesh position={[0, -0.045, 0]}>
          <sphereGeometry args={[0.008, 6, 6]} />
          <meshStandardMaterial color="#ffffff" roughness={0.1} />
        </mesh>
      </group>
    </group>
  )
}

/**
 * Aviator Sunglasses on the nose bridge
 */
function AviatorGlasses({ frameColor }: { frameColor: string }) {
  return (
    <group position={[0, 0.04, 0.12]}>
      {/* Bridge */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[0.03, 0.006, 0.01]} />
        <meshStandardMaterial color={frameColor} metalness={0.9} roughness={0.2} />
      </mesh>
      {/* Left Teardrop Lens */}
      <mesh position={[-0.042, -0.012, 0]}>
        <cylinderGeometry args={[0.026, 0.022, 0.008, 16]} />
        <meshStandardMaterial
          color="#0f172a"
          metalness={0.9}
          roughness={0.1}
          opacity={0.88}
          transparent
        />
      </mesh>
      {/* Right Teardrop Lens */}
      <mesh position={[0.042, -0.012, 0]}>
        <cylinderGeometry args={[0.026, 0.022, 0.008, 16]} />
        <meshStandardMaterial
          color="#0f172a"
          metalness={0.9}
          roughness={0.1}
          opacity={0.88}
          transparent
        />
      </mesh>
    </group>
  )
}

/**
 * Branded Shopping Bags carried in hands
 */
function ShoppingBags() {
  return (
    <group position={[0, -0.25, 0]}>
      {/* Nike Orange Tote Bag */}
      <mesh position={[0.05, 0, 0]} castShadow>
        <boxGeometry args={[0.22, 0.3, 0.12]} />
        <meshStandardMaterial color="#ff5500" roughness={0.4} />
      </mesh>
      {/* Handle */}
      <mesh position={[0.05, 0.18, 0]}>
        <torusGeometry args={[0.06, 0.008, 8, 12, Math.PI]} />
        <meshStandardMaterial color="#111111" />
      </mesh>
      {/* Adidas / Skechers Blue Bag */}
      <mesh position={[-0.05, -0.04, 0.02]} castShadow>
        <boxGeometry args={[0.2, 0.26, 0.1]} />
        <meshStandardMaterial color="#0284c7" roughness={0.4} />
      </mesh>
    </group>
  )
}

/**
 * Club Beverage Mocktail / Red Bull Glass
 */
function ClubDrink() {
  return (
    <group position={[0, 0.1, 0]}>
      {/* Glass */}
      <mesh castShadow>
        <cylinderGeometry args={[0.04, 0.03, 0.12, 12]} />
        <meshPhysicalMaterial
          color="#00f5d4"
          transmission={0.8}
          opacity={0.7}
          transparent
          roughness={0.1}
        />
      </mesh>
      {/* Straw */}
      <mesh position={[0.015, 0.07, 0]} rotation={[0, 0, 0.2]}>
        <cylinderGeometry args={[0.005, 0.005, 0.14, 8]} />
        <meshStandardMaterial color="#f72585" />
      </mesh>
    </group>
  )
}

export function DynamicCharacter({
  motion,
  velocity = 0,
  isDancing = false,
  config,
}: DynamicCharacterProps) {
  const modelUrl =
    config.archetype === 'girl'
      ? '/models/casual-woman-rigged.glb'
      : '/models/casual-man-rigged.glb'

  const { scene, animations } = useGLTF(modelUrl)
  const model = useMemo(() => SkeletonUtils.clone(scene) as THREE.Object3D, [scene])
  const root = useRef<THREE.Group>(null)

  // Tracked Bone References
  const headBoneRef = useRef<THREE.Object3D | null>(null)
  const rightHandBoneRef = useRef<THREE.Object3D | null>(null)
  const spineBoneRef = useRef<THREE.Object3D | null>(null)
  const hipsBoneRef = useRef<THREE.Object3D | null>(null)
  const leftUpLegRef = useRef<THREE.Object3D | null>(null)
  const rightUpLegRef = useRef<THREE.Object3D | null>(null)
  const leftLegRef = useRef<THREE.Object3D | null>(null)
  const rightLegRef = useRef<THREE.Object3D | null>(null)
  const leftArmRef = useRef<THREE.Object3D | null>(null)
  const rightArmRef = useRef<THREE.Object3D | null>(null)
  const gaitBase = useRef(new Map<THREE.Object3D, { x: number; y: number; z: number }>())
  const gaitPhase = useRef(0)

  // Accessory Attachment Groups
  const headAccRef = useRef<THREE.Group>(null)
  const handAccRef = useRef<THREE.Group>(null)

  // Dedicated AnimationMixer targeting the cloned model directly (guarantees all 55 bones animate)
  const mixer = useMemo(() => new THREE.AnimationMixer(model), [model])
  const actions = useMemo(() => {
    const actMap: Record<string, THREE.AnimationAction> = {}
    animations.forEach((clip) => {
      const act = mixer.clipAction(clip)
      act.setLoop(THREE.LoopRepeat, Infinity)
      act.clampWhenFinished = false
      actMap[clip.name] = act
    })
    return actMap
  }, [animations, mixer])

  useEffect(() => {
    return () => {
      mixer.stopAllAction()
      mixer.uncacheRoot(model)
    }
  }, [mixer, model])

  const active = useRef<'walk' | 'run' | null>(null)
  const animationBindingsHealthy = useRef(true)
  const tmpPos = useMemo(() => new THREE.Vector3(), [])

  // Dynamic mesh materials for clothing tinting
  useEffect(() => {
    model.traverse((node) => {
      if ((node as THREE.Mesh).isMesh) {
        const mesh = node as THREE.Mesh
        if (mesh.material) {
          // Clone material for this character instance
          mesh.material = (mesh.material as THREE.Material).clone()
          mesh.castShadow = true
          mesh.receiveShadow = true
        }
      }
      if (node.name === 'Head') headBoneRef.current = node
      if (node.name === 'RightHand') rightHandBoneRef.current = node
      if (node.name === 'Spine' || node.name === 'Spine01') spineBoneRef.current = node
      if (node.name === 'Hips') hipsBoneRef.current = node
      if (node.name === 'LeftUpLeg') leftUpLegRef.current = node
      if (node.name === 'RightUpLeg') rightUpLegRef.current = node
      if (node.name === 'LeftLeg') leftLegRef.current = node
      if (node.name === 'RightLeg') rightLegRef.current = node
      if (node.name === 'LeftArm') leftArmRef.current = node
      if (node.name === 'RightArm') rightArmRef.current = node
    })
    ;[leftUpLegRef.current, rightUpLegRef.current, leftLegRef.current, rightLegRef.current,
      leftArmRef.current, rightArmRef.current, spineBoneRef.current, hipsBoneRef.current]
      .forEach((bone) => {
        if (bone) gaitBase.current.set(bone, { x: bone.rotation.x, y: bone.position.y, z: bone.rotation.z })
      })
  }, [model])

  useFrame(({ clock }, dt) => {
    dt = Math.min(dt, 0.05)
    if (animationBindingsHealthy.current) {
      try {
        mixer.update(dt)
      } catch {
        animationBindingsHealthy.current = false
        mixer.stopAllAction()
      }
    }
    const elapsed = clock.elapsedTime
    const currentMotion = motion.current

    // 1. IMPROVED LOCOMOTION & WALKING STYLE
    // Dynamically adjust animation speed to match foot travel speed (eliminates foot sliding!)
    if (currentMotion !== 'idle') {
      const next = currentMotion
      if (next !== active.current) {
        if (active.current && animationBindingsHealthy.current) {
          try { actions[active.current]?.fadeOut(0.18) } catch { animationBindingsHealthy.current = false }
        }
        // Some GLB clips contain tracks that Three cannot bind on cloned rigs.
        // Keep a bad clip from throwing inside useFrame (which stops the entire
        // R3F render loop) and let the procedural motion continue instead.
        try {
          if (next && animationBindingsHealthy.current) actions[next]?.reset().fadeIn(0.18).play()
        } catch {
          animationBindingsHealthy.current = false
          // The rig's procedural gait / idle sway remains available as fallback.
        }
        active.current = next
      }

      // Synchronize stride frequency with velocity
      const targetSpeed = currentMotion === 'run' ? Math.max(1.0, velocity / 6.5) : Math.max(0.75, velocity / 3.8)
      if (active.current && animationBindingsHealthy.current && actions[active.current]) {
        actions[active.current]!.timeScale = THREE.MathUtils.clamp(targetSpeed, 0.6, 1.6)
      }
    } else {
      // Transitioning to Idle
      if (active.current) {
        if (animationBindingsHealthy.current) {
          try { actions[active.current]?.fadeOut(0.25) } catch { animationBindingsHealthy.current = false }
        }
        active.current = null
      }

      // 2. LIFELIKE IDLE POSTURE & SWAY (NO STIFF T-POSE!)
      if (spineBoneRef.current && !isDancing) {
        // Natural gentle chest breathing
        const breath = Math.sin(elapsed * 2.2) * 0.025
        const base = gaitBase.current.get(spineBoneRef.current)
        spineBoneRef.current.rotation.x = (base?.x ?? 0) + 0.02 + breath
        spineBoneRef.current.rotation.z = Math.sin(elapsed * 1.1) * 0.012
      }
    }

    // Reliable continuous gait fallback for GLB clips with invalid bindings.
    // The phase advances by frame time, so feet never pause between steps.
    if (!animationBindingsHealthy.current && !isDancing) {
      const walking = currentMotion !== 'idle'
      const frequency = currentMotion === 'run' ? 10.5 : 7.2
      gaitPhase.current += dt * frequency
      const phase = gaitPhase.current
      const stride = currentMotion === 'run' ? 0.68 : 0.48
      const swing = Math.sin(phase) * stride
      const knee = Math.max(0, Math.cos(phase)) * (currentMotion === 'run' ? 0.42 : 0.28)

      const poseX = (bone: THREE.Object3D | null, value: number) => {
        if (!bone) return
        const base = gaitBase.current.get(bone)
        bone.rotation.x = (base?.x ?? 0) + value
      }
      poseX(leftUpLegRef.current, walking ? swing : 0)
      poseX(rightUpLegRef.current, walking ? -swing : 0)
      poseX(leftLegRef.current, walking ? knee : 0)
      poseX(rightLegRef.current, walking ? Math.max(0, -Math.cos(phase)) * (currentMotion === 'run' ? 0.42 : 0.28) : 0)
      poseX(leftArmRef.current, walking ? -swing * 0.42 : 0)
      poseX(rightArmRef.current, walking ? swing * 0.42 : 0)

      const hips = hipsBoneRef.current
      if (hips) {
        const base = gaitBase.current.get(hips)
        hips.position.y = (base?.y ?? hips.position.y) + (walking ? Math.abs(Math.sin(phase * 2)) * 0.025 : 0)
      }
    }

    // 3. ENERGETIC CLUB DANCE ANIMATION (When partying in Score Club)
    if (isDancing) {
      const bpm = 128
      const beat = (elapsed * (bpm / 60) * Math.PI) * 2

      // Pelvic rhythm bounce
      if (hipsBoneRef.current) {
        hipsBoneRef.current.position.y = Math.abs(Math.sin(beat)) * 0.06
        hipsBoneRef.current.rotation.z = Math.sin(beat * 0.5) * 0.08
        hipsBoneRef.current.rotation.y = Math.cos(beat * 0.5) * 0.1
      }

      // Upper torso groove
      if (spineBoneRef.current) {
        spineBoneRef.current.rotation.x = -0.05 + Math.sin(beat) * 0.06
        spineBoneRef.current.rotation.y = Math.sin(beat * 0.5) * 0.12
      }

      // Head nod to the beat
      if (headBoneRef.current) {
        headBoneRef.current.rotation.x = Math.sin(beat) * 0.1
        headBoneRef.current.rotation.z = Math.sin(beat * 0.5) * 0.06
      }
    }

    // 4. ATTACH ACCESSORIES TO BONES SEAMLESSLY
    if (root.current) {
      if (headBoneRef.current && headAccRef.current) {
        headBoneRef.current.getWorldPosition(tmpPos)
        root.current.worldToLocal(tmpPos)
        headAccRef.current.position.copy(tmpPos)
      }

      if (rightHandBoneRef.current && handAccRef.current) {
        rightHandBoneRef.current.getWorldPosition(tmpPos)
        root.current.worldToLocal(tmpPos)
        handAccRef.current.position.copy(tmpPos)
      }
    }
  })

  const isSardar = config.archetype === 'sardar'
  const isGirl = config.archetype === 'girl'
  const isMan = config.archetype === 'man'

  return (
    <group ref={root}>
      {/* Rigged Skinned 3D Character Model */}
      <primitive object={model} />

      {/* Head-Tracked Accessories Group */}
      <group ref={headAccRef} position={[0, 1.62, 0]}>
        {/* SARDAR JI: Authentic Punjabi Turban & Beard */}
        {isSardar && (
          <PunjabiTurban
            style={config.turban.style}
            color={config.turban.color}
            fiftyColor={config.turban.fiftyColor}
            hasKalgi={config.turban.hasKalgi}
            hasBeard={config.turban.hasBeard}
            beardColor={config.turban.beardColor}
            scale={0.96}
          />
        )}

        {/* NORMAL MAN: Urban Modern Haircuts */}
        {isMan && (
          <ModernMaleHair
            style={config.hairstyle}
            color={config.hairColor}
          />
        )}

        {/* CHANDIGARH GIRL: Authentic Hairstyles & Traditional Jhumkas */}
        {isGirl && (
          <>
            <FemaleHairstyle
              style={config.hairstyle}
              color={config.hairColor}
            />
            {config.hasJhumkas && <Jhumkas />}
          </>
        )}

        {/* Aviator Sunglasses (equipped / toggled) */}
        {config.hasEyewear && (
          <AviatorGlasses frameColor={config.eyewearColor} />
        )}
      </group>

      {/* Hand-Tracked Accessories Group */}
      <group ref={handAccRef} position={[0.4, 0.8, 0]}>
        {/* Shopping Bags from Nike / Adidas / Skechers */}
        {config.hasShoppingBags && <ShoppingBags />}

        {/* Club Mocktail / Beverage */}
        {config.hasDrink && <ClubDrink />}
      </group>
    </group>
  )
}
