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

  
  const bloomIntensity = useMemo(() => {
    return isNight ? 0.42 : isSunset ? 0.36 : 0.22
  }, [isNight, isSunset])

  return (
    <>
       
      <Environment
        
        
        
        preset="city"
        environmentIntensity={isNight ? 0.12 : isSunset ? 0.75 : 0.85}
      />

       
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

       
      <Sparkles
        count={85}
        scale={[18, 5, 18]}
        position={[0, 2.2, 0]}
        size={2.8}
        speed={0.4}
        color={isNight ? '#64dfdf' : '#dcf8f6'}
      />

       
      <EffectComposer multisampling={0}>
         
        <Bloom
          luminanceThreshold={0.8}
          mipmapBlur
          intensity={bloomIntensity}
          radius={0.65}
        />

         
        <Vignette
          eskil={false}
        offset={0.22}
        darkness={isNight ? 0.38 : 0.18}
        />

         
        <ToneMapping mode={ToneMappingMode.ACES_FILMIC} />
      </EffectComposer>
    </>
  )
}
