import { useCharacterShopStore, type CharacterArchetype, type FemaleOutfitStyle, type Hairstyle } from './CharacterAndShopStore'
import { TURBAN_PRESETS } from './TurbanCustomizer'
import { sound } from './AudioEngine'

export function CharacterStudioModal() {
  const {
    isStudioOpen,
    toggleStudio,
    charConfig,
    setArchetype,
    setCharConfig,
    equippedShoes,
  } = useCharacterShopStore()

  if (!isStudioOpen) return null

  const archetypes: { id: CharacterArchetype; label: string; tag: string; icon: string; desc: string }[] = [
    {
      id: 'sardar',
      label: 'Sardar Ji',
      tag: 'AUTHENTIC HERITAGE',
      icon: '👳🏽‍♂️',
      desc: 'Iconic Punjabi Sikh character with authentic turbans (Patiala Shahi, Morni, Dumalla), royal beard, and traditional or modern style.',
    },
    {
      id: 'man',
      label: 'Urban Man',
      tag: 'CHANDIGARH STREETSTYLE',
      icon: '🧔🏻',
      desc: 'Modern Chandigarh guy with textured fade/pompadour hair, clean or stubble beard, and sleek streetwear.',
    },
    {
      id: 'girl',
      label: 'Chandigarh Girl',
      tag: 'FASHION & CHIC',
      icon: '👩🏻',
      desc: 'Elegant Chandigarh girl with choice of Punjabi Phulkari Salwar Suit, Elante Mall Chic, or Score Club party outfits with traditional Parandi braid & Jhumkas.',
    },
  ]

  const girlOutfits: { id: FemaleOutfitStyle; name: string; topCol: string; botCol: string }[] = [
    { id: 'punjabi_suit', name: 'Phulkari Salwar Suit', topCol: '#ec4899', botCol: '#fde047' },
    { id: 'western_casual', name: 'Urban Denim & Jacket', topCol: '#0284c7', botCol: '#1e293b' },
    { id: 'elante_chic', name: 'Elante Mall Shopping Chic', topCol: '#f8fafc', botCol: '#334155' },
    { id: 'club_glam', name: 'Score Club Glam Party', topCol: '#7928ca', botCol: '#0f172a' },
  ]

  const maleHairstyles: { id: Hairstyle; name: string }[] = [
    { id: 'pompadour', name: 'Classic Pompadour' },
    { id: 'crop_fade', name: 'Textured Crop Fade' },
    { id: 'messy_quiff', name: 'Modern Quiff' },
  ]

  const femaleHairstyles: { id: Hairstyle; name: string }[] = [
    { id: 'girl_braid', name: 'Long Punjabi Braid + Parandi' },
    { id: 'girl_ponytail', name: 'Sleek High Ponytail' },
    { id: 'girl_bob', name: 'Modern Shoulder Waves' },
  ]

  const colorPalette = [
    { name: 'Rani Pink', hex: '#ec4899' },
    { name: 'Royal Kesri', hex: '#ea580c' },
    { name: 'Turmeric Yellow', hex: '#facc15' },
    { name: 'Punjab Emerald', hex: '#15803d' },
    { name: 'Shivalik Sky Blue', hex: '#0284c7' },
    { name: 'Corbusier Grey', hex: '#64748b' },
    { name: 'Midnight Jet', hex: '#0f172a' },
    { name: 'Crisp White', hex: '#f8fafc' },
    { name: 'Deep Crimson', hex: '#b91c1c' },
  ]

  return (
    <div className="shop-overlay" onClick={() => toggleStudio(false)}>
      <div className="character-studio-modal" onClick={(e) => e.stopPropagation()}>
        <div className="studio-header">
          <div>
            <h2>CHANDIGARH CHARACTER & WARDROBE STUDIO</h2>
            <p>Customize your avatar style, archetype, Punjabi heritage turbans, and designer outfits</p>
          </div>
          <button className="shop-close-btn" onClick={() => toggleStudio(false)}>
            ✕
          </button>
        </div>

        <div className="archetype-grid">
          {archetypes.map((arch) => {
            const active = charConfig.archetype === arch.id
            return (
              <div
                key={arch.id}
                className={`archetype-card ${active ? 'active' : ''}`}
                onClick={() => setArchetype(arch.id)}
              >
                <div className="archetype-icon">{arch.icon}</div>
                <div className="archetype-badge">{arch.tag}</div>
                <h3>{arch.label}</h3>
                <p>{arch.desc}</p>
                {active && <span className="active-check">✓ ACTIVE AVATAR</span>}
              </div>
            )
          })}
        </div>

        <div className="studio-controls-pane">
          {charConfig.archetype === 'sardar' && (
            <div className="studio-section">
              <h3>👑 PUNJABI TURBAN & BEARD (DSTAAR)</h3>
              <p className="section-subtitle">Select royal tying styles and authentic colors</p>

              <div className="preset-buttons-row">
                {TURBAN_PRESETS.map((preset) => (
                  <button
                    key={preset.name}
                    className={`preset-chip ${charConfig.turban.style === preset.config.style ? 'active' : ''}`}
                    onClick={() => {
                      setCharConfig({ turban: { ...charConfig.turban, ...preset.config } })
                      sound.playDiscoveryChime()
                    }}
                  >
                    {preset.name}
                  </button>
                ))}
              </div>

              <label className="input-label">Turban Fabric Color</label>
              <div className="color-swatch-row">
                {colorPalette.map((col) => (
                  <button
                    key={col.hex}
                    className={`color-circle ${charConfig.turban.color === col.hex ? 'active' : ''}`}
                    style={{ background: col.hex }}
                    title={col.name}
                    onClick={() =>
                      setCharConfig({
                        turban: { ...charConfig.turban, color: col.hex },
                      })
                    }
                  />
                ))}
              </div>

              <div className="toggle-row">
                <label className="toggle-item">
                  <input
                    type="checkbox"
                    checked={charConfig.turban.hasKalgi}
                    onChange={(e) =>
                      setCharConfig({
                        turban: { ...charConfig.turban, hasKalgi: e.target.checked },
                      })
                    }
                  />
                  <span>Royal Kalgi (Brooch & Plume)</span>
                </label>

                <label className="toggle-item">
                  <input
                    type="checkbox"
                    checked={charConfig.turban.hasBeard}
                    onChange={(e) =>
                      setCharConfig({
                        turban: { ...charConfig.turban, hasBeard: e.target.checked },
                      })
                    }
                  />
                  <span>Royal Styled Beard</span>
                </label>
              </div>
            </div>
          )}

          {charConfig.archetype === 'man' && (
            <div className="studio-section">
              <h3>✂️ URBAN HAIRSTYLE & GROOMING</h3>
              <div className="preset-buttons-row">
                {maleHairstyles.map((hs) => (
                  <button
                    key={hs.id}
                    className={`preset-chip ${charConfig.hairstyle === hs.id ? 'active' : ''}`}
                    onClick={() => {
                      setCharConfig({ hairstyle: hs.id })
                      sound.playDiscoveryChime()
                    }}
                  >
                    {hs.name}
                  </button>
                ))}
              </div>

              <label className="input-label">Hair Color</label>
              <div className="color-swatch-row">
                {['#111111', '#2d1b0d', '#4a3728', '#7c6045'].map((hex) => (
                  <button
                    key={hex}
                    className={`color-circle ${charConfig.hairColor === hex ? 'active' : ''}`}
                    style={{ background: hex }}
                    onClick={() => setCharConfig({ hairColor: hex })}
                  />
                ))}
              </div>
            </div>
          )}

          {charConfig.archetype === 'girl' && (
            <div className="studio-section">
              <h3>🌸 CHANDIGARH GIRL STYLING</h3>
              <div className="preset-buttons-row">
                {femaleHairstyles.map((hs) => (
                  <button
                    key={hs.id}
                    className={`preset-chip ${charConfig.hairstyle === hs.id ? 'active' : ''}`}
                    onClick={() => {
                      setCharConfig({ hairstyle: hs.id })
                      sound.playDiscoveryChime()
                    }}
                  >
                    {hs.name}
                  </button>
                ))}
              </div>

              <label className="input-label">Signature Outfit Style</label>
              <div className="preset-buttons-row">
                {girlOutfits.map((outfit) => (
                  <button
                    key={outfit.id}
                    className={`preset-chip ${charConfig.femaleOutfit === outfit.id ? 'active' : ''}`}
                    onClick={() => {
                      setCharConfig({
                        femaleOutfit: outfit.id,
                        topColor: outfit.topCol,
                        bottomColor: outfit.botCol,
                      })
                      sound.playDiscoveryChime()
                    }}
                  >
                    {outfit.name}
                  </button>
                ))}
              </div>

              <div className="toggle-row">
                <label className="toggle-item">
                  <input
                    type="checkbox"
                    checked={charConfig.hasJhumkas}
                    onChange={(e) => setCharConfig({ hasJhumkas: e.target.checked })}
                  />
                  <span>Traditional Golden Jhumkas (Earrings)</span>
                </label>
              </div>
            </div>
          )}

          <div className="studio-section">
            <h3>🕶️ ACCESSORIES & SHOPPING SWAG</h3>
            <div className="toggle-row">
              <label className="toggle-item">
                <input
                  type="checkbox"
                  checked={charConfig.hasEyewear}
                  onChange={(e) => setCharConfig({ hasEyewear: e.target.checked })}
                />
                <span>Sector 17 Aviator Sunglasses</span>
              </label>

              <label className="toggle-item">
                <input
                  type="checkbox"
                  checked={charConfig.hasShoppingBags}
                  onChange={(e) => setCharConfig({ hasShoppingBags: e.target.checked })}
                />
                <span>Carry Luxury Shopping Bags (Nike / Adidas / Skechers)</span>
              </label>

              <label className="toggle-item">
                <input
                  type="checkbox"
                  checked={charConfig.hasDrink}
                  onChange={(e) => setCharConfig({ hasDrink: e.target.checked })}
                />
                <span>Hold Club Beverage / Mocktail</span>
              </label>
            </div>

            <label className="input-label">Upper Clothing Color (Kurta / Top / Jacket)</label>
            <div className="color-swatch-row">
              {colorPalette.map((col) => (
                <button
                  key={col.hex}
                  className={`color-circle ${charConfig.topColor === col.hex ? 'active' : ''}`}
                  style={{ background: col.hex }}
                  title={col.name}
                  onClick={() => setCharConfig({ topColor: col.hex })}
                />
              ))}
            </div>

            <div className="equipped-summary-box">
              <span>Equipped Footwear:</span>
              <strong>
                {equippedShoes
                  ? equippedShoes.replace(/_/g, ' ').toUpperCase()
                  : 'Sector 17 Street Shoes'}
              </strong>
              <span className="shop-hint">
                (Visit the Nike, Adidas, Reebok, or Skechers showrooms to purchase more shoes!)
              </span>
            </div>
          </div>
        </div>

        <div className="studio-footer">
          <button className="confirm-btn" onClick={() => toggleStudio(false)}>
            APPLY STYLING & EXPLORE SECTOR 17
          </button>
        </div>
      </div>
    </div>
  )
}
