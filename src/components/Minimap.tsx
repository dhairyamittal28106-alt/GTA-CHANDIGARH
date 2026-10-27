import React from 'react'
import * as THREE from 'three'
import type { Landmark } from './QuestSystem'

interface MinimapProps {
  playerPos: THREE.Vector3
  playerYaw: number
  carPos: THREE.Vector3
  isDriving: boolean
  landmarks: Landmark[]
  waypoint: THREE.Vector3 | null
  onSetWaypoint: (pos: THREE.Vector3) => void
}

export function Minimap({
  playerPos,
  playerYaw,
  carPos,
  isDriving,
  landmarks,
  waypoint,
  onSetWaypoint,
}: MinimapProps) {
  
  
  const MAP_SIZE = 180
  const WORLD_RADIUS = 75 
  const toMapCoords = (wx: number, wz: number) => {
    const mx = 90 + (wx / WORLD_RADIUS) * 75
    const my = 90 + (wz / WORLD_RADIUS) * 75
    return { x: mx, y: my }
  }

  const pCoord = toMapCoords(playerPos.x, playerPos.z)
  const cCoord = toMapCoords(carPos.x, carPos.z)
  const wpCoord = waypoint ? toMapCoords(waypoint.x, waypoint.z) : null

  const handleClick = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const clickX = e.clientX - rect.left
    const clickY = e.clientY - rect.top
    const wx = ((clickX - 90) / 75) * WORLD_RADIUS
    const wz = ((clickY - 90) / 75) * WORLD_RADIUS
    onSetWaypoint(new THREE.Vector3(wx, 0, wz))
  }

  return (
    <div className="minimap-container" title="Click anywhere on the map to set an auto-walk waypoint">
      <div className="minimap-header">
        <span className="minimap-title">SECTOR 17 PLAZA</span>
        <span className="compass-n">N</span>
      </div>

      <svg
        className="minimap-svg"
        viewBox={`0 0 ${MAP_SIZE} ${MAP_SIZE}`}
        onClick={handleClick}
      >
         
        <circle cx="90" cy="90" r="88" fill="#1b2321" stroke="#3d4e48" strokeWidth="2" />
        <circle cx="90" cy="90" r="60" fill="none" stroke="#2a3832" strokeWidth="1" strokeDasharray="3 3" />
        <circle cx="90" cy="90" r="30" fill="none" stroke="#2a3832" strokeWidth="1" strokeDasharray="3 3" />
        <line x1="90" y1="2" x2="90" y2="178" stroke="#2a3832" strokeWidth="1" />
        <line x1="2" y1="90" x2="178" y2="90" stroke="#2a3832" strokeWidth="1" />

         
        <rect
          x="18"
          y="18"
          width="144"
          height="144"
          rx="12"
          fill="none"
          stroke="#475569"
          strokeWidth="10"
        />
         
        <rect
          x="18"
          y="18"
          width="144"
          height="144"
          rx="12"
          fill="none"
          stroke="#cbd5e1"
          strokeWidth="1"
          strokeDasharray="4 4"
        />

         
        <rect
          x="38"
          y="38"
          width="104"
          height="104"
          rx="6"
          fill="#33413c"
          stroke="#52655d"
          strokeWidth="1.5"
        />

         
         
        <rect x="42" y="112" width="55" height="12" fill="#4a5568" rx="2" />
         
        <rect x="112" y="45" width="12" height="60" fill="#4a5568" rx="2" />
         
        <rect x="42" y="45" width="12" height="40" fill="#4a5568" rx="2" />

         
        {landmarks.map(lm => {
          const pt = toMapCoords(lm.x, lm.z)
          const iconChar =
            lm.id === 'fountain'
              ? '⛲'
              : lm.id === 'neelam'
              ? '🎬'
              : lm.id === 'open_hand'
              ? '✋'
              : lm.id === 'coffee_house'
              ? '☕'
              : lm.id === 'softy_corner'
              ? '🍦'
              : lm.id === 'score_club'
              ? '🪩'
              : lm.id === 'nike_puma_showrooms'
              ? '👟'
              : lm.id === 'sector17_underpass'
              ? '🎨'
              : '⏰'

          return (
            <g key={lm.id} transform={`translate(${pt.x}, ${pt.y})`}>
              <circle
                r="7"
                fill={lm.discovered ? '#eab308' : '#64748b'}
                stroke="#ffffff"
                strokeWidth="1"
              />
              <text
                textAnchor="middle"
                dy="3.5"
                fontSize="8"
                fill="#ffffff"
                pointerEvents="none"
              >
                {iconChar}
              </text>
            </g>
          )
        })}

         
        {wpCoord && (
          <g transform={`translate(${wpCoord.x}, ${wpCoord.y})`}>
            <circle r="6" fill="#ef4444" stroke="#ffffff" strokeWidth="1.5">
              <animate attributeName="r" values="5;8;5" dur="1.2s" repeatCount="indefinite" />
            </circle>
            <circle r="2" fill="#ffffff" />
          </g>
        )}

         
        <g transform={`translate(${cCoord.x}, ${cCoord.y})`}>
          <rect
            x="-4"
            y="-6"
            width="8"
            height="12"
            rx="2"
            fill="#38bdf8"
            stroke="#ffffff"
            strokeWidth="1"
          />
          <text textAnchor="middle" dy="2.5" fontSize="6" fill="#0f172a" fontWeight="bold">
            🚗
          </text>
        </g>

         
        <g
          transform={`translate(${pCoord.x}, ${pCoord.y}) rotate(${(-playerYaw * 180) / Math.PI})`}
        >
           
          <polygon
            points="0,0 -16,-32 16,-32"
            fill="url(#visionGrad)"
            opacity="0.45"
          />
           
          <polygon
            points="0,-8 6,6 0,3 -6,6"
            fill={isDriving ? '#38bdf8' : '#f97316'}
            stroke="#ffffff"
            strokeWidth="1.2"
          />
        </g>

         
        <defs>
          <linearGradient id="visionGrad" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#f97316" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#f97316" stopOpacity="0.0" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  )
}
