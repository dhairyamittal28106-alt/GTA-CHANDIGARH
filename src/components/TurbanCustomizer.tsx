import React from 'react'
import type { TurbanStyle } from './PunjabiTurban'

export interface TurbanConfig {
  style: TurbanStyle
  color: string
  fiftyColor: string
  hasKalgi: boolean
  hasBeard: boolean
  beardColor?: string
}

export const TURBAN_PRESETS = [
  {
    name: 'Classic Patiala',
    desc: 'Iconic 6-pleat royal red with crisp cream fifty & groomed mooch',
    config: {
      style: 'patiala' as TurbanStyle,
      color: '#b81d24',
      fiftyColor: '#f5eedb',
      hasKalgi: false,
      hasBeard: true,
    },
  },
  {
    name: 'Patiala Navy Shahi',
    desc: 'Aristocratic deep navy blue with pure white fifty',
    config: {
      style: 'patiala' as TurbanStyle,
      color: '#1d3557',
      fiftyColor: '#ffffff',
      hasKalgi: false,
      hasBeard: true,
    },
  },
  {
    name: 'Maharaja Royal',
    desc: 'Festive royal crimson with 18K gold Kalgi plume & ruby gem',
    config: {
      style: 'royal' as TurbanStyle,
      color: '#8b0000',
      fiftyColor: '#ffd166',
      hasKalgi: true,
      hasBeard: true,
    },
  },
  {
    name: 'Saffron Kesari',
    desc: 'Vibrant Punjab saffron with jet-black fifty & upturned mooch',
    config: {
      style: 'patiala' as TurbanStyle,
      color: '#e67e22',
      fiftyColor: '#111111',
      hasKalgi: false,
      hasBeard: true,
    },
  },
  {
    name: 'Amritsari Morni',
    desc: 'Steep angled pleats with sharp pointed peacock peak (nok)',
    config: {
      style: 'morni' as TurbanStyle,
      color: '#7b1113',
      fiftyColor: '#ffd166',
      hasKalgi: false,
      hasBeard: true,
    },
  },
  {
    name: 'Khalsa Dumalla',
    desc: 'Traditional warrior coiled dastar with steel Chakar (quoit)',
    config: {
      style: 'dumalla' as TurbanStyle,
      color: '#0f2942',
      fiftyColor: '#ffffff',
      hasKalgi: false,
      hasBeard: true,
    },
  },
]

export const TURBAN_COLORS = [
  { name: 'Royal Red', hex: '#b81d24' },
  { name: 'Patiala Navy', hex: '#1d3557' },
  { name: 'Saffron Kesari', hex: '#e67e22' },
  { name: 'Khalsa Green', hex: '#1b4332' },
  { name: 'Royal Maroon', hex: '#7b1113' },
  { name: 'Pure Voile White', hex: '#f8fafc' },
  { name: 'Midnight Black', hex: '#18181b' },
  { name: 'Basanti Gold', hex: '#d4971c' },
]

export const FIFTY_COLORS = [
  { name: 'Crisp Cream', hex: '#f5eedb' },
  { name: 'Pure White', hex: '#ffffff' },
  { name: 'Mustard Gold', hex: '#ffd166' },
  { name: 'Jet Black', hex: '#111111' },
  { name: 'Crimson Red', hex: '#e63946' },
  { name: 'Sky Blue', hex: '#48cae4' },
]

interface Props {
  config: TurbanConfig
  onChange: (config: TurbanConfig) => void
  onClose: () => void
  onCameraFront: () => void
  onOpenPostcard: () => void
}

export const TurbanCustomizer: React.FC<Props> = ({
  config,
  onChange,
  onClose,
  onCameraFront,
  onOpenPostcard,
}) => {
  const update = (partial: Partial<TurbanConfig>) => {
    onChange({ ...config, ...partial })
  }

  return (
    <div className="turban-modal-overlay" onClick={onClose}>
      <div className="turban-modal-dialog" onClick={e => e.stopPropagation()}>
         
        <div className="turban-modal-header">
          <div className="turban-title-row">
            <span className="turban-badge">HERITAGE CULTURE</span>
            <h2>Pagg & Dastar Studio</h2>
          </div>
          <button className="turban-close-btn" onClick={onClose}>
            ✕
          </button>
        </div>

        <p className="turban-subtitle">
          Customize your authentic Punjabi turban (dastar) with traditional Patiala Shahi folds,
          forehead fifty, royal Kalgi plume, and groomed mustache.
        </p>

        <div className="turban-modal-body">
           
          <div className="turban-camera-bar">
            <span>👀 Tip: Switch to Portrait View to admire folds up close!</span>
            <button className="turban-btn-secondary" onClick={onCameraFront}>
              Face / Portrait View
            </button>
          </div>

           
          <div className="turban-section">
            <div className="turban-section-title">Iconic Punjabi Styles</div>
            <div className="turban-presets-grid">
              {TURBAN_PRESETS.map((p, i) => (
                <button
                  key={i}
                  className={`turban-preset-card ${
                    config.style === p.config.style && config.color === p.config.color
                      ? 'active'
                      : ''
                  }`}
                  onClick={() => onChange(p.config)}
                >
                  <div
                    className="turban-preset-preview"
                    style={{
                      background: `linear-gradient(135deg, ${p.config.color} 70%, ${p.config.fiftyColor} 100%)`,
                    }}
                  />
                  <div className="turban-preset-info">
                    <div className="turban-preset-name">{p.name}</div>
                    <div className="turban-preset-desc">{p.desc}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

           
          <div className="turban-section">
            <div className="turban-section-title">Dastar Tying Style</div>
            <div className="turban-style-tabs">
              <button
                className={`turban-style-tab ${config.style === 'patiala' ? 'active' : ''}`}
                onClick={() => update({ style: 'patiala' })}
              >
                <strong>Patiala Shahi</strong>
                <small>6 cascading pleats & round golai</small>
              </button>
              <button
                className={`turban-style-tab ${config.style === 'royal' ? 'active' : ''}`}
                onClick={() => update({ style: 'royal', hasKalgi: true })}
              >
                <strong>Royal Festive</strong>
                <small>Gold Kalgi & ruby plume</small>
              </button>
              <button
                className={`turban-style-tab ${config.style === 'morni' ? 'active' : ''}`}
                onClick={() => update({ style: 'morni' })}
              >
                <strong>Amritsari Morni</strong>
                <small>Steep pleats & sharp apex nok</small>
              </button>
              <button
                className={`turban-style-tab ${config.style === 'dumalla' ? 'active' : ''}`}
                onClick={() => update({ style: 'dumalla' })}
              >
                <strong>Warrior Dumalla</strong>
                <small>Concentric rings & steel Chakar</small>
              </button>
            </div>
          </div>

           
          <div className="turban-section">
            <div className="turban-section-title">
              Turban Cloth Color (Voile / Rubia)
            </div>
            <div className="turban-swatch-grid">
              {TURBAN_COLORS.map(c => (
                <button
                  key={c.hex}
                  className={`turban-swatch-btn ${config.color === c.hex ? 'active' : ''}`}
                  style={{ backgroundColor: c.hex }}
                  onClick={() => update({ color: c.hex })}
                  title={c.name}
                >
                  {config.color === c.hex && <span className="swatch-check">✓</span>}
                </button>
              ))}
            </div>
          </div>

           
          <div className="turban-section">
            <div className="turban-section-title">
              Forehead "Fifty" Under-wrap Strip
            </div>
            <div className="turban-swatch-grid">
              {FIFTY_COLORS.map(c => (
                <button
                  key={c.hex}
                  className={`turban-swatch-btn ${config.fiftyColor === c.hex ? 'active' : ''}`}
                  style={{ backgroundColor: c.hex }}
                  onClick={() => update({ fiftyColor: c.hex })}
                  title={c.name}
                >
                  {config.fiftyColor === c.hex && <span className="swatch-check">✓</span>}
                </button>
              ))}
            </div>
          </div>

           
          <div className="turban-section">
            <div className="turban-section-title">Cultural Heritage Details</div>
            <div className="turban-toggles-row">
              <label className="turban-checkbox-label">
                <input
                  type="checkbox"
                  checked={config.hasKalgi}
                  onChange={e => update({ hasKalgi: e.target.checked })}
                />
                <span>👑 Royal Kalgi Brooch (Gold & Ruby Plume)</span>
              </label>
            </div>
          </div>
        </div>

         
        <div className="turban-modal-footer">
          <button className="turban-btn-souvenir" onClick={onOpenPostcard}>
            📸 Snap Souvenir Portrait
          </button>
          <button className="turban-btn-primary" onClick={onClose}>
            Apply & Stroll Plaza
          </button>
        </div>
      </div>
    </div>
  )
}
