export interface ServiceItem {
  id: string
  title: string
  image: string
}

export interface DepartmentData {
  id: string
  name: string
  subhead: string
  description: string
  colorTheme: string // Tailwind class prefix or hex
  textColor: string
  backgroundColor?: string
  theme?: 'light' | 'dark'
  logo?: string
  services: ServiceItem[]
}
