// ============================================================
// Subcategory definitions — maps nav subcategories to products
// Each subcategory has a shared image and lists which product
// names belong to it (matched against Firestore product names)
// ============================================================

export const subcategories = {

  // ── INDOOR BRANDING ────────────────────────────────────────
  'pull-up-banners': {
    id: 'pull-up-banners',
    label: 'Pull-Up Banners',
    category: 'indoor-branding',
    image: '/images/products/indoor/executive-pullup.png',
    description: 'Lightweight, portable pull-up banners that set up in seconds. Available in economy PVC, executive PVC, textile, and spider/X-frame styles.',
    productNames: [
      'Economy PVC Pull-Up Banner',
      'Executive PVC Pull-Up Banner',
      'Executive Textile Pull-Up Banner',
      'Spider / X Banner',
    ],
  },
  'wall-banners': {
    id: 'wall-banners',
    label: 'Wall Banners',
    category: 'indoor-branding',
    image: '/images/products/indoor/straight-banner-wall.png',
    description: 'Professional backdrop walls for exhibitions, presentations and events. Available in straight and curved styles across multiple sizes.',
    productNames: [
      'Wall Banner 2250 × 2250mm',
      'Wall Banner 3000 × 2250mm',
      'Wall Banner 4500 × 2250mm',
      'Curved Banner Wall 2150 × 2250mm',
      'Curved Banner Wall 2850 × 2250mm',
      'Curved Banner Wall 3340 × 2250mm',
      'Straight Bannerwall (Webprinter)',
    ],
  },
  'popup-tables': {
    id: 'popup-tables',
    label: 'Pop-Up & Tables',
    category: 'indoor-branding',
    image: '/images/products/indoor/table-cloth.png',
    description: 'Pop-up banners, branded tablecloths and promo tables for activations, exhibitions and events.',
    productNames: [
      '2-Sided Pop-Up Banner',
      '3-Sided Pop-Up Banner',
      'Branded Tablecloth',
      'Branded Promo Table',
      'A-Frame Sandwich Board',
      'Welcome Board',
    ],
  },

  // ── OUTDOOR BRANDING ───────────────────────────────────────
  'flag-banners': {
    id: 'flag-banners',
    label: 'Flag Banners',
    category: 'outdoor-branding',
    image: '/images/products/outdoor/teardrop.png',
    description: 'High-visibility outdoor flag banners including telescopic, teardrop and sharkfin styles. All use the same 137×18×18cm bag.',
    productNames: [
      'Telescopic Banner 2m Single',
      'Telescopic Banner 3m Single',
      'Telescopic Banner 3m Double',
      'Telescopic Banner 4m Double',
      'Teardrop Banner 2m Single',
      'Teardrop Banner 3m Single',
      'Teardrop Banner 3m Double',
      'Sharkfin / Feather Banner 2m',
      'Sharkfin / Feather Banner 3m',
    ],
  },
  'aframes-accessories': {
    id: 'aframes-accessories',
    label: 'A-Frames & Accessories',
    category: 'outdoor-branding',
    image: '/images/products/outdoor/a-frame-banner.png',
    description: 'A-frame banners, street pole banners, car magnetic decals and parasols for outdoor branding.',
    productNames: [
      'A-Frame Banner 2m',
      'A-Frame Banner 3m',
      'Street Pole Banner',
      'Car Magnetic Decals',
      'Parasol 2m',
    ],
  },
  'gazebos': {
    id: 'gazebos',
    label: 'Gazebos',
    category: 'outdoor-branding',
    image: '/images/products/outdoor/gazebo.png',
    description: 'Aluminium hexagonal leg gazebos from 1m kiosk to 4.5m×3m. Available with canopy only, half-wall or full-wall skins.',
    productNames: [
      'Gazebo 1m × 1m Kiosk',
      'Gazebo 1.5m × 1.5m',
      'Gazebo 2m × 2m',
      'Gazebo 2m × 2m Petite Frame',
      'Gazebo 3m × 3m',
      'Gazebo 4.5m × 3m',
      'Gazebo Walls',
    ],
  },

  // ── T-SHIRT PRINTING ───────────────────────────────────────
  'flex-flock': {
    id: 'flex-flock',
    label: 'Flex & Flock',
    category: 'tshirt-printing',
    image: '/images/products/tshirt/flex-print.png',
    description: 'Heat-press flex and flock/metallic printing on garments. No minimum order. Same-day production for small quantities.',
    productNames: [
      'Flex Printing',
      'Flock / Metallic Printing',
    ],
  },
  'dtf-screen': {
    id: 'dtf-screen',
    label: 'DTF & Screen Print',
    category: 'tshirt-printing',
    image: '/images/products/tshirt/dtf-print.png',
    description: 'DTF (Direct to Film) for full-colour photographic prints, and screen printing for bulk orders (min. 12 items).',
    productNames: [
      'DTF (Direct to Film) Printing',
      'Screen Printing',
    ],
  },
  'embroidery': {
    id: 'embroidery',
    label: 'Embroidery',
    category: 'tshirt-printing',
    image: '/images/products/tshirt/embroidery.png',
    description: 'Professional embroidery on garments. Minimum 6 items. Digitising included on first-time orders.',
    productNames: [
      'Embroidery',
    ],
  },

  // ── GRAPHIC DESIGN ─────────────────────────────────────────
  'design-packages': {
    id: 'design-packages',
    label: 'Design Packages',
    category: 'graphic-design',
    image: '/images/products/design/gold-package.png',
    description: 'Complete brand identity packages — Bronze, Silver and Gold — covering logo, stationery and full brand packs.',
    productNames: [
      'Bronze Design Package',
      'Silver Design Package',
      'Gold Design Package',
    ],
  },
  'individual-design': {
    id: 'individual-design',
    label: 'Individual Services',
    category: 'graphic-design',
    image: '/images/products/design/logo-design.png',
    description: 'Individual design services including logo design, business cards, letterheads, flyers, company profiles and more.',
    productNames: [
      'Logo Design',
      'Business Card Design',
      'Letterhead Design',
      'Email Signature Design',
      'Invoice & Quote Design',
      'Flyer / Banner Design',
      'Company Profile Design',
      'Logo Redraw (Vectorise)',
      'Welcome Board (A1)',
    ],
  },
};

// Map category → its subcategories (for nav and sidebar)
export const categorySubcategories = {
  'indoor-branding':  ['pull-up-banners', 'wall-banners', 'popup-tables'],
  'outdoor-branding': ['flag-banners', 'aframes-accessories', 'gazebos'],
  'tshirt-printing':  ['flex-flock', 'dtf-screen', 'embroidery'],
  'graphic-design':   ['design-packages', 'individual-design'],
};
