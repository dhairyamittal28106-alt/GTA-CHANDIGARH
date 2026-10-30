export type VehicleId =
  | 'creta'
  | 'thar'
  | 'scorpio-n'
  | 'wagon-r'
  | 'venue'
  | 'bmw-x5'
  | 'jeep-wrangler'
  | 'fortuner'
  | 'lamborghini-urus'
  | 'classic-sedan'

export type VehicleSpec = {
  id: VehicleId
  name: string
  category: string
  paint: string
  style: 'suv' | 'offroad' | 'hatch' | 'sports' | 'sedan'
  length: number
  width: number
  height: number
  topSpeed: number
  acceleration: number
  steering: number
}

export const VEHICLES: Record<VehicleId, VehicleSpec> = {
  creta: { id: 'creta', name: 'Hyundai Creta', category: 'Compact SUV', paint: '#e8e7e1', style: 'suv', length: 4.35, width: 1.83, height: 1.62, topSpeed: 22, acceleration: 2.15, steering: 0.88 },
  thar: { id: 'thar', name: 'Mahindra Thar', category: '4×4 Off-road', paint: '#315846', style: 'offroad', length: 4.05, width: 1.86, height: 1.78, topSpeed: 20, acceleration: 2.35, steering: 0.78 },
  'scorpio-n': { id: 'scorpio-n', name: 'Mahindra Scorpio-N', category: 'Full-size SUV', paint: '#20252a', style: 'suv', length: 4.66, width: 1.92, height: 1.82, topSpeed: 22, acceleration: 2.1, steering: 0.72 },
  'wagon-r': { id: 'wagon-r', name: 'Maruti Suzuki WagonR', category: 'Tall hatchback', paint: '#1769aa', style: 'hatch', length: 3.7, width: 1.62, height: 1.72, topSpeed: 17, acceleration: 2.7, steering: 1.05 },
  venue: { id: 'venue', name: 'Hyundai Venue', category: 'Compact SUV', paint: '#d6d7d3', style: 'suv', length: 4.0, width: 1.77, height: 1.61, topSpeed: 20, acceleration: 2.45, steering: 0.94 },
  'bmw-x5': { id: 'bmw-x5', name: 'BMW X5', category: 'Luxury SUV', paint: '#152d4c', style: 'suv', length: 4.92, width: 1.99, height: 1.78, topSpeed: 28, acceleration: 1.7, steering: 0.88 },
  'jeep-wrangler': { id: 'jeep-wrangler', name: 'Jeep Wrangler', category: '4×4 Off-road', paint: '#a8a37b', style: 'offroad', length: 4.33, width: 1.88, height: 1.84, topSpeed: 21, acceleration: 2.3, steering: 0.82 },
  fortuner: { id: 'fortuner', name: 'Toyota Fortuner', category: 'Full-size SUV', paint: '#f0eee8', style: 'suv', length: 4.8, width: 1.86, height: 1.82, topSpeed: 24, acceleration: 2, steering: 0.76 },
  'lamborghini-urus': { id: 'lamborghini-urus', name: 'Lamborghini Urus', category: 'Performance SUV', paint: '#d9ad16', style: 'sports', length: 4.6, width: 1.97, height: 1.48, topSpeed: 32, acceleration: 1.25, steering: 1.08 },
  'classic-sedan': { id: 'classic-sedan', name: 'Classic Sedan', category: 'Classic', paint: '#744331', style: 'sedan', length: 4.5, width: 1.8, height: 1.5, topSpeed: 18, acceleration: 2.4, steering: 0.95 },
}
