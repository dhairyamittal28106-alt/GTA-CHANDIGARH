import { useMemo } from 'react'
import { EffectComposer, Bloom, Vignette, ToneMapping } from '@react-three/postprocessing'
import { ToneMappingMode } from 'postprocessing'
import { ContactShadows, Environment, Sparkles } from '@react-three/drei'

interface GraphicsEffectsProps {
  timeOfDay: 'day' | 'sunset' | 'night'
}

export function GraphicsEffects({ timeOfDay }: GraphicsEffectsProps) {
  const isNight = timeOfDay === 'night'
  const isSunset = timeOfDay === 'sunset'

  // Dynamic bloom intensity based on night vs day
  const bloomIntensity = useMemo(() => {
    return isNight ? 0.8 : isSunset ? 0.45 : 0.22
  }, [isNight, isSunset])

  return (
    <>
      {/* PBR Environment Light Reflections (Gives rich specular sheen to cars, metal, water, glass) */}
      <Environment
        // Keep the HDR environment stable across clock changes. Switching
        // presets triggers a suspended HDR fetch and can blank the Canvas on
        // slow/offline connections; the local lighting rig handles night.
        preset="city"
        environmentIntensity={isNight ? 0.35 : isSunset ? 0.75 : 0.85}
      />

      {/* Global Ground Ambient Occlusion Contact Shadows (Baked once with frames={1} to eliminate heavy per-frame GPU re-rendering lag) */}
      <ContactShadows
        position={[0, 0.02, 0]}
        opacity={isNight ? 0.45 : 0.7}
        scale={120}
        blur={2.0}
        far={6}
        resolution={512}
        frames={1}
        color="#151d19"
      />

      {/* Fountain Mist Droplet Sparkles */}
      <Sparkles
        count={85}
        scale={[18, 5, 18]}
        position={[0, 2.2, 0]}
        size={2.8}
        speed={0.4}
        color={isNight ? '#64dfdf' : '#dcf8f6'}
      />

      {/* Atmospheric Night Fireflies / Plaza Ambient Motes */}
      {isNight && (
        <Sparkles
          count={75}
          scale={[90, 4, 90]}
          position={[0, 2.0, 0]}
          size={3.5}
          speed={0.2}
          color="#ffd166"
        />
      )}

      {/* AAA Post-Processing Pipeline */}
      <EffectComposer multisampling={2}>
        {/* Cinematic Luminous Glow for Neon Signs, Marquees, Streetlights & Water */}
        <Bloom
          luminanceThreshold={0.8}
          mipmapBlur
          intensity={bloomIntensity}
          radius={0.65}
        />

        {/* Subtle Lens Vignette framing the city view */}
        <Vignette
          eskil={false}
        offset={0.22}
        darkness={isNight ? 0.38 : 0.18}
        />

        {/* ACES Filmic Tone Mapping for Photorealistic Dynamic Range */}
        <ToneMapping mode={ToneMappingMode.ACES_FILMIC} />
      </EffectComposer>
    </>
  )
}
