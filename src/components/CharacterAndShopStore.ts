import { create } from 'zustand'
import { sound } from './AudioEngine'
import type { TurbanConfig } from './TurbanCustomizer'

export type CharacterArchetype = 'sardar' | 'man' | 'girl'
export type FemaleOutfitStyle = 'punjabi_suit' | 'western_casual' | 'elante_chic' | 'club_glam'
export type MaleOutfitStyle = 'kurta_pajama' | 'streetwear_casual' | 'jacket_denim' | 'club_polo'
export type Hairstyle = 'crop_fade' | 'pompadour' | 'messy_quiff' | 'girl_braid' | 'girl_ponytail' | 'girl_bob'

export interface ShopItem {
  id: string
  name: string
  brand: 'nike' | 'adidas' | 'reebok' | 'skechers' | 'chandigarh'
  category: 'shoes' | 'apparel' | 'accessory'
  price: number
  description: string
  color: string
  accentColor: string
  tag: string
}

export const SHOP_CATALOG: ShopItem[] = [
  
  {
    id: 'nike_air_jordan_chicago',
    name: 'Air Jordan 1 Retro High "Chicago"',
    brand: 'nike',
    category: 'shoes',
    price: 4999,
    description: 'Iconic high-top basketball sneaker in varsity red, black, and summit white.',
    color: '#d90429',
    accentColor: '#ffffff',
    tag: 'BESTSELLER',
  },
  {
    id: 'nike_air_max_cyan',
    name: 'Nike Air Max 90 "Plaza Cyan"',
    brand: 'nike',
    category: 'shoes',
    price: 3899,
    description: 'Visible Max Air cushioning with Sector 17 fountain cyan accents.',
    color: '#00f5d4',
    accentColor: '#1e293b',
    tag: 'NEW DROP',
  },
  {
    id: 'nike_tech_hoodie',
    name: 'Nike Sportswear Tech Fleece Full-Zip',
    brand: 'nike',
    category: 'apparel',
    price: 2799,
    description: 'Lightweight warmth premium fleece jacket with chevron chest styling.',
    color: '#1a1a1a',
    accentColor: '#ff5500',
    tag: 'STREETWEAR',
  },

  
  {
    id: 'adidas_samba_og',
    name: 'adidas Originals Samba OG Classic',
    brand: 'adidas',
    category: 'shoes',
    price: 3999,
    description: 'Timeless low-top terrace footwear with white leather and suede T-toe.',
    color: '#f8fafc',
    accentColor: '#0f172a',
    tag: 'ICONIC',
  },
  {
    id: 'adidas_ultraboost_light',
    name: 'adidas Ultraboost Light Core',
    brand: 'adidas',
    category: 'shoes',
    price: 4499,
    description: 'Epic energy return boost midsole engineered for high-mileage strolls.',
    color: '#111827',
    accentColor: '#38bdf8',
    tag: 'PERFORMANCE',
  },
  {
    id: 'adidas_trefoil_track_jacket',
    name: 'adidas Firebird Track Top (Bluebird)',
    brand: 'adidas',
    category: 'apparel',
    price: 2499,
    description: 'Shiny tricot fabric with white 3-stripes down arms and trefoil back embroidery.',
    color: '#0284c7',
    accentColor: '#ffffff',
    tag: 'RETRO CLASSIC',
  },

  
  {
    id: 'reebok_club_c_vintage',
    name: 'Reebok Club C 85 Vintage Chalk',
    brand: 'reebok',
    category: 'shoes',
    price: 3499,
    description: 'Court-inspired soft garment leather with vintage Union Jack window-box mark.',
    color: '#fefae0',
    accentColor: '#2d6a4f',
    tag: 'HERITAGE',
  },
  {
    id: 'reebok_classic_leather',
    name: 'Reebok Classic Leather Triple White',
    brand: 'reebok',
    category: 'shoes',
    price: 3199,
    description: 'Clean die-cut EVA midsole and high-abrasion rubber outsole.',
    color: '#ffffff',
    accentColor: '#c1121f',
    tag: 'ESSENTIAL',
  },
  {
    id: 'reebok_vector_windbreaker',
    name: 'Reebok Classics Vector Colorblock Windbreaker',
    brand: 'reebok',
    category: 'apparel',
    price: 2299,
    description: 'Bold oversized 90s vector chevron graphics with crinkled nylon shell.',
    color: '#780000',
    accentColor: '#003049',
    tag: '90s VIBES',
  },

  
  {
    id: 'skechers_dlites_chunky',
    name: "Skechers D'Lites - Biggest Fan",
    brand: 'skechers',
    category: 'shoes',
    price: 3299,
    description: 'Sporty retro chunky silhouette with Air-Cooled Memory Foam cushioned insole.',
    color: '#1e293b',
    accentColor: '#ffffff',
    tag: 'CHUNKY TREND',
  },
  {
    id: 'skechers_slip_ins_max',
    name: 'Skechers Hands Free Slip-Ins® Max Cushioning',
    brand: 'skechers',
    category: 'shoes',
    price: 3699,
    description: 'Exclusive Heel Pillow™ design: step in and walk away with zero hand bending.',
    color: '#0f172a',
    accentColor: '#06b6d4',
    tag: 'HANDS-FREE TECH',
  },
  {
    id: 'skechers_arch_fit_lounge',
    name: 'Skechers Arch Fit Everyday Stroll Top',
    brand: 'skechers',
    category: 'apparel',
    price: 1999,
    description: 'Breathable active knit pullover designed for plaza jogging and relaxed comfort.',
    color: '#334155',
    accentColor: '#38bdf8',
    tag: 'COMFORT',
  },

  
  {
    id: 'chd_aviator_sunglasses',
    name: 'Chandigarh Gedi-Route Aviators',
    brand: 'chandigarh',
    category: 'accessory',
    price: 1199,
    description: 'Gold-frame UV400 pilot sunglasses worn by trendsetters along Sector 17 & 8 Gedi routes.',
    color: '#eab308',
    accentColor: '#172554',
    tag: 'POPULAR',
  },
  {
    id: 'designer_shopping_bags',
    name: 'Sector 17 Luxury Brand Bags Bundle',
    brand: 'chandigarh',
    category: 'accessory',
    price: 499,
    description: 'Dual designer shopping tote bags carried in hand from Nike, Adidas & Skechers.',
    color: '#ff5500',
    accentColor: '#ffffff',
    tag: 'SHOPPING SWAG',
  },
]

export interface CharacterConfig {
  archetype: CharacterArchetype
  femaleOutfit: FemaleOutfitStyle
  maleOutfit: MaleOutfitStyle
  turban: TurbanConfig
  hairstyle: Hairstyle
  hairColor: string
  hasEyewear: boolean
  eyewearColor: string
  topColor: string
  bottomColor: string
  shoesColor: string
  hasShoppingBags: boolean
  hasJhumkas: boolean 
  hasDrink: boolean
}

interface CharacterShopState {
  
  cash: number
  inventory: string[] 
  equippedShoes: string | null
  equippedTop: string | null
  equippedAccessory: string | null

  
  charConfig: CharacterConfig

  
  activeShop: 'nike' | 'adidas' | 'reebok' | 'skechers' | null
  isStudioOpen: boolean
  isElanteMallOpen: boolean
  isCinemaOpen: boolean
  isDancing: boolean

  
  setArchetype: (archetype: CharacterArchetype) => void
  setCharConfig: (config: Partial<CharacterConfig>) => void
  openShop: (brand: 'nike' | 'adidas' | 'reebok' | 'skechers') => void
  closeShop: () => void
  toggleStudio: (force?: boolean) => void
  toggleElanteMall: (force?: boolean) => void
  toggleCinema: (force?: boolean) => void
  setIsDancing: (dancing: boolean) => void
  buyItem: (item: ShopItem) => boolean
  equipItem: (item: ShopItem) => void
  unequipItem: (category: 'shoes' | 'apparel' | 'accessory') => void
  addCash: (amount: number) => void
}

export const useCharacterShopStore = create<CharacterShopState>((set, get) => ({
  cash: 12000, 
  inventory: ['nike_air_jordan_chicago'],
  equippedShoes: 'nike_air_jordan_chicago',
  equippedTop: null,
  equippedAccessory: 'chd_aviator_sunglasses',

  charConfig: {
    archetype: 'sardar',
    femaleOutfit: 'punjabi_suit',
    maleOutfit: 'streetwear_casual',
    turban: {
      style: 'patiala',
      color: '#b81d24',
      fiftyColor: '#f5eedb',
      hasKalgi: false,
      hasBeard: true,
      beardColor: '#1c1b18',
    },
    hairstyle: 'pompadour',
    hairColor: '#1a1918',
    hasEyewear: true,
    eyewearColor: '#eab308',
    topColor: '#ffffff',
    bottomColor: '#1e293b',
    shoesColor: '#d90429',
    hasShoppingBags: false,
    hasJhumkas: true,
    hasDrink: false,
  },

  activeShop: null,
  isStudioOpen: false,
  isElanteMallOpen: false,
  isCinemaOpen: false,
  isDancing: false,

  setArchetype: (archetype) => {
    set((s) => ({
      charConfig: {
        ...s.charConfig,
        archetype,
        
        ...(archetype === 'girl'
          ? {
              hairstyle: 'girl_braid',
              topColor: '#ec4899', 
              bottomColor: '#fef08a', 
              shoesColor: '#f43f5e',
            }
          : archetype === 'man'
          ? {
              hairstyle: 'pompadour',
              topColor: '#0284c7', 
              bottomColor: '#1e293b', 
              shoesColor: '#ffffff',
            }
          : {
              topColor: '#ffffff', 
              bottomColor: '#0f172a',
              shoesColor: '#b81d24',
            }),
      },
    }))
    sound.playDiscoveryChime()
  },

  setCharConfig: (newCfg) => {
    set((s) => ({
      charConfig: { ...s.charConfig, ...newCfg },
    }))
  },

  openShop: (brand) => {
    set({ activeShop: brand })
    sound.playDiscoveryChime()
  },

  closeShop: () => {
    set({ activeShop: null })
  },

  toggleStudio: (force) => {
    set((s) => ({
      isStudioOpen: force !== undefined ? force : !s.isStudioOpen,
    }))
  },

  toggleElanteMall: (force) => {
    set((s) => {
      const next = force !== undefined ? force : !s.isElanteMallOpen
      if (next) sound.playDiscoveryChime()
      return { isElanteMallOpen: next }
    })
  },

  toggleCinema: (force) => {
    set((s) => {
      const next = force !== undefined ? force : !s.isCinemaOpen
      if (next) sound.playCinemaTheme()
      return { isCinemaOpen: next }
    })
  },

  setIsDancing: (isDancing) => {
    set({ isDancing })
  },

  buyItem: (item) => {
    const { cash, inventory } = get()
    if (inventory.includes(item.id)) return true
    if (cash < item.price) return false

    sound.playCashRegister()
    set({
      cash: cash - item.price,
      inventory: [...inventory, item.id],
    })
    
    get().equipItem(item)
    return true
  },

  equipItem: (item) => {
    const { charConfig } = get()
    if (item.category === 'shoes') {
      set({
        equippedShoes: item.id,
        charConfig: { ...charConfig, shoesColor: item.color },
      })
    } else if (item.category === 'apparel') {
      set({
        equippedTop: item.id,
        charConfig: { ...charConfig, topColor: item.color },
      })
    } else if (item.category === 'accessory') {
      if (item.id === 'designer_shopping_bags') {
        set({
          equippedAccessory: item.id,
          charConfig: { ...charConfig, hasShoppingBags: true },
        })
      } else if (item.id === 'chd_aviator_sunglasses') {
        set({
          equippedAccessory: item.id,
          charConfig: { ...charConfig, hasEyewear: true, eyewearColor: item.color },
        })
      }
    }
  },

  unequipItem: (category) => {
    const { charConfig } = get()
    if (category === 'shoes') {
      set({ equippedShoes: null, charConfig: { ...charConfig, shoesColor: '#ffffff' } })
    } else if (category === 'apparel') {
      set({ equippedTop: null, charConfig: { ...charConfig, topColor: '#ffffff' } })
    } else if (category === 'accessory') {
      set({
        equippedAccessory: null,
        charConfig: { ...charConfig, hasEyewear: false, hasShoppingBags: false },
      })
    }
  },

  addCash: (amount) => {
    set((s) => ({ cash: s.cash + amount }))
  },
}))
