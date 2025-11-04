# Decentralized Museum - Design Guidelines

## Design Approach

**Selected Approach:** Reference-Based with Art Gallery Aesthetic

Drawing inspiration from premium digital art platforms (Artsy, SuperRare) and modern museum websites (MoMA, The Met), combined with Web3 interfaces (OpenSea, Foundation). The design emphasizes elegance, spaciousness, and cultural sophistication while maintaining blockchain platform functionality.

## Core Design Principles

1. **Gallery-First Mentality:** Art and content take center stage with generous whitespace
2. **Refined Minimalism:** Clean, uncluttered layouts that exude sophistication
3. **Tactile Interactions:** Subtle, purposeful animations that feel premium
4. **Curatorial Excellence:** Every element is intentionally placed like a museum exhibit

---

## Typography System

**Primary Font:** Playfair Display (serif) - for headings, hero titles, and exhibition names
- Hero H1: text-6xl md:text-7xl lg:text-8xl, font-semibold, tracking-tight
- Section H2: text-4xl md:text-5xl, font-medium
- Card Titles: text-2xl md:text-3xl, font-medium

**Secondary Font:** Inter (sans-serif) - for body text, UI elements, and navigation
- Body Text: text-base md:text-lg, leading-relaxed
- UI Elements: text-sm md:text-base, font-medium
- Metadata/Labels: text-xs uppercase tracking-wider

**Accent Font:** Space Mono (monospace) - for wallet addresses, token amounts, technical data

---

## Layout System

**Spacing Primitives:** Use Tailwind units of 4, 6, 8, 12, 16, 20, 24, 32
- Component padding: p-6 md:p-8 lg:p-12
- Section spacing: py-16 md:py-24 lg:py-32
- Card gaps: gap-6 md:gap-8
- Element margins: mb-4, mb-6, mb-8 for hierarchy

**Container System:**
- Full-width sections with inner max-w-7xl mx-auto px-6 md:px-8
- Content sections: max-w-6xl
- Form containers: max-w-2xl
- Gallery grids: full container width

**Grid Structure:**
- Gallery: grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4
- Dashboard cards: grid-cols-1 md:grid-cols-2 lg:grid-cols-3
- Stats/metrics: grid-cols-2 md:grid-cols-4

---

## Component Library

### Navigation
- Sticky header with backdrop blur (backdrop-blur-md)
- Logo left, nav center, wallet connection right
- Desktop: horizontal nav items with hover underline animation
- Mobile: hamburger menu with slide-in drawer
- Include wallet address display with truncation (0x1234...5678)

### Hero Section (Home Page)
- Full viewport height (min-h-screen) with vertical centering
- Large hero image: Abstract digital art/museum gallery photograph with subtle overlay
- Centered content with max-w-4xl
- Primary CTA: "Enter Museum" (large, prominent)
- Secondary CTAs: "Login" and "Join DAO" (outlined/ghost style)
- Floating decorative element: Small "Live Exhibitions" badge with pulse animation

### Cards (Gallery NFTs)
- Aspect ratio 3:4 for artwork display
- Image container with overflow-hidden rounded-xl
- Hover: Subtle scale (scale-105) with smooth transition
- Overlay on hover: Shows title, artist, price with gradient backdrop
- Corner badge: "Minted" status with small icon

### Dashboard Layouts
**Artist Dashboard:**
- Split layout: Upload form (max-w-2xl) on left, preview card on right
- Drag-and-drop zone with dashed border and upload icon
- Form fields with floating labels
- IPFS status indicator with loading spinner

**Visitor Dashboard:**
- Hero banner: Current exhibitions with carousel
- Ticket purchase card: Prominent with token amount input and MetaMask icon
- DAO membership section: Card with governance token balance and "Join DAO" CTA
- Activity feed: Timeline of purchases and votes

### DAO Governance Page
- Proposal cards in vertical list
- Each proposal: Title, description, voting progress bar, time remaining
- Vote buttons: For/Against/Abstain with clear visual states
- Quorum indicator with percentage completion
- Token balance display in sidebar

### Forms & Inputs
- Floating label inputs with focus ring
- Input groups with icon prefixes (e.g., ETH icon for price)
- File upload: Large drop zone with preview thumbnail
- TextArea for descriptions: min-h-32 with character counter
- Submit buttons: Full width on mobile, auto width on desktop

### Buttons
- Primary: Large padding (px-8 py-4), rounded-full, font-medium
- Secondary: Outlined with 2px border, rounded-full
- Wallet Connect: Icon + text, special emphasis
- All buttons: Implement subtle hover lift (translateY) and shadow increase

### Modals & Overlays
- Centered modal with backdrop-blur-sm background
- Modal content: max-w-lg with rounded-2xl
- Transaction progress: Step indicator with checkmarks
- Success/Error states: Icon, message, action buttons

---

## Animations & Interactions

**Page Transitions:** Fade-in on mount with stagger for child elements
**Card Hovers:** Scale + shadow increase (duration-300)
**Button Hovers:** Subtle lift + glow effect
**Loading States:** Skeleton screens with shimmer animation for gallery
**Scroll Reveals:** Fade-up animation for sections (use Framer Motion)

**Prohibited:** Autoplay carousels, excessive parallax, distracting background animations

---

## Images

### Hero Section
**Primary Hero Image:** Full-width, high-quality photograph of modern art gallery interior or abstract digital art installation. Should evoke sophistication and cultural depth. Overlay with subtle gradient for text readability. Suggested aspect: 16:9 landscape.

### Gallery Page
**NFT Artworks:** Display user-uploaded images from IPFS. Placeholder images should be abstract geometric patterns or museum-quality photography until loaded.

### Artist Dashboard
**Upload Preview:** Real-time preview of uploaded artwork in gallery card format.

### Background Accents
**Subtle Patterns:** Very light noise texture or subtle grid pattern for page backgrounds to add depth without distraction.

---

## Responsive Behavior

**Mobile (<768px):**
- Single column layouts throughout
- Stacked navigation with drawer menu
- Full-width cards and buttons
- Simplified hero with reduced text size
- Gallery grid: 1 column

**Tablet (768px-1024px):**
- 2-column gallery grid
- Side-by-side dashboard cards
- Horizontal navigation

**Desktop (>1024px):**
- 3-4 column gallery grid
- Multi-column dashboard layouts
- Generous spacing and margins
- Hover states fully activated

---

## Accessibility

- Focus visible rings on all interactive elements
- ARIA labels for wallet connection states
- Alt text for all NFT images
- Keyboard navigation for DAO voting
- High contrast text for readability
- Loading announcements for screen readers

---

## Key Differentiators

1. **Gallery-Quality Presentation:** NFTs displayed with museum-level curation, not marketplace density
2. **Refined Minimalism:** Less visual noise than typical Web3 platforms
3. **Cultural Sophistication:** Typography and spacing that matches high-end art institutions
4. **Seamless Web3 Integration:** Blockchain elements feel native, not bolted-on
5. **Premium Touch:** Every interaction feels polished and intentional