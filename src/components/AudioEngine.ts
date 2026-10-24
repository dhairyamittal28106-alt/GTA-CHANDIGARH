// Procedural Web Audio API sound generator for Chandigarh Sector 17
// Zero external assets needed, ultra-low latency, and fully dynamic

class SoundManager {
  private ctx: AudioContext | null = null
  private masterGain: GainNode | null = null
  private muted: boolean = false
  private fountainGain: GainNode | null = null
  private engineOsc: OscillatorNode | null = null
  private engineGain: GainNode | null = null
  private musicalFountainTimer: number | null = null
  private isMusicPlaying: boolean = false

  // Club & Discotheque Audio
  private clubGain: GainNode | null = null
  private clubFilter: BiquadFilterNode | null = null
  private clubTimer: number | null = null
  private isClubPlaying: boolean = false
  private clubBeatIndex: number = 0

  init() {
    if (this.ctx) return
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
    if (!AudioCtx) return
    this.ctx = new AudioCtx()
    this.masterGain = this.ctx.createGain()
    this.masterGain.gain.setValueAtTime(0.5, this.ctx.currentTime)
    this.masterGain.connect(this.ctx.destination)

    this.setupFountainNoise()
    this.setupEngineSound()
    this.setupClubAudio()
  }

  toggleMute(): boolean {
    if (!this.ctx) this.init()
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume()
    }
    this.muted = !this.muted
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(this.muted ? 0 : 0.5, this.ctx.currentTime, 0.05)
    }
    return this.muted
  }

  isMuted(): boolean {
    return this.muted
  }

  ensureContext() {
    if (!this.ctx) this.init()
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume()
    }
  }

  private setupFountainNoise() {
    if (!this.ctx || !this.masterGain) return
    try {
      const bufferSize = this.ctx.sampleRate * 2
      const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate)
      const output = noiseBuffer.getChannelData(0)
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1
      }

      const whiteNoise = this.ctx.createBufferSource()
      whiteNoise.buffer = noiseBuffer
      whiteNoise.loop = true

      const filter = this.ctx.createBiquadFilter()
      filter.type = 'bandpass'
      filter.frequency.setValueAtTime(800, this.ctx.currentTime)
      filter.Q.setValueAtTime(0.8, this.ctx.currentTime)

      this.fountainGain = this.ctx.createGain()
      this.fountainGain.gain.setValueAtTime(0, this.ctx.currentTime)

      whiteNoise.connect(filter)
      filter.connect(this.fountainGain)
      this.fountainGain.connect(this.masterGain)

      whiteNoise.start()
    } catch (e) {
      console.warn('Fountain audio setup failed', e)
    }
  }

  updateFountainDistance(dist: number) {
    if (!this.ctx || !this.fountainGain || this.muted) return
    // Volume max (0.28) when dist < 5m, drops to 0 at 65m
    const target = dist > 65 ? 0 : Math.max(0, (1 - dist / 65) * 0.28)
    this.fountainGain.gain.setTargetAtTime(target, this.ctx.currentTime, 0.2)
  }

  private setupEngineSound() {
    if (!this.ctx || !this.masterGain) return
    try {
      this.engineOsc = this.ctx.createOscillator()
      this.engineOsc.type = 'sawtooth'
      this.engineOsc.frequency.setValueAtTime(45, this.ctx.currentTime)

      const filter = this.ctx.createBiquadFilter()
      filter.type = 'lowpass'
      filter.frequency.setValueAtTime(280, this.ctx.currentTime)

      this.engineGain = this.ctx.createGain()
      this.engineGain.gain.setValueAtTime(0, this.ctx.currentTime)

      this.engineOsc.connect(filter)
      filter.connect(this.engineGain)
      this.engineGain.connect(this.masterGain)

      this.engineOsc.start()
    } catch (e) {
      console.warn('Engine sound setup failed', e)
    }
  }

  updateEngine(isDriving: boolean, speedKmh: number) {
    if (!this.ctx || !this.engineGain || !this.engineOsc || this.muted) return
    if (!isDriving) {
      this.engineGain.gain.setTargetAtTime(0, this.ctx.currentTime, 0.1)
      return
    }
    const targetGain = 0.12 + Math.min(0.18, (speedKmh / 80) * 0.18)
    const targetFreq = 48 + Math.min(180, (speedKmh / 60) * 120)
    this.engineGain.gain.setTargetAtTime(targetGain, this.ctx.currentTime, 0.08)
    this.engineOsc.frequency.setTargetAtTime(targetFreq, this.ctx.currentTime, 0.08)
  }

  playHorn() {
    this.ensureContext()
    if (!this.ctx || !this.masterGain || this.muted) return
    const now = this.ctx.currentTime

    // Classic Indian dual-tone car horn (440Hz + 554Hz - A4 & C#5)
    ;[440, 554].forEach(freq => {
      if (!this.ctx || !this.masterGain) return
      const osc = this.ctx.createOscillator()
      const gain = this.ctx.createGain()
      osc.type = 'triangle'
      osc.frequency.setValueAtTime(freq, now)

      gain.gain.setValueAtTime(0.2, now)
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35)

      osc.connect(gain)
      gain.connect(this.masterGain)

      osc.start(now)
      osc.stop(now + 0.36)
    })
  }

  playFootstep(surface: 'plaza' | 'road' = 'plaza') {
    this.ensureContext()
    if (!this.ctx || !this.masterGain || this.muted) return
    const now = this.ctx.currentTime

    const osc = this.ctx.createOscillator()
    const gain = this.ctx.createGain()
    osc.type = surface === 'plaza' ? 'sine' : 'triangle'
    osc.frequency.setValueAtTime(surface === 'plaza' ? 120 : 85, now)
    osc.frequency.exponentialRampToValueAtTime(40, now + 0.07)

    gain.gain.setValueAtTime(0.06, now)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.07)

    osc.connect(gain)
    gain.connect(this.masterGain)
    osc.start(now)
    osc.stop(now + 0.08)
  }

  playDiscoveryChime() {
    this.ensureContext()
    if (!this.ctx || !this.masterGain || this.muted) return
    const now = this.ctx.currentTime
    // Uplifting arpeggio: C5, E5, G5, C6
    const notes = [523.25, 659.25, 783.99, 1046.5]
    notes.forEach((freq, idx) => {
      if (!this.ctx || !this.masterGain) return
      const osc = this.ctx.createOscillator()
      const gain = this.ctx.createGain()
      osc.type = 'sine'
      osc.frequency.setValueAtTime(freq, now + idx * 0.09)

      gain.gain.setValueAtTime(0, now + idx * 0.09)
      gain.gain.linearRampToValueAtTime(0.18, now + idx * 0.09 + 0.02)
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.09 + 0.45)

      osc.connect(gain)
      gain.connect(this.masterGain)
      osc.start(now + idx * 0.09)
      osc.stop(now + idx * 0.09 + 0.46)
    })
  }

  playItemCollect() {
    this.ensureContext()
    if (!this.ctx || !this.masterGain || this.muted) return
    const now = this.ctx.currentTime
    const osc = this.ctx.createOscillator()
    const gain = this.ctx.createGain()
    osc.type = 'triangle'
    osc.frequency.setValueAtTime(659.25, now)
    osc.frequency.exponentialRampToValueAtTime(1318.51, now + 0.15)

    gain.gain.setValueAtTime(0.18, now)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22)

    osc.connect(gain)
    gain.connect(this.masterGain)
    osc.start(now)
    osc.stop(now + 0.23)
  }

  playShoppingChime() {
    this.ensureContext()
    if (!this.ctx || !this.masterGain || this.muted) return
    const now = this.ctx.currentTime
    // Elegant luxury shopping cash register / crystal chime
    const notes = [523.25, 659.25, 783.99, 1046.5]
    notes.forEach((freq, idx) => {
      if (!this.ctx || !this.masterGain) return
      const osc = this.ctx.createOscillator()
      const gain = this.ctx.createGain()
      osc.type = 'sine'
      osc.frequency.setValueAtTime(freq, now + idx * 0.06)
      gain.gain.setValueAtTime(0.16, now + idx * 0.06)
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.06 + 0.35)
      osc.connect(gain)
      gain.connect(this.masterGain)
      osc.start(now + idx * 0.06)
      osc.stop(now + idx * 0.06 + 0.36)
    })
  }

  startMusicalFountainShow(onDone?: () => void) {
    this.ensureContext()
    if (this.isMusicPlaying) return
    this.isMusicPlaying = true

    // Sector 17 musical fountain melody: rhythmic uplifting motif
    const notes = [
      440, 493.88, 554.37, 659.25, 739.99, 880, 739.99, 659.25,
      554.37, 659.25, 739.99, 880, 987.77, 1108.73, 987.77, 880
    ]
    let step = 0
    const interval = 220
    const totalSteps = notes.length * 3 // Play 3 rounds

    this.musicalFountainTimer = window.setInterval(() => {
      if (!this.ctx || !this.masterGain || this.muted) {
        step++
        if (step >= totalSteps) {
          this.stopMusicalFountainShow()
          onDone?.()
        }
        return
      }

      const freq = notes[step % notes.length]
      const now = this.ctx.currentTime

      const osc = this.ctx.createOscillator()
      const gain = this.ctx.createGain()
      osc.type = step % 4 === 0 ? 'sawtooth' : 'sine'
      osc.frequency.setValueAtTime(freq, now)

      gain.gain.setValueAtTime(0.14, now)
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3)

      osc.connect(gain)
      gain.connect(this.masterGain)
      osc.start(now)
      osc.stop(now + 0.32)

      step++
      if (step >= totalSteps) {
        this.stopMusicalFountainShow()
        onDone?.()
      }
    }, interval)
  }

  stopMusicalFountainShow() {
    if (this.musicalFountainTimer) {
      window.clearInterval(this.musicalFountainTimer)
      this.musicalFountainTimer = null
    }
    this.isMusicPlaying = false
  }

  /* ======================================================================= */
  /* SCORE CLUB 17 & DISCOTHEQUE PROCEDURAL BHANGRA-EDM AUDIO                */
  /* ======================================================================= */
  private setupClubAudio() {
    if (!this.ctx || !this.masterGain) return
    try {
      this.clubFilter = this.ctx.createBiquadFilter()
      this.clubFilter.type = 'lowpass'
      this.clubFilter.frequency.setValueAtTime(200, this.ctx.currentTime)
      this.clubFilter.Q.setValueAtTime(3.5, this.ctx.currentTime)

      this.clubGain = this.ctx.createGain()
      this.clubGain.gain.setValueAtTime(0, this.ctx.currentTime)

      this.clubFilter.connect(this.clubGain)
      this.clubGain.connect(this.masterGain)
    } catch {
      // AudioContext unavailable
    }
  }

  updateClubProximity(playerX: number, playerZ: number) {
    if (!this.ctx || !this.clubGain || !this.clubFilter) return
    const clubX = 38, clubZ = -2
    const dist = Math.hypot(playerX - clubX, playerZ - clubZ)

    if (dist > 45) {
      if (this.isClubPlaying) {
        this.clubGain.gain.setTargetAtTime(0, this.ctx.currentTime, 0.2)
        this.stopClubBeat()
      }
      return
    }

    if (!this.isClubPlaying) {
      this.startClubBeat()
    }

    const now = this.ctx.currentTime
    if (dist <= 16) {
      // Inside the club / dance floor: full high-definition crisp sound & deep punchy bass
      this.clubFilter.frequency.setTargetAtTime(14000, now, 0.12)
      this.clubGain.gain.setTargetAtTime(this.muted ? 0 : 0.42, now, 0.1)
    } else if (dist <= 26) {
      // Approaching the entrance / VIP red carpet: opening lowpass filter
      const factor = (26 - dist) / 10
      const cutoff = 400 + factor * 7000
      this.clubFilter.frequency.setTargetAtTime(cutoff, now, 0.12)
      this.clubGain.gain.setTargetAtTime(this.muted ? 0 : 0.28, now, 0.1)
    } else {
      // Outside in plaza: muffled underground subwoofer bass vibrating through concrete walls
      const factor = (45 - dist) / 19
      const cutoff = 150 + factor * 250
      this.clubFilter.frequency.setTargetAtTime(cutoff, now, 0.15)
      this.clubGain.gain.setTargetAtTime(this.muted ? 0 : 0.08 + factor * 0.12, now, 0.1)
    }
  }

  startClubBeat() {
    this.ensureContext()
    if (this.isClubPlaying) return
    this.isClubPlaying = true

    // 128 BPM -> 16th note interval = 117.18 ms
    const stepInterval = 117
    const tumbiScale = [220, 246.94, 277.18, 329.63, 369.99, 440, 493.88, 554.37]
    const bassNotes = [55, 55, 65.41, 55, 73.42, 65.41, 55, 82.41]

    this.clubTimer = window.setInterval(() => {
      if (!this.ctx || !this.clubFilter || this.muted) {
        this.clubBeatIndex = (this.clubBeatIndex + 1) % 32
        return
      }

      const now = this.ctx.currentTime
      const step = this.clubBeatIndex % 16

      // 1. PUNCHY 808 SUB KICK (Every quarter note: steps 0, 4, 8, 12)
      if (step % 4 === 0) {
        const kickOsc = this.ctx.createOscillator()
        const kickGain = this.ctx.createGain()
        kickOsc.type = 'sine'
        kickOsc.frequency.setValueAtTime(145, now)
        kickOsc.frequency.exponentialRampToValueAtTime(38, now + 0.14)

        kickGain.gain.setValueAtTime(0.85, now)
        kickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.28)

        kickOsc.connect(kickGain)
        kickGain.connect(this.clubFilter)
        kickOsc.start(now)
        kickOsc.stop(now + 0.3)
      }

      // 2. SNARE CLAP (Beats 4 and 12)
      if (step === 4 || step === 12) {
        // Highpass noise burst
        const bufferSize = this.ctx.sampleRate * 0.12
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate)
        const data = buffer.getChannelData(0)
        for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1

        const noise = this.ctx.createBufferSource()
        noise.buffer = buffer
        const snareFilter = this.ctx.createBiquadFilter()
        snareFilter.type = 'highpass'
        snareFilter.frequency.setValueAtTime(1200, now)

        const snareGain = this.ctx.createGain()
        snareGain.gain.setValueAtTime(0.35, now)
        snareGain.gain.exponentialRampToValueAtTime(0.001, now + 0.11)

        noise.connect(snareFilter)
        snareFilter.connect(snareGain)
        snareGain.connect(this.clubFilter)
        noise.start(now)
        noise.stop(now + 0.12)
      }

      // 3. HI-HATS (16th note rhythm)
      if (step % 2 === 1 || step % 4 === 2) {
        const bufferSize = this.ctx.sampleRate * 0.05
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate)
        const data = buffer.getChannelData(0)
        for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1

        const hat = this.ctx.createBufferSource()
        hat.buffer = buffer
        const hatFilter = this.ctx.createBiquadFilter()
        hatFilter.type = 'highpass'
        hatFilter.frequency.setValueAtTime(6500, now)

        const hatGain = this.ctx.createGain()
        const isOffbeat = step % 4 === 2
        hatGain.gain.setValueAtTime(isOffbeat ? 0.22 : 0.12, now)
        hatGain.gain.exponentialRampToValueAtTime(0.001, now + (isOffbeat ? 0.09 : 0.04))

        hat.connect(hatFilter)
        hatFilter.connect(hatGain)
        hatGain.connect(this.clubFilter)
        hat.start(now)
        hat.stop(now + 0.1)
      }

      // 4. ROLLING SUB-BASS (8th note pulse)
      if (step % 2 === 0) {
        const noteIdx = Math.floor(this.clubBeatIndex / 4) % bassNotes.length
        const bassFreq = bassNotes[noteIdx]
        const bassOsc = this.ctx.createOscillator()
        const bassGain = this.ctx.createGain()
        bassOsc.type = 'sawtooth'
        bassOsc.frequency.setValueAtTime(bassFreq, now)

        bassGain.gain.setValueAtTime(0.28, now)
        bassGain.gain.exponentialRampToValueAtTime(0.01, now + 0.18)

        bassOsc.connect(bassGain)
        bassGain.connect(this.clubFilter)
        bassOsc.start(now)
        bassOsc.stop(now + 0.2)
      }

      // 5. CATCHY PUNJABI BHANGRA / TUMBI SYNTH RIFF
      if (step % 2 === 0 || step === 3 || step === 7 || step === 11) {
        const riffSeq = [0, 2, 4, 3, 5, 4, 2, 0, 7, 5, 4, 2, 4, 5, 7, 4]
        const note = tumbiScale[riffSeq[this.clubBeatIndex % riffSeq.length]]
        const synthOsc = this.ctx.createOscillator()
        const synthGain = this.ctx.createGain()
        synthOsc.type = 'triangle'
        synthOsc.frequency.setValueAtTime(note, now)
        synthOsc.frequency.exponentialRampToValueAtTime(note * 1.02, now + 0.08)

        synthGain.gain.setValueAtTime(0.18, now)
        synthGain.gain.exponentialRampToValueAtTime(0.001, now + 0.16)

        synthOsc.connect(synthGain)
        synthGain.connect(this.clubFilter)
        synthOsc.start(now)
        synthOsc.stop(now + 0.18)
      }

      this.clubBeatIndex = (this.clubBeatIndex + 1) % 32
    }, stepInterval)
  }

  stopClubBeat() {
    if (this.clubTimer) {
      window.clearInterval(this.clubTimer)
      this.clubTimer = null
    }
    this.isClubPlaying = false
  }

  playDjDrop() {
    this.ensureContext()
    if (!this.ctx || !this.masterGain || this.muted) return
    const now = this.ctx.currentTime

    // A. Triple DJ Airhorn blast: "BWA-BWA-BWA-BWAAAH!"
    const hornPitches = [466.16, 587.33, 700] // Bb chord
    const blasts = [0, 0.14, 0.28, 0.44]
    blasts.forEach((timeOffset, idx) => {
      const dur = idx === 3 ? 0.45 : 0.1
      hornPitches.forEach(pitch => {
        if (!this.ctx || !this.masterGain) return
        const osc = this.ctx.createOscillator()
        const gain = this.ctx.createGain()
        osc.type = 'sawtooth'
        osc.frequency.setValueAtTime(pitch, now + timeOffset)

        gain.gain.setValueAtTime(0.15, now + timeOffset)
        gain.gain.exponentialRampToValueAtTime(0.001, now + timeOffset + dur)

        osc.connect(gain)
        gain.connect(this.masterGain)
        osc.start(now + timeOffset)
        osc.stop(now + timeOffset + dur + 0.02)
      })
    })

    // B. Massive Sub-Bass Drop impact at +0.9s
    const dropTime = now + 0.9
    const subOsc = this.ctx.createOscillator()
    const subGain = this.ctx.createGain()
    subOsc.type = 'sine'
    subOsc.frequency.setValueAtTime(110, dropTime)
    subOsc.frequency.exponentialRampToValueAtTime(28, dropTime + 0.7)

    subGain.gain.setValueAtTime(0.9, dropTime)
    subGain.gain.exponentialRampToValueAtTime(0.001, dropTime + 1.2)

    subOsc.connect(subGain)
    subGain.connect(this.masterGain)
    subOsc.start(dropTime)
    subOsc.stop(dropTime + 1.25)
  }

  // Shopping purchase Ka-Ching sound
  playCashRegister() {
    this.ensureContext()
    if (!this.ctx || !this.masterGain || this.muted) return
    const now = this.ctx.currentTime

    // Coin chime 1
    const osc1 = this.ctx.createOscillator()
    const gain1 = this.ctx.createGain()
    osc1.type = 'triangle'
    osc1.frequency.setValueAtTime(987.77, now) // B5
    osc1.frequency.setValueAtTime(1318.51, now + 0.08) // E6
    gain1.gain.setValueAtTime(0.3, now)
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.45)
    osc1.connect(gain1)
    gain1.connect(this.masterGain)
    osc1.start(now)
    osc1.stop(now + 0.46)

    // Metal drawer chime
    const osc2 = this.ctx.createOscillator()
    const gain2 = this.ctx.createGain()
    osc2.type = 'sine'
    osc2.frequency.setValueAtTime(1760, now + 0.09) // A6
    gain2.gain.setValueAtTime(0.25, now + 0.09)
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.6)
    osc2.connect(gain2)
    gain2.connect(this.masterGain)
    osc2.start(now + 0.09)
    osc2.stop(now + 0.62)
  }

  // Bar drink clink & fizz sound
  playDrinkToast() {
    this.ensureContext()
    if (!this.ctx || !this.masterGain || this.muted) return
    const now = this.ctx.currentTime

    // Glass clink
    const glass = this.ctx.createOscillator()
    const glassGain = this.ctx.createGain()
    glass.type = 'sine'
    glass.frequency.setValueAtTime(2489, now) // D#7
    glassGain.gain.setValueAtTime(0.28, now)
    glassGain.gain.exponentialRampToValueAtTime(0.001, now + 0.8)
    glass.connect(glassGain)
    glassGain.connect(this.masterGain)
    glass.start(now)
    glass.stop(now + 0.85)
  }

  // Movie / Multiplex cinematic swell
  playCinemaTheme() {
    this.ensureContext()
    if (!this.ctx || !this.masterGain || this.muted) return
    const now = this.ctx.currentTime

    // Grand cinematic minor chord swell (C - Eb - G - Bb)
    const chord = [130.81, 155.56, 196.0, 233.08]
    chord.forEach((freq, idx) => {
      if (!this.ctx || !this.masterGain) return
      const osc = this.ctx.createOscillator()
      const gain = this.ctx.createGain()
      osc.type = 'sawtooth'
      osc.frequency.setValueAtTime(freq, now)

      const filter = this.ctx.createBiquadFilter()
      filter.type = 'lowpass'
      filter.frequency.setValueAtTime(300, now)
      filter.frequency.exponentialRampToValueAtTime(1800, now + 1.2)

      gain.gain.setValueAtTime(0.01, now)
      gain.gain.linearRampToValueAtTime(0.12, now + 1.0)
      gain.gain.exponentialRampToValueAtTime(0.001, now + 3.8)

      osc.connect(filter)
      filter.connect(gain)
      gain.connect(this.masterGain)
      osc.start(now + idx * 0.05)
      osc.stop(now + 3.9)
    })
  }
}

export const sound = new SoundManager()
