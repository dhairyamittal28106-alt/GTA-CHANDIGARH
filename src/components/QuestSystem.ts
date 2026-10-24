import { create } from 'zustand'
import { sound } from './AudioEngine'

export interface Landmark {
  id: string
  title: string
  hindiTitle?: string
  category: 'heritage' | 'entertainment' | 'food' | 'architecture'
  x: number
  z: number
  radius: number
  description: string
  discovered: boolean
  prompt: string
  actionLabel: string
}

export interface Quest {
  id: string
  title: string
  landmarkId: string
  description: string
  completed: boolean
  rewardXp: number
}

interface GameState {
  landmarks: Landmark[]
  quests: Quest[]
  score: number
  activeNotification: { title: string; message: string; icon?: string } | null
  activeModal: { title: string; subtitle: string; content: string; imageTag?: string } | null
  fountainActive: boolean
  hasSofty: boolean
  hasCoffee: boolean
  hasCinemaTicket: boolean

  // Actions
  discoverLandmark: (id: string) => void
  completeQuest: (id: string) => void
  triggerFountainShow: () => void
  stopFountainShow: () => void
  setNotification: (notif: { title: string; message: string; icon?: string } | null) => void
  setModal: (modal: { title: string; subtitle: string; content: string; imageTag?: string } | null) => void
  interactWithLandmark: (id: string) => void
}

export const useGameStore = create<GameState>((set, get) => ({
  landmarks: [
    {
      id: 'fountain',
      title: 'The Musical Fountain',
      hindiTitle: 'म्यूजिकल फव्वारा',
      category: 'entertainment',
      x: 0,
      z: 0,
      radius: 8.5,
      description: 'The vibrant heart of Sector 17 Plaza where crowds gather on the stepped amphitheatre for synchronized water and laser shows.',
      discovered: false,
      prompt: 'Press [E] to start the Musical Light & Water Show',
      actionLabel: 'Watch Musical Fountain Show',
    },
    {
      id: 'neelam',
      title: 'Neelam Cinema Theatre',
      hindiTitle: 'नीलम सिनेमा',
      category: 'heritage',
      x: -42,
      z: -34,
      radius: 9,
      description: "Chandigarh's most iconic single-screen brutalist cinema designed by Pierre Jeanneret and Le Corbusier's team in the 1960s.",
      discovered: false,
      prompt: 'Press [E] to check screening & collect retro ticket',
      actionLabel: 'Enter Neelam Cinema Marquee',
    },
    {
      id: 'open_hand',
      title: 'The Open Hand Monument',
      hindiTitle: 'खुला हाथ स्मारक',
      category: 'architecture',
      x: 36,
      z: -28,
      radius: 7,
      description: 'Le Corbusier’s official symbol for Chandigarh: "Open to receive the wealth, open to distribute to mankind". Rotates freely in the breeze.',
      discovered: false,
      prompt: 'Press [E] to inspect Corbusier’s Open Hand monument',
      actionLabel: 'Inspect Open Hand Monument',
    },
    {
      id: 'coffee_house',
      title: 'Indian Coffee House (ICH)',
      hindiTitle: 'इंडियन कॉफ़ी हाउस',
      category: 'food',
      x: -30,
      z: 32,
      radius: 7.5,
      description: 'The historic intellectual hub of Sector 17 under the pillared colonnade, renowned for traditional turbanned bearers and steaming filter coffee.',
      discovered: false,
      prompt: 'Press [E] to order hot filter coffee & samosas',
      actionLabel: 'Visit Indian Coffee House',
    },
    {
      id: 'softy_corner',
      title: 'Sector 17 Softy Corner',
      hindiTitle: 'सॉफ़्टी कॉर्नर',
      category: 'food',
      x: 30,
      z: 30,
      radius: 7,
      description: 'The legendary ice-cream kiosk where generations of Chandigarhians treat themselves during evening plaza strolls ("Gedi").',
      discovered: false,
      prompt: 'Press [E] to grab a classic chocolate-vanilla swirl',
      actionLabel: 'Buy Iconic Sector 17 Softy',
    },
    {
      id: 'clock_tower',
      title: 'Modernist Pylon & Clock Tower',
      hindiTitle: 'घंटाघर स्तम्भ',
      category: 'architecture',
      x: -38,
      z: 5,
      radius: 7,
      description: 'A Corbusian exposed concrete geometric clock tower standing guard over the Sector 17 commercial walkway.',
      discovered: false,
      prompt: 'Press [E] to view the Corbusian concrete clock tower',
      actionLabel: 'Examine Clock Tower',
    },
    {
      id: 'score_club',
      title: 'Score Club 17 & Discotheque',
      hindiTitle: 'स्कोर क्लब एवं डिस्को',
      category: 'entertainment',
      x: 38,
      z: -2,
      radius: 9,
      description: "Sector 17's legendary nightlife destination (SCO 54-55) featuring an 8x8 reactive LED dance floor, rotating disco ball, VIP lounge, and DJ Sukhi dropping authentic Punjabi-EDM beats.",
      discovered: false,
      prompt: 'Press [E] to Drop the Bass at the DJ Booth & Ignite the Laser Show',
      actionLabel: 'Enter Score Club 17',
    },
    {
      id: 'nike_puma_showrooms',
      title: 'Flagship Showrooms: Nike & Puma',
      hindiTitle: 'नाइके एवं प्यूमा शोरूम',
      category: 'entertainment',
      x: -2,
      z: -28,
      radius: 9,
      description: "Sector 17's premier retail fashion promenade featuring the multi-tier Nike flagship sneaker wall (Air Jordans & Dunks), Puma Motorsport racing gear, Adidas Originals, and Apple Imagine.",
      discovered: false,
      prompt: 'Press [E] to Inspect Sneaker Wall & Try on Fresh Kicks',
      actionLabel: 'Visit Nike & Puma Showrooms',
    },
    {
      id: 'sector17_underpass',
      title: 'Sector 17 - Rose Garden Underpass',
      hindiTitle: 'सेक्टर 17 - रोज़ गार्डन सबवे',
      category: 'architecture',
      x: -18,
      z: -54,
      radius: 14,
      description: 'The monumental connecting pedestrian underpass linking Sector 17 Plaza to Rose Garden beneath Jan Marg. Features open-air amphitheatre steps, illuminated stencil murals ("ਸੈਕਟਰ / सेक्टर / SECTOR 17"), subterranean art gallery with easels, and roller-skating slalom course.',
      discovered: false,
      prompt: 'Press [E] to Explore Rose Garden Underpass & Art Gallery',
      actionLabel: 'Enter Rose Garden Underpass',
    },
  ],

  quests: [
    {
      id: 'q_fountain',
      title: 'Spectacle of Water & Light',
      landmarkId: 'fountain',
      description: 'Trigger the dancing musical fountain in the central plaza.',
      completed: false,
      rewardXp: 100,
    },
    {
      id: 'q_neelam',
      title: 'Vintage Cinema Night',
      landmarkId: 'neelam',
      description: 'Visit the historic Neelam Cinema and collect a cinema ticket.',
      completed: false,
      rewardXp: 80,
    },
    {
      id: 'q_openhand',
      title: 'Corbusier’s Philosophy',
      landmarkId: 'open_hand',
      description: 'Discover the iconic Open Hand Monument in Sector 17.',
      completed: false,
      rewardXp: 75,
    },
    {
      id: 'q_softy',
      title: 'The Sacred Plaza Softy',
      landmarkId: 'softy_corner',
      description: 'Grab a famous softy ice-cream cone from Softy Corner.',
      completed: false,
      rewardXp: 60,
    },
    {
      id: 'q_coffee',
      title: 'Chai & Intellectual Chitchat',
      landmarkId: 'coffee_house',
      description: 'Stop by the Indian Coffee House verandah.',
      completed: false,
      rewardXp: 60,
    },
    {
      id: 'q_club',
      title: 'Nightlife of Sector 17',
      landmarkId: 'score_club',
      description: 'Hit the dance floor at Score Club 17 and drop the bass at the DJ console.',
      completed: false,
      rewardXp: 90,
    },
    {
      id: 'q_showrooms',
      title: 'Sector 17 Sneakerhead',
      landmarkId: 'nike_puma_showrooms',
      description: 'Visit the Nike & Puma flagship showrooms on the northern promenade and inspect the sneaker collection.',
      completed: false,
      rewardXp: 75,
    },
    {
      id: 'q_underpass',
      title: 'The Underground Gateway to Rose Garden',
      landmarkId: 'sector17_underpass',
      description: 'Descend the amphitheatre stairs into the Sector 17 Underpass and explore the subterranean art gallery and skating plaza.',
      completed: false,
      rewardXp: 85,
    },
  ],

  score: 0,
  activeNotification: null,
  activeModal: null,
  fountainActive: false,
  hasSofty: false,
  hasCoffee: false,
  hasCinemaTicket: false,

  discoverLandmark: (id: string) => {
    const { landmarks } = get()
    const lm = landmarks.find(l => l.id === id)
    if (lm && !lm.discovered) {
      set({
        landmarks: landmarks.map(l => l.id === id ? { ...l, discovered: true } : l),
        score: get().score + 25,
        activeNotification: {
          title: `Discovered: ${lm.title}`,
          message: lm.description,
          icon: '📍',
        },
      })
    }
  },

  completeQuest: (id: string) => {
    const { quests, score } = get()
    const q = quests.find(item => item.id === id)
    if (q && !q.completed) {
      set({
        quests: quests.map(item => item.id === id ? { ...item, completed: true } : item),
        score: score + q.rewardXp,
        activeNotification: {
          title: `Quest Complete: ${q.title}!`,
          message: `+${q.rewardXp} XP · ${q.description}`,
          icon: '🏆',
        },
      })
    }
  },

  triggerFountainShow: () => {
    set({ fountainActive: true })
    get().completeQuest('q_fountain')
    set({
      activeNotification: {
        title: '⛲ Musical Fountain Active!',
        message: 'The water jets and underwater illuminations are dancing in sync.',
        icon: '🎶',
      },
    })
  },

  stopFountainShow: () => {
    set({ fountainActive: false })
  },

  setNotification: notif => set({ activeNotification: notif }),
  setModal: modal => set({ activeModal: modal }),

  interactWithLandmark: (id: string) => {
    const { landmarks } = get()
    const lm = landmarks.find(l => l.id === id)
    if (!lm) return

    get().discoverLandmark(id)

    if (id === 'fountain') {
      get().triggerFountainShow()
    } else if (id === 'neelam') {
      set({
        hasCinemaTicket: true,
        activeModal: {
          title: 'NEELAM CINEMA THEATRE',
          subtitle: 'Architectural Gem by Pierre Jeanneret & Corbusier Studio (1960s)',
          content: 'You collected a vintage balcony cinema ticket for today’s screening! Neelam Cinema has stood as Sector 17’s premiere cultural palace for over 6 decades. Notice the sweeping brutalist porch, cantilevered canopy, and stepped geometric acoustics.',
          imageTag: '🎬 ADMIT ONE · BALCONY SEAT #17',
        },
      })
      get().completeQuest('q_neelam')
    } else if (id === 'open_hand') {
      set({
        activeModal: {
          title: 'THE OPEN HAND MONUMENT',
          subtitle: 'Emblem of Chandigarh · "La Main Ouverte"',
          content: 'Conceived by Le Corbusier as the symbol of the new republic and Chandigarh. It stands 28 meters high in the Capitol Complex, with this commemorative replica gracing Sector 17. The hand rotates like a weather vane, symbolizing freedom, peace, and universal goodwill: "Open to give, open to receive."',
          imageTag: '✋ SYMBOL OF THE CITY BEAUTIFUL',
        },
      })
      get().completeQuest('q_openhand')
    } else if (id === 'softy_corner') {
      set({
        hasSofty: true,
        activeModal: {
          title: 'SECTOR 17 SOFTY CORNER',
          subtitle: 'Chandigarh’s Sacred Evening Tradition',
          content: 'You got a fresh, tall chocolate-and-vanilla softy swirl! For decades, an evening gedi (leisurely stroll) around Sector 17 Plaza is incomplete without holding a cold waffle cone from Softy Corner.',
          imageTag: '🍦 CRISP WAFFLE CONE EQUIPPED',
        },
      })
      get().completeQuest('q_softy')
    } else if (id === 'coffee_house') {
      set({
        hasCoffee: true,
        activeModal: {
          title: 'INDIAN COFFEE HOUSE (ICH)',
          subtitle: 'Sector 17 Colonnade · Since 1957',
          content: 'You ordered hot South Indian filter coffee in a stainless steel tumbler, accompanied by a plate of crispy vegetable cutlets. Bureaucrats, poets, students, and architects have argued world politics at these tables for over half a century.',
          imageTag: '☕ PIPING HOT FILTER COFFEE SERVED',
        },
      })
      get().completeQuest('q_coffee')
    } else if (id === 'clock_tower') {
      set({
        activeModal: {
          title: 'MODERNIST CLOCK TOWER',
          subtitle: 'Le Corbusier Brutalist Timepiece',
          content: 'This angular concrete obelisk stands as a vertical punctuation mark amid Sector 17’s horizontal pedestrian arcades. Its deep-set geometric reveals cast striking diagonal shadows across the square throughout the day.',
          imageTag: '⏰ SECTOR 17 LANDMARK',
        },
      })
    } else if (id === 'score_club') {
      sound.playDjDrop()
      set({
        activeModal: {
          title: 'SCORE CLUB 17 & SECTOR 17 DISCOS',
          subtitle: 'The Epicenter of Punjabi Club Culture & Retro Discos (SCO 54-55)',
          content:
            "Since the 1980s, Sector 17-D has been legendary for introducing discotheque culture to North India. SCO 54-55 housed 'Score Club', where resident DJs pioneered blending traditional Punjabi dhol and tumbi riffs with UK garage, house, and electronic dance music. Alongside iconic spots like Zinc Lounge and Blue Ice, Sector 17's underground discos became the weekend ritual for college youth across the region.",
          imageTag: '🪩 SCORE CLUB 17 · SECTOR 17-D',
        },
      })
      get().completeQuest('q_club')
    } else if (id === 'nike_puma_showrooms') {
      sound.playShoppingChime()
      set({
        activeModal: {
          title: 'SECTOR 17 FASHION PROMENADE: NIKE & PUMA',
          subtitle: 'North India’s Premier Retail Capital · Sector 17-C',
          content:
            "Sector 17 has reigned for decades as the fashion capital of Punjab and the northern states. The grand colonnaded promenades house multi-story flagship stores for Nike, Puma, Adidas, and international luxury labels. Generation after generation of Chandigarhians and college youth flock here to pick up limited edition Air Jordans, Puma Suedes, and streetwear before their evening plaza stroll.",
          imageTag: '👟 FRESH AIR JORDANS & PUMA KICKS UNLOCKED',
        },
      })
      get().completeQuest('q_showrooms')
    } else if (id === 'sector17_underpass') {
      sound.playShoppingChime()
      set({
        activeModal: {
          title: 'SECTOR 17 - ROSE GARDEN UNDERPASS',
          subtitle: 'Pedestrian Subway under Jan Marg Connecting Sector 17 to Rose Garden',
          content:
            'Constructed to reconnect the historic Sector 17 Plaza with the 30-acre Zakir Hussain Rose Garden, this architectural underpass eliminates vehicular barriers beneath Jan Marg. It features a sweeping concrete amphitheatre with LED steps, vibrant trilingual stencil murals ("ਸੈਕਟਰ / सेक्टर / SECTOR 17" & "रोज़ गार्डन / ROSE GARDEN"), an open-air subterranean art exhibition with original canvas paintings, and a popular slalom course for roller skaters and breakdancers.',
          imageTag: '🎨 UNDERPASS ART GALLERY & SKATE ZONE',
        },
      })
      get().completeQuest('q_underpass')
    }
  },
}))
