import { DepartmentData } from './types'

export const DEPARTMENTS: DepartmentData[] = [
  {
    id: 'dental',
    name: 'DentaWista',
    subhead: 'Services You Can Use at',
    description: 'Experience professional dental care from routine check-ups to advanced treatments designed for your comfort.',
    colorTheme: 'bg-[#222D52]',
    textColor: 'text-[#222D52]',
    backgroundColor: '#FFFFFF', // Explicitly White
    logo: '/images/logo/denta-logo.webp',
    services: [
      { id: 'd1', title: 'All-On-4 Implants', image: '/images/dental/treatments/all-on-4.webp' },
      { id: 'd2', title: 'Root Canal', image: '/images/dental/treatments/root-canal.webp' },
      { id: 'd3', title: 'Dental Implants', image: '/images/dental/treatments/implants.webp' },
      { id: 'd4', title: 'Veneers', image: '/images/dental/treatments/veneers.webp' },
      { id: 'd5', title: 'Hollywood Smile', image: '/images/dental/treatments/hollywood-smile.webp' },
      { id: 'd6', title: 'Teeth Whitening', image: '/images/dental/treatments/whitening.webp' },
    ]
  },
  {
    id: 'beauty',
    name: 'Wista Beauty',
    subhead: 'Services You Can Use at',
    description: 'Enhance your natural beauty with expert treatments tailored to your needs and preferences.',
    colorTheme: 'bg-[#A6506F]',
    textColor: 'text-[#A6506F]',
    logo: '/images/logo/beauty-logo.webp',
    services: [
      { id: 'b1', title: 'Botox', image: 'https://picsum.photos/300/300?random=7' },
      { id: 'b2', title: 'Filler', image: 'https://picsum.photos/300/300?random=8' },
      { id: 'b3', title: 'Beauty Sessions', image: 'https://picsum.photos/300/300?random=9' },
      { id: 'b4', title: 'Hair PRP', image: 'https://picsum.photos/300/300?random=10' },
    ]
  },
  {
    id: 'weight',
    name: 'Weight Loss Surgery',
    subhead: 'Services You Can Use at',
    description: 'Achieve sustainable goals with expert surgical options designed to support a healthier future.',
    colorTheme: 'bg-[#308986]',
    textColor: 'text-[#308986]',
    services: [
      { id: 'w1', title: 'Gastric Bypass', image: 'https://picsum.photos/400/500?random=11' },
      { id: 'w2', title: 'Gastric Sleeve Surgery', image: 'https://picsum.photos/400/500?random=12' },
      { id: 'w3', title: 'Surgical Balloon', image: 'https://picsum.photos/400/500?random=13' },
    ]
  },
  {
    id: 'lab',
    name: 'Wista Lab',
    subhead: 'Services You Can Use at',
    description: 'Benefit from high-quality laboratory solutions, crafted to ensure optimal comfort and aesthetics.',
    colorTheme: 'bg-[#585a3c]',
    textColor: 'text-[#585a3c]',
    backgroundColor: '#ced8bb',
    logo: '/images/logo/lab-logo.webp',
    services: [
      { id: 'l1', title: 'Custom Dental Prosthetics', image: 'https://picsum.photos/350/250?random=14' },
      { id: 'l2', title: 'Crown & Bridge Fabrication', image: 'https://picsum.photos/350/250?random=15' },
      { id: 'l3', title: 'Precision Shade Matching', image: 'https://picsum.photos/350/250?random=16' },
    ]
  },
  {
    id: 'clinic',
    name: 'WistaClinic',
    subhead: 'Services You Can Use at',
    description: 'Enhance your body contours with our expert surgeries, including liposuction and transplants.',
    colorTheme: 'bg-[#D2A138]',
    textColor: 'text-[#D2A138]',
    logo: '/images/logo/logo-gold-no-title.webp',
    services: [
      { id: 'c1', title: 'Silicone Body Implants', image: 'https://picsum.photos/300/300?random=17' },
      { id: 'c2', title: 'Nose Surgery', image: 'https://picsum.photos/300/300?random=18' },
      { id: 'c3', title: 'Hair Transplant', image: 'https://picsum.photos/300/300?random=19' },
      { id: 'c4', title: 'Liposuction', image: 'https://picsum.photos/300/300?random=20' },
    ]
  }
]
