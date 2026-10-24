import { useMemo, useState } from 'react'
import {
  useCharacterShopStore,
  SHOP_CATALOG,
  type ShopItem,
} from './CharacterAndShopStore'
import { sound } from './AudioEngine'

export function ShoppingModal() {
  const {
    activeShop,
    closeShop,
    cash,
    inventory,
    equippedShoes,
    equippedTop,
    equippedAccessory,
    buyItem,
    equipItem,
    unequipItem,
  } = useCharacterShopStore()

  const [selectedCategory, setSelectedCategory] = useState<'all' | 'shoes' | 'apparel' | 'accessory'>('all')
  const [activeItem, setActiveItem] = useState<ShopItem | null>(null)

  // Filter items by active shop brand
  const brandItems = useMemo(() => {
    if (!activeShop) return []
    return SHOP_CATALOG.filter(
      (item) => item.brand === activeShop || item.brand === 'chandigarh'
    )
  }, [activeShop])

  const filteredItems = useMemo(() => {
    if (selectedCategory === 'all') return brandItems
    return brandItems.filter((i) => i.category === selectedCategory)
  }, [brandItems, selectedCategory])

  if (!activeShop) return null

  const brandInfo = {
    nike: {
      title: 'NIKE FLAGSHIP STORE',
      subtitle: 'Sector 17-C Piazza · Just Do It',
      badgeColor: '#ff5500',
      heroBg: 'linear-gradient(135deg, #111111 0%, #2a1100 100%)',
    },
    adidas: {
      title: 'ADIDAS ORIGINALS BOUTIQUE',
      subtitle: 'Sector 17-C Showroom · Impossible Is Nothing',
      badgeColor: '#0284c7',
      heroBg: 'linear-gradient(135deg, #091e30 0%, #004d61 100%)',
    },
    reebok: {
      title: 'REEBOK CLASSIC HERITAGE',
      subtitle: 'SCO 42-43 Sector 17-D · Life Is Not A Spectator Sport',
      badgeColor: '#e63946',
      heroBg: 'linear-gradient(135deg, #1d0f14 0%, #3d1219 100%)',
    },
    skechers: {
      title: 'SKECHERS COMFORT SHOWROOM',
      subtitle: 'Sector 17 Commercial Corbusier Wing · Hands-Free Tech',
      badgeColor: '#06b6d4',
      heroBg: 'linear-gradient(135deg, #091726 0%, #082f49 100%)',
    },
  }[activeShop]

  const currentPreview = activeItem || filteredItems[0] || null

  const isPurchased = (item: ShopItem) => inventory.includes(item.id)
  const isEquipped = (item: ShopItem) =>
    equippedShoes === item.id ||
    equippedTop === item.id ||
    equippedAccessory === item.id

  const handleAction = (item: ShopItem) => {
    if (!isPurchased(item)) {
      const ok = buyItem(item)
      if (!ok) {
        alert('Insufficient Chandigarh Cash! Explore Sector 17 landmarks or dance in the club to earn cash.')
      }
    } else {
      if (isEquipped(item)) {
        unequipItem(item.category)
      } else {
        equipItem(item)
        sound.playDiscoveryChime()
      }
    }
  }

  return (
    <div className="shop-overlay" onClick={closeShop}>
      <div
        className="shop-modal"
        onClick={(e) => e.stopPropagation()}
        style={{ borderColor: brandInfo.badgeColor }}
      >
        {/* Header Bar */}
        <div className="shop-header" style={{ background: brandInfo.heroBg }}>
          <div className="shop-header-title">
            <span
              className="shop-brand-badge"
              style={{ background: brandInfo.badgeColor }}
            >
              {activeShop.toUpperCase()}
            </span>
            <div>
              <h2>{brandInfo.title}</h2>
              <p>{brandInfo.subtitle}</p>
            </div>
          </div>

          <div className="shop-wallet-box">
            <span className="wallet-label">Chandigarh Cash</span>
            <span className="wallet-amount">₹{cash.toLocaleString()}</span>
          </div>

          <button className="shop-close-btn" onClick={closeShop}>
            ✕
          </button>
        </div>

        {/* Category Tabs */}
        <div className="shop-tabs">
          {(['all', 'shoes', 'apparel', 'accessory'] as const).map((tab) => (
            <button
              key={tab}
              className={`shop-tab ${selectedCategory === tab ? 'active' : ''}`}
              onClick={() => setSelectedCategory(tab)}
              style={
                selectedCategory === tab
                  ? { borderBottomColor: brandInfo.badgeColor, color: '#ffffff' }
                  : {}
              }
            >
              {tab.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Main Content: Item Grid + Preview Panel */}
        <div className="shop-body">
          {/* Left: Items Grid */}
          <div className="shop-items-grid">
            {filteredItems.map((item) => {
              const owned = isPurchased(item)
              const equipped = isEquipped(item)
              const selected = currentPreview?.id === item.id

              return (
                <div
                  key={item.id}
                  className={`shop-card ${selected ? 'selected' : ''}`}
                  onClick={() => setActiveItem(item)}
                  style={{
                    borderColor: selected ? brandInfo.badgeColor : 'rgba(255,255,255,0.1)',
                  }}
                >
                  <div className="shop-card-badge">{item.tag}</div>

                  {/* Visual color swatch / preview silhouette */}
                  <div
                    className="shop-card-swatch"
                    style={{
                      background: `linear-gradient(135deg, ${item.color} 0%, ${item.accentColor} 100%)`,
                    }}
                  >
                    <span className="swatch-icon">
                      {item.category === 'shoes' ? '👟' : item.category === 'apparel' ? '👕' : '🕶️'}
                    </span>
                  </div>

                  <div className="shop-card-info">
                    <h4>{item.name}</h4>
                    <p className="shop-card-price">
                      {owned ? (
                        <span className="owned-tag">
                          {equipped ? '✓ EQUIPPED' : 'OWNED'}
                        </span>
                      ) : (
                        `₹${item.price.toLocaleString()}`
                      )}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Right: Selected Item Showcase & Buy/Equip CTA */}
          {currentPreview && (
            <div className="shop-preview-pane">
              <div
                className="preview-showcase"
                style={{
                  background: `radial-gradient(circle at center, ${currentPreview.color}33 0%, #0b1118 75%)`,
                }}
              >
                <div
                  className="preview-hero-icon"
                  style={{
                    boxShadow: `0 12px 36px ${currentPreview.color}55`,
                  }}
                >
                  {currentPreview.category === 'shoes'
                    ? '👟'
                    : currentPreview.category === 'apparel'
                    ? '👕'
                    : '🕶️'}
                </div>
                <div className="preview-hero-tag">{currentPreview.brand.toUpperCase()} ORIGINAL</div>
              </div>

              <div className="preview-details">
                <h3>{currentPreview.name}</h3>
                <p className="preview-desc">{currentPreview.description}</p>

                <div className="preview-specs">
                  <div className="spec-row">
                    <span>Category:</span>
                    <strong>{currentPreview.category.toUpperCase()}</strong>
                  </div>
                  <div className="spec-row">
                    <span>Style Code:</span>
                    <strong>CHD-{currentPreview.id.slice(0, 6).toUpperCase()}</strong>
                  </div>
                  <div className="spec-row">
                    <span>Authenticity:</span>
                    <strong style={{ color: '#10b981' }}>100% Verified Sector 17 Official</strong>
                  </div>
                </div>

                <div className="preview-footer">
                  <div className="price-tag">
                    {isPurchased(currentPreview) ? (
                      <span className="purchased-label">ALREADY IN WARDROBE</span>
                    ) : (
                      <>
                        <span className="price-label">Retail Price</span>
                        <span className="price-num">
                          ₹{currentPreview.price.toLocaleString()}
                        </span>
                      </>
                    )}
                  </div>

                  <button
                    className={`shop-action-btn ${
                      isEquipped(currentPreview)
                        ? 'equipped'
                        : isPurchased(currentPreview)
                        ? 'equip'
                        : 'buy'
                    }`}
                    onClick={() => handleAction(currentPreview)}
                    style={{
                      background: isEquipped(currentPreview)
                        ? '#334155'
                        : brandInfo.badgeColor,
                    }}
                  >
                    {isEquipped(currentPreview)
                      ? 'UNEQUIP ITEM'
                      : isPurchased(currentPreview)
                      ? 'EQUIP ON CHARACTER'
                      : `BUY NOW (₹${currentPreview.price.toLocaleString()})`}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
