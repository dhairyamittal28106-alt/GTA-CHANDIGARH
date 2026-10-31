import * as THREE from 'three'

export type CombatAction = 'punch' | 'kick' | 'shoot' | 'vehicle'
export type CombatTargetKind = 'pedestrian' | 'vehicle'
export type CombatHitResult = false | 'hit' | 'down'

export type CombatTarget = {
  id: string
  kind: CombatTargetKind
  radius: number
  getPosition: (target: THREE.Vector3) => THREE.Vector3
  receiveHit: (action: CombatAction) => CombatHitResult
}

const targets = new Map<string, CombatTarget>()
const point = new THREE.Vector3()
const offset = new THREE.Vector3()

export function registerCombatTarget(target: CombatTarget) {
  targets.set(target.id, target)
  return () => {
    if (targets.get(target.id) === target) targets.delete(target.id)
  }
}

export function attackNearestTarget(origin: THREE.Vector3, yaw: number, action: Exclude<CombatAction, 'vehicle'>) {
  const range = action === 'shoot' ? 70 : action === 'kick' ? 4.3 : 3.5
  const minimumDot = action === 'shoot' ? 0.55 : -0.25
  const forwardX = Math.sin(yaw)
  const forwardZ = Math.cos(yaw)
  const candidates: Array<{ target: CombatTarget; distance: number }> = []

  for (const target of targets.values()) {
    target.getPosition(point)
    const dx = point.x - origin.x
    const dz = point.z - origin.z
    const distance = Math.hypot(dx, dz)
    if (distance < 0.001 || distance > range + target.radius) continue
    const alignment = (dx * forwardX + dz * forwardZ) / distance
    if (alignment < minimumDot) continue

    if (action === 'shoot') {
      const lateral = Math.abs(dx * forwardZ - dz * forwardX)
      if (lateral > target.radius + distance * 0.84) continue
    }

    candidates.push({ target, distance })
  }

  candidates.sort((a, b) => a.distance - b.distance)
  for (const { target, distance } of candidates) {
    const result = target.receiveHit(action)
    if (result) return { kind: target.kind, distance, down: result === 'down' }
  }
  return null
}

export function hitPedestriansWithVehicle(position: THREE.Vector3, radius: number, speed: number) {
  if (speed < 4) return 0
  let hits = 0
  for (const target of targets.values()) {
    if (target.kind !== 'pedestrian') continue
    target.getPosition(point)
    offset.set(point.x - position.x, 0, point.z - position.z)
    if (offset.lengthSq() > (radius + target.radius) ** 2) continue
    if (target.receiveHit('vehicle')) hits++
  }
  return hits
}
