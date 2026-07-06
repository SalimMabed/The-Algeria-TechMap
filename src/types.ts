export type Category =
  | 'startup'
  | 'company'
  | 'incubator'
  | 'coworking'
  | 'event'
  | 'hosting'

export interface Entity {
  id: string
  name: string
  category: Category
  wilaya: string
  city: string
  lat: number
  lng: number
  sector: string
  description: string
  founded?: number
  website?: string
}

export const CATEGORY_LABELS: Record<Category, string> = {
  startup: 'Startup',
  company: 'Company',
  incubator: 'Incubator',
  coworking: 'Coworking Space',
  event: 'Event',
  hosting: 'Hosting Provider',
}

export const CATEGORY_LABELS_PLURAL: Record<Category, string> = {
  startup: 'Startups',
  company: 'Companies',
  incubator: 'Incubators',
  coworking: 'Coworking',
  event: 'Events',
  hosting: 'Hosting',
}

export const CATEGORY_COLORS: Record<Category, string> = {
  startup: '#22c55e',
  company: '#3b82f6',
  incubator: '#a855f7',
  event: '#f97316',
  hosting: '#ef4444',
  coworking: '#eab308',
}
