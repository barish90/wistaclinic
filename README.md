# WistaClinic Website

Premium healthcare and beauty services website for WistaClinic, featuring three main pages:

1. **Homepage** - Main landing page showcasing services
2. **New Year Offer** - Interactive promotional campaign page with 3D gift card animation
3. **Coffee Menu** - Complimentary coffee bar menu for clinic visitors

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4.x
- **Animations**:
  - Framer Motion (React animations)
  - GSAP (Scroll-based animations)
  - Canvas Confetti (Celebration effects)
- **Icons**: Lucide React
- **Runtime**: Node.js 20+

## Getting Started

### Prerequisites

- Node.js 20 or higher
- pnpm (recommended) or npm

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd wistaclinic-website
```

2. Install dependencies:
```bash
pnpm install
# or
npm install
```

3. Run the development server:
```bash
pnpm dev
# or
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
wistaclinic-website/
├── app/
│   ├── page.tsx                          # Homepage
│   ├── new-year-offer/
│   │   └── page.tsx                      # New Year promotional page
│   ├── coffee-menu/
│   │   └── page.tsx                      # Coffee bar menu
│   ├── components/
│   │   └── new-year-offer/               # New Year page components
│   │       ├── Hero.tsx                  # 3D card unwrapping animation
│   │       ├── ThreeDCard.tsx            # Interactive gift card
│   │       ├── IntroSection.tsx          # Department showcase
│   │       ├── DepartmentSection.tsx     # Service details
│   │       ├── Navbar.tsx                # Navigation with scroll spy
│   │       ├── Footer.tsx                # Footer with CTA
│   │       ├── constants.ts              # Department data
│   │       ├── types.ts                  # TypeScript types
│   │       └── useScrollProgress.ts      # Custom scroll hook
│   ├── utils/
│   │   └── loadGsap.ts                   # Dynamic GSAP loader
│   ├── layout.tsx                        # Root layout
│   └── globals.css                       # Global styles
├── public/
│   └── images/                           # Brand assets (to be added)
│       ├── logo/
│       ├── dental/
│       └── SVG/
├── tailwind.config.ts                    # Tailwind configuration
└── package.json
```

## Brand Assets Setup

The website requires the following brand assets to be placed in the `public/images/` directory:

### Required Logos
- `public/images/logo/logo-gold-no-title.webp` - Main logo (no text)
- `public/images/logo/wista-logo-gold.webp` - Full logo with text
- `public/images/logo/denta-logo.webp` - DentaWista logo
- `public/images/logo/beauty-logo.webp` - Wista Beauty logo
- `public/images/logo/lab-logo.webp` - Wista Lab logo

### Required Images
- `public/images/dental/treatments/` - Dental treatment images
  - `all-on-4.webp`
  - `root-canal.webp`
  - `implants.webp`
  - `veneers.webp`
  - `hollywood-smile.webp`
  - `whitening.webp`

### Optional SVG
- `public/images/SVG/holiday.svg` - Holiday pattern for gift card wrapping

## Key Features

### Homepage
- Clean, modern design
- Service overview cards
- Gold accent colors (#D4AF37)
- Responsive navigation
- Call-to-action sections

### New Year Offer Page
- **3D Interactive Gift Card**: Click or scroll to unwrap
- **Confetti Animation**: Celebrates voucher unlock
- **Scroll-Based Animations**: GSAP-powered smooth scrolling
- **Department Cards**: Hover effects and transitions
- **Sticky Sections**: Desktop stacking card effect
- **Mobile Optimized**: Natural scroll on mobile devices

### Coffee Menu
- Categorized beverage display
- High-quality images
- Icon-based categorization
- Google Review integration
- Complimentary service messaging

## Available Scripts

- `pnpm dev` - Start development server (port 3000)
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint

## Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Connect repository to Vercel
3. Deploy automatically on push to main branch

### Netlify

1. Build command: `pnpm build` or `npm run build`
2. Publish directory: `.next`
3. Node version: 20.x

### Docker

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## Environment Variables

No environment variables are required for this static website. All configuration is done through code.

## Customization

### Colors

Edit `tailwind.config.ts` to customize the gold color palette:

```typescript
colors: {
  gold: {
    50: '#FFFBEB',
    // ... other shades
    500: '#D4AF37',  // Primary gold
    600: '#AA8C2C',  // Darker gold
  },
}
```

### Content

- **Services**: Edit `app/components/new-year-offer/constants.ts`
- **Homepage**: Edit `app/page.tsx`
- **Coffee Menu**: Edit `app/coffee-menu/page.tsx`

## Performance Optimizations

- **Dynamic Imports**: GSAP and Confetti loaded on-demand
- **Image Optimization**: Next.js automatic image optimization
- **Code Splitting**: Automatic per-route code splitting
- **CDN Delivery**: Static assets via CDN
- **Lazy Loading**: Images load as they enter viewport

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## License

Proprietary - WistaClinic © 2024

## Contact

- Website: wistaclinic.com
- Phone: +90 507 080 88 88
- Email: info@dentawista.com
- Address: Merkez, Cendere Cad. No:9, 34406 Kağıthane/İstanbul, Turkey

---

Built with ❤️ for WistaClinic
