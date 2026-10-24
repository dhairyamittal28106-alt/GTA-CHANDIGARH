import * as THREE from 'three'

/**
 * Procedural PBR Texture Generator for Chandigarh Sector 17
 * Generates high-resolution diffuse, bump, and roughness maps on the fly
 */

class TextureGenerator {
  private cache = new Map<string, THREE.CanvasTexture>()

  /**
   * Sector 17 Plaza Geometric Concrete Paver Tiles
   * Authentic dual-tone Corbusian concrete grid with stone aggregate and grooved joints
   */
  getPlazaPaversTexture(): { diffuse: THREE.CanvasTexture; bump: THREE.CanvasTexture } {
    const keyDiff = 'plaza_diff'
    const keyBump = 'plaza_bump'

    if (this.cache.has(keyDiff) && this.cache.has(keyBump)) {
      return { diffuse: this.cache.get(keyDiff)!, bump: this.cache.get(keyBump)! }
    }

    const size = 1024
    const canvasDiff = document.createElement('canvas')
    canvasDiff.width = size
    canvasDiff.height = size
    const ctxD = canvasDiff.getContext('2d')!

    const canvasBump = document.createElement('canvas')
    canvasBump.width = size
    canvasBump.height = size
    const ctxB = canvasBump.getContext('2d')!

    // Base warm grey concrete color
    ctxD.fillStyle = '#b8b2a3'
    ctxD.fillRect(0, 0, size, size)

    ctxB.fillStyle = '#808080'
    ctxB.fillRect(0, 0, size, size)

    const tileSize = size / 8 // 8x8 grid of large plaza slabs

    for (let x = 0; x < size; x += tileSize) {
      for (let y = 0; y < size; y += tileSize) {
        // Alternating subtle dual-tone Corbusian slab tint
        const isAlt = ((x / tileSize) + (y / tileSize)) % 2 === 0
        ctxD.fillStyle = isAlt ? '#c7c0af' : '#b3ada0'
        ctxD.fillRect(x + 2, y + 2, tileSize - 4, tileSize - 4)

        // Random subtle slab tonal variation
        const varTone = (Math.random() - 0.5) * 12
        ctxD.fillStyle = `rgba(${128 + varTone}, ${128 + varTone}, ${128 + varTone}, 0.08)`
        ctxD.fillRect(x + 2, y + 2, tileSize - 4, tileSize - 4)

        // Bump map: flat tile surface
        ctxB.fillStyle = '#a0a0a0'
        ctxB.fillRect(x + 2, y + 2, tileSize - 4, tileSize - 4)

        // Deep recessed grout joints (darker in bump)
        ctxB.strokeStyle = '#202020'
        ctxB.lineWidth = 4
        ctxB.strokeRect(x + 1, y + 1, tileSize - 2, tileSize - 2)

        ctxD.strokeStyle = '#857e72'
        ctxD.lineWidth = 4
        ctxD.strokeRect(x + 1, y + 1, tileSize - 2, tileSize - 2)
      }
    }

    // Add fine aggregate noise
    const imgData = ctxD.getImageData(0, 0, size, size)
    const data = imgData.data
    for (let i = 0; i < data.length; i += 4) {
      const n = (Math.random() - 0.5) * 18
      data[i] = Math.min(255, Math.max(0, data[i] + n))
      data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + n))
      data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + n))
    }
    ctxD.putImageData(imgData, 0, 0)

    const diffTex = new THREE.CanvasTexture(canvasDiff)
    diffTex.wrapS = THREE.RepeatWrapping
    diffTex.wrapT = THREE.RepeatWrapping
    diffTex.repeat.set(16, 16)
    diffTex.colorSpace = THREE.SRGBColorSpace

    const bumpTex = new THREE.CanvasTexture(canvasBump)
    bumpTex.wrapS = THREE.RepeatWrapping
    bumpTex.wrapT = THREE.RepeatWrapping
    bumpTex.repeat.set(16, 16)

    this.cache.set(keyDiff, diffTex)
    this.cache.set(keyBump, bumpTex)

    return { diffuse: diffTex, bump: bumpTex }
  }

  /**
   * Le Corbusier Board-Marked Concrete (Béton Brut)
   * With authentic horizontal timber formwork slats and tie-rod indentations
   */
  getBetonBrutTexture(): { diffuse: THREE.CanvasTexture; bump: THREE.CanvasTexture } {
    const keyDiff = 'beton_diff'
    const keyBump = 'beton_bump'

    if (this.cache.has(keyDiff) && this.cache.has(keyBump)) {
      return { diffuse: this.cache.get(keyDiff)!, bump: this.cache.get(keyBump)! }
    }

    const size = 512
    const canvasDiff = document.createElement('canvas')
    canvasDiff.width = size
    canvasDiff.height = size
    const ctxD = canvasDiff.getContext('2d')!

    const canvasBump = document.createElement('canvas')
    canvasBump.width = size
    canvasBump.height = size
    const ctxB = canvasBump.getContext('2d')!

    ctxD.fillStyle = '#a8a294'
    ctxD.fillRect(0, 0, size, size)

    ctxB.fillStyle = '#808080'
    ctxB.fillRect(0, 0, size, size)

    const boardHeight = 64
    for (let y = 0; y < size; y += boardHeight) {
      // Wood plank grain variation
      const tint = (Math.random() - 0.5) * 16
      ctxD.fillStyle = `rgba(${160 + tint}, ${154 + tint}, ${142 + tint}, 0.25)`
      ctxD.fillRect(0, y, size, boardHeight)

      // Board seam line (groove)
      ctxD.fillStyle = '#6e695d'
      ctxD.fillRect(0, y + boardHeight - 3, size, 3)

      ctxB.fillStyle = '#303030'
      ctxB.fillRect(0, y + boardHeight - 3, size, 3)

      // Tie-hole circular marks (typical of Corbusier formwork)
      for (let x = 40; x < size; x += 128) {
        ctxD.beginPath()
        ctxD.arc(x, y + boardHeight / 2, 7, 0, Math.PI * 2)
        ctxD.fillStyle = '#5c574c'
        ctxD.fill()

        ctxB.beginPath()
        ctxB.arc(x, y + boardHeight / 2, 7, 0, Math.PI * 2)
        ctxB.fillStyle = '#202020'
        ctxB.fill()
      }
    }

    const diffTex = new THREE.CanvasTexture(canvasDiff)
    diffTex.wrapS = THREE.RepeatWrapping
    diffTex.wrapT = THREE.RepeatWrapping
    diffTex.repeat.set(4, 4)
    diffTex.colorSpace = THREE.SRGBColorSpace

    const bumpTex = new THREE.CanvasTexture(canvasBump)
    bumpTex.wrapS = THREE.RepeatWrapping
    bumpTex.wrapT = THREE.RepeatWrapping
    bumpTex.repeat.set(4, 4)

    this.cache.set(keyDiff, diffTex)
    this.cache.set(keyBump, bumpTex)

    return { diffuse: diffTex, bump: bumpTex }
  }

  /**
   * Pierre Jeanneret Red Chandigarh Brickwork
   */
  getChandigarhBrickTexture(): { diffuse: THREE.CanvasTexture; bump: THREE.CanvasTexture } {
    const keyDiff = 'brick_diff'
    const keyBump = 'brick_bump'

    if (this.cache.has(keyDiff) && this.cache.has(keyBump)) {
      return { diffuse: this.cache.get(keyDiff)!, bump: this.cache.get(keyBump)! }
    }

    const size = 512
    const canvasDiff = document.createElement('canvas')
    canvasDiff.width = size
    canvasDiff.height = size
    const ctxD = canvasDiff.getContext('2d')!

    const canvasBump = document.createElement('canvas')
    canvasBump.width = size
    canvasBump.height = size
    const ctxB = canvasBump.getContext('2d')!

    // Mortar background
    ctxD.fillStyle = '#d5cebe'
    ctxD.fillRect(0, 0, size, size)

    ctxB.fillStyle = '#303030'
    ctxB.fillRect(0, 0, size, size)

    const brickH = 32
    const brickW = 64
    let row = 0

    for (let y = 0; y < size; y += brickH) {
      const offset = (row % 2) * (brickW / 2)
      for (let x = -brickW; x < size + brickW; x += brickW) {
        const bx = x + offset
        const rColor = ['#9c3826', '#b0432f', '#8d3020', '#a33d2a'][Math.floor(Math.random() * 4)]

        ctxD.fillStyle = rColor
        ctxD.fillRect(bx + 2, y + 2, brickW - 4, brickH - 4)

        ctxB.fillStyle = '#b0b0b0'
        ctxB.fillRect(bx + 2, y + 2, brickW - 4, brickH - 4)
      }
      row++
    }

    const diffTex = new THREE.CanvasTexture(canvasDiff)
    diffTex.wrapS = THREE.RepeatWrapping
    diffTex.wrapT = THREE.RepeatWrapping
    diffTex.repeat.set(6, 6)
    diffTex.colorSpace = THREE.SRGBColorSpace

    const bumpTex = new THREE.CanvasTexture(canvasBump)
    bumpTex.wrapS = THREE.RepeatWrapping
    bumpTex.wrapT = THREE.RepeatWrapping
    bumpTex.repeat.set(6, 6)

    this.cache.set(keyDiff, diffTex)
    this.cache.set(keyBump, bumpTex)

    return { diffuse: diffTex, bump: bumpTex }
  }

  /**
   * Asphalt Road with Grain & Subtle Wear
   */
  getAsphaltTexture(): { diffuse: THREE.CanvasTexture; bump: THREE.CanvasTexture } {
    const keyDiff = 'asphalt_diff'
    const keyBump = 'asphalt_bump'

    if (this.cache.has(keyDiff) && this.cache.has(keyBump)) {
      return { diffuse: this.cache.get(keyDiff)!, bump: this.cache.get(keyBump)! }
    }

    const size = 512
    const canvasDiff = document.createElement('canvas')
    canvasDiff.width = size
    canvasDiff.height = size
    const ctxD = canvasDiff.getContext('2d')!

    const canvasBump = document.createElement('canvas')
    canvasBump.width = size
    canvasBump.height = size
    const ctxB = canvasBump.getContext('2d')!

    ctxD.fillStyle = '#2b2e30'
    ctxD.fillRect(0, 0, size, size)

    ctxB.fillStyle = '#808080'
    ctxB.fillRect(0, 0, size, size)

    // Fine mineral grit noise
    const imgData = ctxD.getImageData(0, 0, size, size)
    const data = imgData.data
    for (let i = 0; i < data.length; i += 4) {
      const speck = (Math.random() - 0.5) * 24
      data[i] = Math.min(255, Math.max(0, data[i] + speck))
      data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + speck))
      data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + speck))
    }
    ctxD.putImageData(imgData, 0, 0)

    const diffTex = new THREE.CanvasTexture(canvasDiff)
    diffTex.wrapS = THREE.RepeatWrapping
    diffTex.wrapT = THREE.RepeatWrapping
    diffTex.repeat.set(12, 12)
    diffTex.colorSpace = THREE.SRGBColorSpace

    const bumpTex = new THREE.CanvasTexture(canvasBump)
    bumpTex.wrapS = THREE.RepeatWrapping
    bumpTex.wrapT = THREE.RepeatWrapping
    bumpTex.repeat.set(12, 12)

    this.cache.set(keyDiff, diffTex)
    this.cache.set(keyBump, bumpTex)

    return { diffuse: diffTex, bump: bumpTex }
  }

  /**
   * Water Pool Surface Ripple Texture
   */
  getWaterRippleTexture(): THREE.CanvasTexture {
    const key = 'water_ripple'
    if (this.cache.has(key)) return this.cache.get(key)!

    const size = 512
    const canvas = document.createElement('canvas')
    canvas.width = size
    canvas.height = size
    const ctx = canvas.getContext('2d')!

    ctx.fillStyle = '#8080ff'
    ctx.fillRect(0, 0, size, size)

    // Concentric caustic ripples
    for (let i = 0; i < 8; i++) {
      const cx = size * (0.3 + (i % 3) * 0.25)
      const cy = size * (0.3 + Math.floor(i / 3) * 0.25)
      for (let r = 10; r < 90; r += 14) {
        ctx.beginPath()
        ctx.arc(cx, cy, r, 0, Math.PI * 2)
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)'
        ctx.lineWidth = 3
        ctx.stroke()
      }
    }

    const tex = new THREE.CanvasTexture(canvas)
    tex.wrapS = THREE.RepeatWrapping
    tex.wrapT = THREE.RepeatWrapping
    tex.repeat.set(4, 4)
    this.cache.set(key, tex)
    return tex
  }
}

export const textures = new TextureGenerator()
