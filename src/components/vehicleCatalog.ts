export type VehicleId =
  | 'creta'
  | 'suzuki-swift'
  | 'fortuner'
  | 'jeep-wrangler'
  | 'bmw-x5'
  | 'lamborghini-urus'
  | 'ferrari-f8'

export type VehicleSpec = {
  id: VehicleId
  name: string
  category: string
  modelPath: string
  length: number
  width: number
  height: number
  modelRotationY: number
  topSpeed: number
  acceleration: number
  steering: number
  sourceTitle: string
  sourceAuthor: string
  sourceUrl: string
}

export const VEHICLES: Record<VehicleId, VehicleSpec> = {
  creta: {
    id: 'creta',
    name: 'Hyundai Creta',
    category: 'Compact SUV',
    modelPath: '/models/vehicles/hyundai-creta.glb',
    length: 4.33,
    width: 1.79,
    height: 1.63,
    modelRotationY: Math.PI / 2,
    topSpeed: 22,
    acceleration: 2.15,
    steering: 0.88,
    sourceTitle: 'Hyundai Creta',
    sourceAuthor: 'Milan_reVel1',
    sourceUrl: 'https://sketchfab.com/3d-models/3204c8ebbc40450687a692c4c9c1de98',
  },
  'suzuki-swift': {
    id: 'suzuki-swift',
    name: 'Suzuki Swift (2022)',
    category: 'Hatchback',
    modelPath: '/models/vehicles/suzuki-swift.glb',
    length: 3.845,
    width: 1.735,
    height: 1.495,
    modelRotationY: 0,
    topSpeed: 20,
    acceleration: 2.65,
    steering: 1.04,
    sourceTitle: 'Suzuki Swift',
    sourceAuthor: 'Casacade Models',
    sourceUrl: 'https://sketchfab.com/3d-models/218c3c0c6afd4d0eb343bd50d8868fd0',
  },
  fortuner: {
    id: 'fortuner',
    name: 'Toyota Fortuner',
    category: 'Full-size SUV',
    modelPath: '/models/vehicles/toyota-sw4.glb',
    length: 4.795,
    width: 1.855,
    height: 1.835,
    modelRotationY: 0,
    topSpeed: 24,
    acceleration: 2,
    steering: 0.76,
    sourceTitle: 'Toyota SW4 Fortuner',
    sourceAuthor: 'Nieve5677',
    sourceUrl: 'https://sketchfab.com/3d-models/379e4180f137480b9a8578e7da9184e2',
  },
  'jeep-wrangler': {
    id: 'jeep-wrangler',
    name: 'Jeep Wrangler',
    category: '4×4 Off-road',
    modelPath: '/models/vehicles/jeep-wrangler.glb',
    length: 4.33,
    width: 1.88,
    height: 1.84,
    modelRotationY: 0,
    topSpeed: 21,
    acceleration: 2.3,
    steering: 0.82,
    sourceTitle: 'Vehicle - Jeep Wrangler',
    sourceAuthor: 'Thcyrax',
    sourceUrl: 'https://sketchfab.com/3d-models/5c090410ea544b72a6d265d1ede55795',
  },
  'bmw-x5': {
    id: 'bmw-x5',
    name: 'BMW X5 M Competition (2020)',
    category: 'Luxury performance SUV',
    modelPath: '/models/vehicles/bmw-x5.glb',
    length: 4.94,
    width: 2.015,
    height: 1.745,
    modelRotationY: 0,
    topSpeed: 28,
    acceleration: 1.7,
    steering: 0.88,
    sourceTitle: '2020 BMW X5 M Competition',
    sourceAuthor: 'David_Holiday',
    sourceUrl: 'https://sketchfab.com/3d-models/9b211d525797457e988c903f67d0b753',
  },
  'lamborghini-urus': {
    id: 'lamborghini-urus',
    name: 'Lamborghini Urus (2018)',
    category: 'Performance SUV',
    modelPath: '/models/vehicles/lamborghini-urus.glb',
    length: 5.112,
    width: 2.016,
    height: 1.638,
    modelRotationY: 0,
    topSpeed: 32,
    acceleration: 1.25,
    steering: 1.08,
    sourceTitle: 'Lamborghini Urus 2018',
    sourceAuthor: 'Kai Xiang',
    sourceUrl: 'https://sketchfab.com/3d-models/none-32964087f5d24c3e90482724ddfc2fef',
  },
  'ferrari-f8': {
    id: 'ferrari-f8',
    name: 'Ferrari F8 Tributo (2020)',
    category: 'Supercar',
    modelPath: '/models/vehicles/ferrari-f8.glb',
    length: 4.611,
    width: 1.979,
    height: 1.206,
    modelRotationY: 0,
    topSpeed: 32,
    acceleration: 1.2,
    steering: 1.08,
    sourceTitle: '2020 Ferrari F8 Tributo',
    sourceAuthor: 'Ddiaz Design',
    sourceUrl: 'https://sketchfab.com/3d-models/8a86c4d634f64f8b8ee836bc93fa6ac8',
  },
}

export const REQUESTED_MODELS_PENDING = [
  'Mahindra Thar',
  'Mahindra Scorpio-N',
  'Maruti Suzuki WagonR',
  'Hyundai Venue',
]
