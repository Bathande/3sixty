import { initializeApp } from 'firebase/app';
import { getFirestore, collection, query, where, getDocs, addDoc, updateDoc, serverTimestamp } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyAKDQ6AjptMq5oM1S8yXhlzIKG_p7Oe3Hg',
  authDomain: 'sixty-ee4fd.firebaseapp.com',
  projectId: 'sixty-ee4fd',
  storageBucket: 'sixty-ee4fd.firebasestorage.app',
  messagingSenderId: '82187766897',
  appId: '1:82187766897:web:e93e29f33d3c411df99fd0',
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// ─────────────────────────────────────────────────────────────────────────────
// CATALOGUE_UPDATES — all products from the 3Sixty Master Catalogue (Oct 2025)
// Fields: sku, name, price, weight, volWeight, courierService, courierCost,
//         leadTime, rushLeadTime, totalDays, requiresFreight, category
// ─────────────────────────────────────────────────────────────────────────────
const CATALOGUE_UPDATES = [
  // ── C.1 Flat Print ──────────────────────────────────────────────────────────
  { sku: '3SB-FP-001', name: 'Flyers A6 (100)', price: 120, weight: 0.3, volWeight: 2, courierService: 'ECO 1', courierCost: 91.30, leadTime: '2 days', rushLeadTime: '1 day', totalDays: '4–5 days', requiresFreight: false, category: 'Flat Print' },
  { sku: '3SB-FP-002', name: 'Flyers A6 (250)', price: 200, weight: 0.5, volWeight: 2, courierService: 'ECO 1', courierCost: 91.30, leadTime: '2 days', rushLeadTime: '1 day', totalDays: '4–5 days', requiresFreight: false, category: 'Flat Print' },
  { sku: '3SB-FP-003', name: 'Flyers A6 (500)', price: 650, weight: 0.7, volWeight: 2, courierService: 'ECO 1', courierCost: 91.30, leadTime: '2 days', rushLeadTime: '1 day', totalDays: '4–5 days', requiresFreight: false, category: 'Flat Print' },
  { sku: '3SB-FP-004', name: 'Flyers A6 (1000)', price: 850, weight: 1.2, volWeight: 2, courierService: 'ECO 1', courierCost: 91.30, leadTime: '2 days', rushLeadTime: '1 day', totalDays: '4–5 days', requiresFreight: false, category: 'Flat Print' },
  { sku: '3SB-FP-005', name: 'Flyers A5 (100)', price: 200, weight: 0.3, volWeight: 2, courierService: 'ECO 1', courierCost: 91.30, leadTime: '2 days', rushLeadTime: '1 day', totalDays: '4–5 days', requiresFreight: false, category: 'Flat Print' },
  { sku: '3SB-FP-006', name: 'Flyers A5 (250)', price: 285, weight: 0.5, volWeight: 2, courierService: 'ECO 1', courierCost: 91.30, leadTime: '2 days', rushLeadTime: '1 day', totalDays: '4–5 days', requiresFreight: false, category: 'Flat Print' },
  { sku: '3SB-FP-007', name: 'Flyers A5 (500)', price: 550, weight: 0.7, volWeight: 2, courierService: 'ECO 1', courierCost: 91.30, leadTime: '2 days', rushLeadTime: '1 day', totalDays: '4–5 days', requiresFreight: false, category: 'Flat Print' },
  { sku: '3SB-FP-008', name: 'Flyers A5 (1000)', price: 950, weight: 1.2, volWeight: 2, courierService: 'ECO 1', courierCost: 91.30, leadTime: '2 days', rushLeadTime: '1 day', totalDays: '4–5 days', requiresFreight: false, category: 'Flat Print' },
  { sku: '3SB-FP-009', name: 'Flyers A4 (100)', price: 385, weight: 0.6, volWeight: 2, courierService: 'ECO 1', courierCost: 91.30, leadTime: '2 days', rushLeadTime: '1 day', totalDays: '4–5 days', requiresFreight: false, category: 'Flat Print' },
  { sku: '3SB-FP-010', name: 'Flyers A4 (250)', price: 850, weight: 1.0, volWeight: 2, courierService: 'ECO 1', courierCost: 91.30, leadTime: '2 days', rushLeadTime: '1 day', totalDays: '4–5 days', requiresFreight: false, category: 'Flat Print' },
  { sku: '3SB-FP-011', name: 'Flyers A4 (500)', price: 1250, weight: 1.5, volWeight: 2, courierService: 'ECO 1', courierCost: 91.30, leadTime: '2 days', rushLeadTime: '1 day', totalDays: '4–5 days', requiresFreight: false, category: 'Flat Print' },
  { sku: '3SB-FP-012', name: 'Flyers A4 (1000)', price: 1950, weight: 2.5, volWeight: 3, courierService: 'ECO 2', courierCost: 100.00, leadTime: '2 days', rushLeadTime: '1 day', totalDays: '4–5 days', requiresFreight: false, category: 'Flat Print' },
  { sku: '3SB-FP-013', name: 'Business Cards Single-Sided (100)', price: 200, weight: 0.08, volWeight: 2, courierService: 'ECO 1', courierCost: 91.30, leadTime: '2–3 days', rushLeadTime: '1 day', totalDays: '4–6 days', requiresFreight: false, category: 'Flat Print' },
  { sku: '3SB-FP-014', name: 'Business Cards Double-Sided (100)', price: 350, weight: 0.08, volWeight: 2, courierService: 'ECO 1', courierCost: 91.30, leadTime: '2–3 days', rushLeadTime: '1 day', totalDays: '4–6 days', requiresFreight: false, category: 'Flat Print' },
  { sku: '3SB-FP-015', name: 'Business Cards Single-Sided (250)', price: 375, weight: 0.15, volWeight: 2, courierService: 'ECO 1', courierCost: 91.30, leadTime: '2–3 days', rushLeadTime: '1 day', totalDays: '4–6 days', requiresFreight: false, category: 'Flat Print' },
  { sku: '3SB-FP-016', name: 'Business Cards Double-Sided (250)', price: 500, weight: 0.15, volWeight: 2, courierService: 'ECO 1', courierCost: 91.30, leadTime: '2–3 days', rushLeadTime: '1 day', totalDays: '4–6 days', requiresFreight: false, category: 'Flat Print' },
  { sku: '3SB-FP-017', name: 'Business Cards Single-Sided (500)', price: 500, weight: 0.25, volWeight: 2, courierService: 'ECO 1', courierCost: 91.30, leadTime: '2–3 days', rushLeadTime: '1 day', totalDays: '4–6 days', requiresFreight: false, category: 'Flat Print' },
  { sku: '3SB-FP-018', name: 'Business Cards Double-Sided (500)', price: 700, weight: 0.25, volWeight: 2, courierService: 'ECO 1', courierCost: 91.30, leadTime: '2–3 days', rushLeadTime: '1 day', totalDays: '4–6 days', requiresFreight: false, category: 'Flat Print' },
  { sku: '3SB-FP-019', name: 'Poster A0', price: 300, weight: 0.5, volWeight: 2, courierService: 'ECO 1', courierCost: 91.30, leadTime: '1–2 days', rushLeadTime: 'Same day', totalDays: '3–5 days', requiresFreight: false, category: 'Flat Print' },
  { sku: '3SB-FP-020', name: 'Poster A1', price: 175, weight: 0.4, volWeight: 2, courierService: 'ECO 1', courierCost: 91.30, leadTime: '1–2 days', rushLeadTime: 'Same day', totalDays: '3–5 days', requiresFreight: false, category: 'Flat Print' },
  { sku: '3SB-FP-021', name: 'Poster A2', price: 120, weight: 0.3, volWeight: 2, courierService: 'ECO 1', courierCost: 91.30, leadTime: '1–2 days', rushLeadTime: 'Same day', totalDays: '3–4 days', requiresFreight: false, category: 'Flat Print' },
  { sku: '3SB-FP-022', name: 'Poster A3', price: 90, weight: 0.2, volWeight: 2, courierService: 'ECO 1', courierCost: 91.30, leadTime: '1 day', rushLeadTime: 'Same day', totalDays: '3–4 days', requiresFreight: false, category: 'Flat Print' },
  // ── C.2 Flying Banners ──────────────────────────────────────────────────────
  { sku: '3SB-FB-001', name: 'Telescopic Banner 2m Single', price: null, weight: 1.8, volWeight: 11.1, courierService: 'ECO 3', courierCost: 143.48, leadTime: '2–3 days', rushLeadTime: '1–2 days', totalDays: '4–6 days', requiresFreight: false, category: 'Flying Banners' },
  { sku: '3SB-FB-002', name: 'Telescopic Banner 3m Single', price: 1350, weight: 2.7, volWeight: 11.1, courierService: 'ECO 3', courierCost: 143.48, leadTime: '2–3 days', rushLeadTime: '1–2 days', totalDays: '4–6 days', requiresFreight: false, category: 'Flying Banners' },
  { sku: '3SB-FB-003', name: 'Telescopic Banner 3m Double', price: 1650, weight: 2.4, volWeight: 11.1, courierService: 'ECO 3', courierCost: 143.48, leadTime: '2–3 days', rushLeadTime: '1–2 days', totalDays: '4–6 days', requiresFreight: false, category: 'Flying Banners' },
  { sku: '3SB-FB-004', name: 'Telescopic Banner 4m Double', price: 1850, weight: 3.5, volWeight: 11.1, courierService: 'ECO 3', courierCost: 143.48, leadTime: '2–3 days', rushLeadTime: '1–2 days', totalDays: '4–6 days', requiresFreight: false, category: 'Flying Banners' },
  { sku: '3SB-FB-005', name: 'Teardrop Banner 2m Single', price: null, weight: 1.8, volWeight: 11.1, courierService: 'ECO 3', courierCost: 143.48, leadTime: '2–3 days', rushLeadTime: '1–2 days', totalDays: '4–6 days', requiresFreight: false, category: 'Flying Banners' },
  { sku: '3SB-FB-006', name: 'Teardrop Banner 3m Single', price: 1350, weight: 2.7, volWeight: 11.1, courierService: 'ECO 3', courierCost: 143.48, leadTime: '2–3 days', rushLeadTime: '1–2 days', totalDays: '4–6 days', requiresFreight: false, category: 'Flying Banners' },
  { sku: '3SB-FB-007', name: 'Teardrop Banner 2m Double', price: null, weight: 2.0, volWeight: 11.1, courierService: 'ECO 3', courierCost: 143.48, leadTime: '2–3 days', rushLeadTime: '1–2 days', totalDays: '4–6 days', requiresFreight: false, category: 'Flying Banners' },
  { sku: '3SB-FB-008', name: 'Teardrop Banner 3m Double', price: 1650, weight: 2.4, volWeight: 11.1, courierService: 'ECO 3', courierCost: 143.48, leadTime: '2–3 days', rushLeadTime: '1–2 days', totalDays: '4–6 days', requiresFreight: false, category: 'Flying Banners' },
  { sku: '3SB-FB-009', name: 'Sharkfin / Feather Banner 2m Single', price: null, weight: 1.4, volWeight: 11.1, courierService: 'ECO 3', courierCost: 143.48, leadTime: '2–3 days', rushLeadTime: '1–2 days', totalDays: '4–6 days', requiresFreight: false, category: 'Flying Banners' },
  { sku: '3SB-FB-010', name: 'Sharkfin / Feather Banner 3m Single', price: 1350, weight: 1.7, volWeight: 11.1, courierService: 'ECO 3', courierCost: 143.48, leadTime: '2–3 days', rushLeadTime: '1–2 days', totalDays: '4–6 days', requiresFreight: false, category: 'Flying Banners' },
  { sku: '3SB-FB-011', name: 'Sharkfin / Feather Banner 2m Double', price: null, weight: 2.0, volWeight: 11.1, courierService: 'ECO 3', courierCost: 143.48, leadTime: '2–3 days', rushLeadTime: '1–2 days', totalDays: '4–6 days', requiresFreight: false, category: 'Flying Banners' },
  { sku: '3SB-FB-012', name: 'Curvedhead Banner 2m Single', price: null, weight: 1.8, volWeight: 11.1, courierService: 'ECO 3', courierCost: 143.48, leadTime: '2–3 days', rushLeadTime: '1–2 days', totalDays: '4–6 days', requiresFreight: false, category: 'Flying Banners' },
  { sku: '3SB-FB-013', name: 'Curvedhead Banner 3m Single', price: 1350, weight: 2.7, volWeight: 11.1, courierService: 'ECO 3', courierCost: 143.48, leadTime: '2–3 days', rushLeadTime: '1–2 days', totalDays: '4–6 days', requiresFreight: false, category: 'Flying Banners' },
  { sku: '3SB-FB-014', name: 'Curvedhead Banner 3m Double', price: 1650, weight: 2.4, volWeight: 11.1, courierService: 'ECO 3', courierCost: 143.48, leadTime: '2–3 days', rushLeadTime: '1–2 days', totalDays: '4–6 days', requiresFreight: false, category: 'Flying Banners' },
  { sku: '3SB-FB-015', name: '3-Sided Lantern Banner 1400x1000mm', price: 2250, weight: 3.5, volWeight: 11.1, courierService: 'ECO 3', courierCost: 143.48, leadTime: '3 days', rushLeadTime: '2 days', totalDays: '5–6 days', requiresFreight: false, category: 'Flying Banners' },
  { sku: '3SB-FB-016', name: 'Parasol 2000mm', price: 3150, weight: 6.3, volWeight: 51.1, courierService: null, courierCost: null, leadTime: '3–4 days', rushLeadTime: null, totalDays: null, requiresFreight: true, category: 'Flying Banners' },
  { sku: '3SB-FB-017', name: 'Parasol 2500mm', price: 3650, weight: null, volWeight: null, courierService: null, courierCost: null, leadTime: '3–4 days', rushLeadTime: null, totalDays: null, requiresFreight: true, category: 'Flying Banners' },
  { sku: '3SB-FB-018', name: 'Parasol 3000mm', price: 6650, weight: null, volWeight: null, courierService: null, courierCost: null, leadTime: '3–4 days', rushLeadTime: null, totalDays: null, requiresFreight: true, category: 'Flying Banners' },
  // ── C.3 Pull-Up Banners & X-Frame / Spider Banners ──────────────────────────
  { sku: '3SB-PU-001', name: 'Economy Pull-Up Banner Single-Sided 2m x 850mm', price: 900, weight: 4.5, volWeight: 3.51, courierService: 'ECO 2', courierCost: 100.00, leadTime: '2 days', rushLeadTime: '1 day', totalDays: '4–5 days', requiresFreight: false, category: 'Pull-Up Banners' },
  { sku: '3SB-PU-002', name: 'Economy Pull-Up Banner Double-Sided 2m x 850mm', price: 2000, weight: 4.5, volWeight: 3.51, courierService: 'ECO 2', courierCost: 100.00, leadTime: '2 days', rushLeadTime: '1 day', totalDays: '4–5 days', requiresFreight: false, category: 'Pull-Up Banners' },
  { sku: '3SB-PU-003', name: 'Executive PVC Pull-Up Single-Sided 2m x 850mm', price: 1200, weight: 5.0, volWeight: 4.83, courierService: 'ECO 2', courierCost: 100.00, leadTime: '2 days', rushLeadTime: '1 day', totalDays: '4–5 days', requiresFreight: false, category: 'Pull-Up Banners' },
  { sku: '3SB-PU-004', name: 'Executive PVC Pull-Up Double-Sided 2m x 850mm', price: 2250, weight: 5.0, volWeight: 4.83, courierService: 'ECO 2', courierCost: 100.00, leadTime: '2 days', rushLeadTime: '1 day', totalDays: '4–5 days', requiresFreight: false, category: 'Pull-Up Banners' },
  { sku: '3SB-PU-005', name: 'Executive Textile Pull-Up 2100 x 1500mm', price: 2500, weight: 5.0, volWeight: 3.51, courierService: 'ECO 2', courierCost: 100.00, leadTime: '2–3 days', rushLeadTime: '1–2 days', totalDays: '4–6 days', requiresFreight: false, category: 'Pull-Up Banners' },
  { sku: '3SB-PU-006', name: 'X-Frame / Spider Banner Small 600 x 1600mm', price: 600, weight: 2.0, volWeight: 6.3, courierService: 'ECO 3', courierCost: 143.48, leadTime: '2 days', rushLeadTime: '1 day', totalDays: '4–5 days', requiresFreight: false, category: 'Pull-Up Banners' },
  { sku: '3SB-PU-007', name: 'X-Frame / Spider Banner Large 1800 x 800mm', price: 700, weight: 2.2, volWeight: 8.87, courierService: 'ECO 3', courierCost: 143.48, leadTime: '2 days', rushLeadTime: '1 day', totalDays: '4–5 days', requiresFreight: false, category: 'Pull-Up Banners' },
  // ── C.4 Wall Banners & Curved Banner Walls ───────────────────────────────────
  { sku: '3SB-WB-001', name: 'Banner Wall Straight 2250 x 2250mm', price: 4450, weight: 9.0, volWeight: 14.8, courierService: 'ECO 4', courierCost: 173.91, leadTime: '3–4 days', rushLeadTime: '2–3 days', totalDays: '6–8 days', requiresFreight: false, category: 'Wall Banners' },
  { sku: '3SB-WB-002', name: 'Banner Wall Straight 3000 x 2250mm', price: 4950, weight: 11.2, volWeight: 16.6, courierService: null, courierCost: null, leadTime: '4–5 days', rushLeadTime: '3 days', totalDays: null, requiresFreight: true, category: 'Wall Banners' },
  { sku: '3SB-WB-003', name: 'Banner Wall Straight 4500 x 2250mm', price: 6950, weight: 14, volWeight: 21.1, courierService: null, courierCost: null, leadTime: '5–6 days', rushLeadTime: null, totalDays: null, requiresFreight: true, category: 'Wall Banners' },
  { sku: '3SB-WB-004', name: 'Banner Wall Straight 6000 x 2250mm', price: 11500, weight: 18, volWeight: null, courierService: null, courierCost: null, leadTime: '6–7 days', rushLeadTime: null, totalDays: null, requiresFreight: true, category: 'Wall Banners' },
  { sku: '3SB-WB-005', name: 'Curved Banner Wall 2670 x 2250mm', price: 4350, weight: 9.2, volWeight: 17.2, courierService: 'ECO 5', courierCost: 228.60, leadTime: '4–5 days', rushLeadTime: '3–4 days', totalDays: '6–8 days', requiresFreight: false, category: 'Wall Banners' },
  { sku: '3SB-WB-006', name: 'Curved Banner Wall 3340 x 2250mm', price: 5250, weight: 11.3, volWeight: 18.9, courierService: null, courierCost: null, leadTime: '4–5 days', rushLeadTime: null, totalDays: null, requiresFreight: true, category: 'Wall Banners' },
  { sku: '3SB-WB-007', name: 'Curved Banner Wall 3980 x 2250mm', price: 6100, weight: 14.35, volWeight: 24.2, courierService: null, courierCost: null, leadTime: '5–6 days', rushLeadTime: null, totalDays: null, requiresFreight: true, category: 'Wall Banners' },
  // ── C.5 Gazebos ──────────────────────────────────────────────────────────────
  { sku: '3SB-GZ-001', name: 'Gazebo 3000 x 3000mm', price: 4600, weight: 15, volWeight: 30.9, courierService: null, courierCost: null, leadTime: '5–6 days', rushLeadTime: '4 days', totalDays: null, requiresFreight: true, category: 'Gazebos' },
  { sku: '3SB-GZ-002', name: 'Gazebo Aluminium Mechanism 3000 x 3000mm', price: 5500, weight: 16, volWeight: 30.9, courierService: null, courierCost: null, leadTime: '5–6 days', rushLeadTime: '4 days', totalDays: null, requiresFreight: true, category: 'Gazebos' },
  { sku: '3SB-GZ-003', name: 'Gazebo 4500 x 3000mm', price: 5500, weight: 20, volWeight: null, courierService: null, courierCost: null, leadTime: '6–7 days', rushLeadTime: '5 days', totalDays: null, requiresFreight: true, category: 'Gazebos' },
  { sku: '3SB-GZ-004', name: 'Gazebo 6000 x 3000mm', price: 6250, weight: 25, volWeight: null, courierService: null, courierCost: null, leadTime: '6–7 days', rushLeadTime: null, totalDays: null, requiresFreight: true, category: 'Gazebos' },
  { sku: '3SB-GZ-005', name: 'Gazebo Aluminium Mechanism 6000 x 3000mm', price: 8350, weight: 28, volWeight: null, courierService: null, courierCost: null, leadTime: '6–7 days', rushLeadTime: null, totalDays: null, requiresFreight: true, category: 'Gazebos' },
  { sku: '3SB-GZ-007', name: 'Gazebo Walls 3000 x 3000mm (1 wall)', price: 1200, weight: 1.5, volWeight: 3, courierService: 'ECO 2', courierCost: 100.00, leadTime: '3–4 days', rushLeadTime: '2–3 days', totalDays: '5–7 days', requiresFreight: false, category: 'Gazebos' },
  { sku: '3SB-GZ-008', name: 'Gazebo Walls 3000 x 3000mm (2 walls)', price: 1300, weight: 2.0, volWeight: 4, courierService: 'ECO 2', courierCost: 100.00, leadTime: '3–4 days', rushLeadTime: '2–3 days', totalDays: '5–7 days', requiresFreight: false, category: 'Gazebos' },
  { sku: '3SB-GZ-009', name: 'Gazebo Walls 4500 x 3000mm', price: 1850, weight: 3.0, volWeight: 5, courierService: 'ECO 2', courierCost: 100.00, leadTime: '3–4 days', rushLeadTime: '2–3 days', totalDays: '5–7 days', requiresFreight: false, category: 'Gazebos' },
  { sku: '3SB-GZ-010', name: 'Gazebo Walls 6000 x 3000mm', price: 2300, weight: 4.0, volWeight: 7, courierService: 'ECO 3', courierCost: 143.48, leadTime: '3–4 days', rushLeadTime: '2–3 days', totalDays: '5–7 days', requiresFreight: false, category: 'Gazebos' },
  // ── C.6 Outdoor Accessories ──────────────────────────────────────────────────
  { sku: '3SB-OA-001', name: 'A-Frame PVC 2000 x 1000mm', price: 1850, weight: 3.2, volWeight: 17.1, courierService: 'ECO 5', courierCost: 227.30, leadTime: '2–3 days', rushLeadTime: '1–2 days', totalDays: '4–6 days', requiresFreight: false, category: 'Outdoor Accessories' },
  { sku: '3SB-OA-002', name: 'A-Frame Textile 2000 x 1000mm', price: 2300, weight: 3.2, volWeight: 17.1, courierService: 'ECO 5', courierCost: 227.30, leadTime: '2–3 days', rushLeadTime: '1–2 days', totalDays: '4–6 days', requiresFreight: false, category: 'Outdoor Accessories' },
  { sku: '3SB-OA-003', name: 'A-Frame Textile Full Wrap 2m x 1m', price: 2750, weight: 3.5, volWeight: 17.1, courierService: 'ECO 5', courierCost: 227.30, leadTime: '2–3 days', rushLeadTime: '1–2 days', totalDays: '4–6 days', requiresFreight: false, category: 'Outdoor Accessories' },
  { sku: '3SB-OA-004', name: 'A-Frame Textile Full Wrap 3m x 1m', price: 3100, weight: 3.8, volWeight: 17.1, courierService: 'ECO 5', courierCost: 227.30, leadTime: '2–3 days', rushLeadTime: '1–2 days', totalDays: '4–6 days', requiresFreight: false, category: 'Outdoor Accessories' },
  { sku: '3SB-OA-005', name: '2-Sided Pop-Up Banner 1000 x 700mm', price: 950, weight: 2.0, volWeight: 18.1, courierService: 'ECO 5', courierCost: 226.20, leadTime: '2–3 days', rushLeadTime: '1–2 days', totalDays: '4–6 days', requiresFreight: false, category: 'Outdoor Accessories' },
  { sku: '3SB-OA-006', name: '2-Sided Pop-Up Banner 1500 x 700mm', price: 1250, weight: 2.5, volWeight: 18.1, courierService: 'ECO 5', courierCost: 226.20, leadTime: '2–3 days', rushLeadTime: '1–2 days', totalDays: '4–6 days', requiresFreight: false, category: 'Outdoor Accessories' },
  { sku: '3SB-OA-007', name: '2-Sided Pop-Up Banner 2000 x 700mm', price: 1450, weight: 3.0, volWeight: 18.1, courierService: 'ECO 5', courierCost: 226.20, leadTime: '2–3 days', rushLeadTime: '1–2 days', totalDays: '4–6 days', requiresFreight: false, category: 'Outdoor Accessories' },
  { sku: '3SB-OA-008', name: '2-Sided Pop-Up Banner 2000 x 1000mm', price: 1850, weight: 4.5, volWeight: 18.1, courierService: 'ECO 5', courierCost: 226.20, leadTime: '2–3 days', rushLeadTime: '1–2 days', totalDays: '4–6 days', requiresFreight: false, category: 'Outdoor Accessories' },
  { sku: '3SB-OA-009', name: '3-Sided Pop-Up Banner 1000 x 700mm', price: 2300, weight: 3.5, volWeight: 18, courierService: 'ECO 5', courierCost: 226.20, leadTime: '3 days', rushLeadTime: '2 days', totalDays: '5–6 days', requiresFreight: false, category: 'Outdoor Accessories' },
  { sku: '3SB-OA-010', name: 'Branded Tablecloth 1800 x 750mm', price: 600, weight: 0.4, volWeight: 2, courierService: 'ECO 1', courierCost: 91.30, leadTime: '2 days', rushLeadTime: '1 day', totalDays: '4–5 days', requiresFreight: false, category: 'Outdoor Accessories' },
  { sku: '3SB-OA-011', name: 'Branded Tablecloth 1400 x 1500mm', price: 700, weight: 0.6, volWeight: 2, courierService: 'ECO 1', courierCost: 91.30, leadTime: '2 days', rushLeadTime: '1 day', totalDays: '4–5 days', requiresFreight: false, category: 'Outdoor Accessories' },
  { sku: '3SB-OA-012', name: 'Branded Tablecloth 1800 x 1200mm', price: 750, weight: 0.7, volWeight: 2, courierService: 'ECO 1', courierCost: 91.30, leadTime: '2 days', rushLeadTime: '1 day', totalDays: '4–5 days', requiresFreight: false, category: 'Outdoor Accessories' },
  { sku: '3SB-OA-013', name: 'Branded Tablecloth 3000 x 1400mm', price: 1200, weight: 0.9, volWeight: 2, courierService: 'ECO 1', courierCost: 91.30, leadTime: '2 days', rushLeadTime: '1 day', totalDays: '4–5 days', requiresFreight: false, category: 'Outdoor Accessories' },
  { sku: '3SB-OA-014', name: 'Branded Promo Table 1240 x 610mm', price: 2500, weight: 3.5, volWeight: 4, courierService: 'ECO 2', courierCost: 100.00, leadTime: '3 days', rushLeadTime: '2 days', totalDays: '5–6 days', requiresFreight: false, category: 'Outdoor Accessories' },
  { sku: '3SB-OA-015', name: 'Vehicle Magnetic Sticker 300 x 400mm', price: 500, weight: 0.3, volWeight: 2, courierService: 'ECO 1', courierCost: 91.30, leadTime: '2 days', rushLeadTime: '1 day', totalDays: '4–5 days', requiresFreight: false, category: 'Outdoor Accessories' },
  { sku: '3SB-OA-016', name: 'Vehicle Magnetic Sticker 400 x 400mm', price: 500, weight: 0.3, volWeight: 2, courierService: 'ECO 1', courierCost: 91.30, leadTime: '2 days', rushLeadTime: '1 day', totalDays: '4–5 days', requiresFreight: false, category: 'Outdoor Accessories' },
  { sku: '3SB-OA-017', name: 'Vehicle Magnetic Sticker 400 x 600mm', price: 600, weight: 0.4, volWeight: 2, courierService: 'ECO 1', courierCost: 91.30, leadTime: '2 days', rushLeadTime: '1 day', totalDays: '4–5 days', requiresFreight: false, category: 'Outdoor Accessories' },
  { sku: '3SB-OA-018', name: 'Street Pole Banner 3000 x 1000mm', price: 750, weight: null, volWeight: null, courierService: null, courierCost: null, leadTime: '3 days', rushLeadTime: '2 days', totalDays: '5+ days', requiresFreight: false, category: 'Outdoor Accessories' },
  { sku: '3SB-OA-019', name: 'Street Pole Banner 1500 x 750mm', price: 650, weight: null, volWeight: null, courierService: null, courierCost: null, leadTime: '3 days', rushLeadTime: '2 days', totalDays: '5+ days', requiresFreight: false, category: 'Outdoor Accessories' },
  { sku: '3SB-OA-020', name: 'Sandwich Board A1 594 x 841mm', price: 1850, weight: null, volWeight: null, courierService: null, courierCost: null, leadTime: '1–2 days', rushLeadTime: 'Same day', totalDays: null, requiresFreight: false, category: 'Outdoor Accessories' },
  { sku: '3SB-OA-021', name: 'Large Format Printing (per metre)', price: 300, weight: null, volWeight: null, courierService: 'ECO 1', courierCost: 91.30, leadTime: '1–2 days', rushLeadTime: null, totalDays: '3–5 days', requiresFreight: false, category: 'Outdoor Accessories' },
  // ── C.7 T-Shirt Printing & Apparel ───────────────────────────────────────────
  { sku: '3SB-TS-001', name: 'Sublimation Golf/Round Neck Full (5–20 qty)', price: 275, weight: null, volWeight: null, courierService: 'ECO 1', courierCost: 91.30, leadTime: '2–3 days', rushLeadTime: null, totalDays: '4–5 days', requiresFreight: false, category: 'T-Shirt Printing' },
  { sku: '3SB-TS-002', name: 'Sublimation Golf/Round Neck Full (20–50 qty)', price: 250, weight: null, volWeight: null, courierService: 'ECO 1', courierCost: 91.30, leadTime: '2–3 days', rushLeadTime: null, totalDays: '4–5 days', requiresFreight: false, category: 'T-Shirt Printing' },
  { sku: '3SB-TS-003', name: 'Sublimation Golf/Round Neck Full (50–100 qty)', price: 230, weight: null, volWeight: null, courierService: 'ECO 1', courierCost: 91.30, leadTime: '2–3 days', rushLeadTime: null, totalDays: '4–5 days', requiresFreight: false, category: 'T-Shirt Printing' },
  { sku: '3SB-TS-004', name: 'Flex Heat Press — Pocket', price: 30, weight: null, volWeight: null, courierService: 'ECO 1', courierCost: 91.30, leadTime: '1–2 days', rushLeadTime: 'Same day', totalDays: '3–5 days', requiresFreight: false, category: 'T-Shirt Printing' },
  { sku: '3SB-TS-005', name: 'Flex Heat Press — A5', price: 40, weight: null, volWeight: null, courierService: 'ECO 1', courierCost: 91.30, leadTime: '1–2 days', rushLeadTime: 'Same day', totalDays: '3–5 days', requiresFreight: false, category: 'T-Shirt Printing' },
  { sku: '3SB-TS-006', name: 'Flex Heat Press — A4', price: 70, weight: null, volWeight: null, courierService: 'ECO 1', courierCost: 91.30, leadTime: '1–2 days', rushLeadTime: 'Same day', totalDays: '3–5 days', requiresFreight: false, category: 'T-Shirt Printing' },
  { sku: '3SB-TS-007', name: 'Flex Heat Press — A3', price: 100, weight: null, volWeight: null, courierService: 'ECO 1', courierCost: 91.30, leadTime: '1–2 days', rushLeadTime: 'Same day', totalDays: '3–5 days', requiresFreight: false, category: 'T-Shirt Printing' },
  { sku: '3SB-TS-008', name: 'Flock / Metallic — Pocket', price: 40, weight: null, volWeight: null, courierService: 'ECO 1', courierCost: 91.30, leadTime: '1–2 days', rushLeadTime: 'Same day', totalDays: '3–5 days', requiresFreight: false, category: 'T-Shirt Printing' },
  { sku: '3SB-TS-009', name: 'Flock / Metallic — A5', price: 50, weight: null, volWeight: null, courierService: 'ECO 1', courierCost: 91.30, leadTime: '1–2 days', rushLeadTime: 'Same day', totalDays: '3–5 days', requiresFreight: false, category: 'T-Shirt Printing' },
  { sku: '3SB-TS-010', name: 'Flock / Metallic — A4', price: 90, weight: null, volWeight: null, courierService: 'ECO 1', courierCost: 91.30, leadTime: '1–2 days', rushLeadTime: 'Same day', totalDays: '3–5 days', requiresFreight: false, category: 'T-Shirt Printing' },
  { sku: '3SB-TS-011', name: 'Flock / Metallic — A3', price: 120, weight: null, volWeight: null, courierService: 'ECO 1', courierCost: 91.30, leadTime: '1–2 days', rushLeadTime: 'Same day', totalDays: '3–5 days', requiresFreight: false, category: 'T-Shirt Printing' },
  { sku: '3SB-TS-012', name: 'DTF Direct-to-Film Full (0–25m)', price: 300, weight: null, volWeight: null, courierService: 'ECO 1', courierCost: 91.30, leadTime: '1–2 days', rushLeadTime: 'Same day', totalDays: '3–5 days', requiresFreight: false, category: 'T-Shirt Printing' },
  { sku: '3SB-TS-013', name: 'DTF Direct-to-Film Full (25–75m)', price: 275, weight: null, volWeight: null, courierService: 'ECO 1', courierCost: 91.30, leadTime: '1–2 days', rushLeadTime: 'Same day', totalDays: '3–5 days', requiresFreight: false, category: 'T-Shirt Printing' },
  { sku: '3SB-TS-014', name: 'DTF Direct-to-Film Full (75–150m)', price: 250, weight: null, volWeight: null, courierService: 'ECO 1', courierCost: 91.30, leadTime: '1–2 days', rushLeadTime: 'Same day', totalDays: '3–5 days', requiresFreight: false, category: 'T-Shirt Printing' },
  { sku: '3SB-TS-015', name: 'Screen Print — Pocket (min 12)', price: 35, weight: null, volWeight: null, courierService: 'ECO 2', courierCost: 100.00, leadTime: '3–4 days', rushLeadTime: '2–3 days', totalDays: '5–7 days', requiresFreight: false, category: 'T-Shirt Printing' },
  { sku: '3SB-TS-016', name: 'Screen Print — A5 (min 12)', price: 50, weight: null, volWeight: null, courierService: 'ECO 2', courierCost: 100.00, leadTime: '3–4 days', rushLeadTime: '2–3 days', totalDays: '5–7 days', requiresFreight: false, category: 'T-Shirt Printing' },
  { sku: '3SB-TS-017', name: 'Screen Print — A4 (min 12)', price: 70, weight: null, volWeight: null, courierService: 'ECO 2', courierCost: 100.00, leadTime: '3–4 days', rushLeadTime: '2–3 days', totalDays: '5–7 days', requiresFreight: false, category: 'T-Shirt Printing' },
  { sku: '3SB-TS-018', name: 'Screen Print — A3 (min 12)', price: 90, weight: null, volWeight: null, courierService: 'ECO 2', courierCost: 100.00, leadTime: '3–4 days', rushLeadTime: '2–3 days', totalDays: '5–7 days', requiresFreight: false, category: 'T-Shirt Printing' },
  { sku: '3SB-TS-019', name: 'Embroidery — Pocket Size (min 6)', price: 40, weight: null, volWeight: null, courierService: 'ECO 1', courierCost: 91.30, leadTime: '3–5 days', rushLeadTime: '3 days', totalDays: '5–8 days', requiresFreight: false, category: 'T-Shirt Printing' },
  { sku: '3SB-TS-020', name: 'Embroidery — Back Size (min 6)', price: 85, weight: null, volWeight: null, courierService: 'ECO 1', courierCost: 91.30, leadTime: '3–5 days', rushLeadTime: '3 days', totalDays: '5–8 days', requiresFreight: false, category: 'T-Shirt Printing' },
  { sku: '3SB-TS-021', name: 'Embroidery — A4 (min 6)', price: 85, weight: null, volWeight: null, courierService: 'ECO 1', courierCost: 91.30, leadTime: '3–5 days', rushLeadTime: '3 days', totalDays: '5–8 days', requiresFreight: false, category: 'T-Shirt Printing' },
  { sku: '3SB-TS-022', name: 'Embroidery — A3 (min 6)', price: 125, weight: null, volWeight: null, courierService: 'ECO 1', courierCost: 91.30, leadTime: '3–5 days', rushLeadTime: '3 days', totalDays: '5–8 days', requiresFreight: false, category: 'T-Shirt Printing' },
  // ── C.8 Graphic Design Packages ──────────────────────────────────────────────
  { sku: '3SB-GD-001', name: 'Bronze Design Package', price: 1250, weight: null, volWeight: null, courierService: null, courierCost: null, leadTime: '3–5 days', rushLeadTime: '2–3 days', totalDays: null, requiresFreight: false, category: 'Graphic Design' },
  { sku: '3SB-GD-002', name: 'Silver Design Package', price: 2000, weight: null, volWeight: null, courierService: null, courierCost: null, leadTime: '3–5 days', rushLeadTime: '2–3 days', totalDays: null, requiresFreight: false, category: 'Graphic Design' },
  { sku: '3SB-GD-003', name: 'Gold Design Package', price: 3000, weight: null, volWeight: null, courierService: null, courierCost: null, leadTime: '5–7 days', rushLeadTime: '4–5 days', totalDays: null, requiresFreight: false, category: 'Graphic Design' },
  { sku: '3SB-GD-004', name: 'Logo Design (New)', price: 500, weight: null, volWeight: null, courierService: null, courierCost: null, leadTime: '3–5 days', rushLeadTime: '2–3 days', totalDays: null, requiresFreight: false, category: 'Graphic Design' },
  { sku: '3SB-GD-005', name: 'Business Card Design', price: 250, weight: null, volWeight: null, courierService: null, courierCost: null, leadTime: '1–2 days', rushLeadTime: 'Same day', totalDays: null, requiresFreight: false, category: 'Graphic Design' },
  { sku: '3SB-GD-006', name: 'Letterhead Design', price: 400, weight: null, volWeight: null, courierService: null, courierCost: null, leadTime: '1–2 days', rushLeadTime: 'Same day', totalDays: null, requiresFreight: false, category: 'Graphic Design' },
  { sku: '3SB-GD-007', name: 'Email Signature Design', price: 300, weight: null, volWeight: null, courierService: null, courierCost: null, leadTime: '1 day', rushLeadTime: 'Same day', totalDays: null, requiresFreight: false, category: 'Graphic Design' },
  { sku: '3SB-GD-008', name: 'Invoice & Quote Design', price: 400, weight: null, volWeight: null, courierService: null, courierCost: null, leadTime: '1–2 days', rushLeadTime: 'Same day', totalDays: null, requiresFreight: false, category: 'Graphic Design' },
  { sku: '3SB-GD-009', name: 'Flyer / Banner Design', price: 250, weight: null, volWeight: null, courierService: null, courierCost: null, leadTime: '1–2 days', rushLeadTime: 'Same day', totalDays: null, requiresFreight: false, category: 'Graphic Design' },
  { sku: '3SB-GD-010', name: 'Company Profile Design', price: 900, weight: null, volWeight: null, courierService: null, courierCost: null, leadTime: '5–7 days', rushLeadTime: '4–5 days', totalDays: null, requiresFreight: false, category: 'Graphic Design' },
  { sku: '3SB-GD-011', name: 'Logo Redraw (Vectorise)', price: 300, weight: null, volWeight: null, courierService: null, courierCost: null, leadTime: '1–2 days', rushLeadTime: 'Same day', totalDays: null, requiresFreight: false, category: 'Graphic Design' },
  { sku: '3SB-GD-012', name: 'Business Plan Design', price: 750, weight: null, volWeight: null, courierService: null, courierCost: null, leadTime: '3–5 days', rushLeadTime: '2–3 days', totalDays: null, requiresFreight: false, category: 'Graphic Design' },
  { sku: '3SB-GD-013', name: 'Pull-Up Banner Design', price: 300, weight: null, volWeight: null, courierService: null, courierCost: null, leadTime: '1–2 days', rushLeadTime: 'Same day', totalDays: null, requiresFreight: false, category: 'Graphic Design' },
  { sku: '3SB-GD-014', name: 'Welcome Board A1 (Print Included)', price: 2050, weight: null, volWeight: null, courierService: null, courierCost: null, leadTime: '2–3 days', rushLeadTime: null, totalDays: null, requiresFreight: false, category: 'Graphic Design' },
  { sku: '3SB-GD-015', name: 'Water Bottle Label / Sticker (per unit)', price: 1.50, weight: null, volWeight: null, courierService: null, courierCost: null, leadTime: '2 days', rushLeadTime: null, totalDays: null, requiresFreight: false, category: 'Graphic Design' },
  // ── C.9 Literature & Digital Printing ────────────────────────────────────────
  { sku: '3SB-LF-001', name: 'Document Printing B/W A4', price: 2, weight: null, volWeight: null, courierService: 'ECO 1', courierCost: 91.30, leadTime: '1 day', rushLeadTime: 'Same day', totalDays: '3–4 days', requiresFreight: false, category: 'Literature & Digital' },
  { sku: '3SB-LF-002', name: 'Document Printing B/W A3', price: 5, weight: null, volWeight: null, courierService: 'ECO 1', courierCost: 91.30, leadTime: '1 day', rushLeadTime: 'Same day', totalDays: '3–4 days', requiresFreight: false, category: 'Literature & Digital' },
  { sku: '3SB-LF-003', name: 'Document Printing Colour A4', price: 2, weight: null, volWeight: null, courierService: 'ECO 1', courierCost: 91.30, leadTime: '1 day', rushLeadTime: 'Same day', totalDays: '3–4 days', requiresFreight: false, category: 'Literature & Digital' },
  { sku: '3SB-LF-004', name: 'Document Printing Colour A3', price: 9, weight: null, volWeight: null, courierService: 'ECO 1', courierCost: 91.30, leadTime: '1 day', rushLeadTime: 'Same day', totalDays: '3–4 days', requiresFreight: false, category: 'Literature & Digital' },
  { sku: '3SB-LF-005', name: 'Poster Printing A3', price: 90, weight: 0.2, volWeight: 2, courierService: 'ECO 1', courierCost: 91.30, leadTime: '1–2 days', rushLeadTime: 'Same day', totalDays: '3–4 days', requiresFreight: false, category: 'Literature & Digital' },
  { sku: '3SB-LF-006', name: 'Poster Printing A2', price: 120, weight: 0.3, volWeight: 2, courierService: 'ECO 1', courierCost: 91.30, leadTime: '1–2 days', rushLeadTime: 'Same day', totalDays: '3–4 days', requiresFreight: false, category: 'Literature & Digital' },
  { sku: '3SB-LF-007', name: 'Poster Printing A1', price: 175, weight: 0.4, volWeight: 2, courierService: 'ECO 1', courierCost: 91.30, leadTime: '1–2 days', rushLeadTime: 'Same day', totalDays: '3–5 days', requiresFreight: false, category: 'Literature & Digital' },
  { sku: '3SB-LF-008', name: 'Poster Printing A0', price: 300, weight: 0.5, volWeight: 2, courierService: 'ECO 1', courierCost: 91.30, leadTime: '1–2 days', rushLeadTime: 'Same day', totalDays: '3–5 days', requiresFreight: false, category: 'Literature & Digital' },
  { sku: '3SB-LF-009', name: 'Canvas Printing A4', price: 375, weight: null, volWeight: null, courierService: 'ECO 1', courierCost: 91.30, leadTime: '2–3 days', rushLeadTime: '1–2 days', totalDays: '4–6 days', requiresFreight: false, category: 'Literature & Digital' },
  { sku: '3SB-LF-010', name: 'Canvas Printing A3', price: 450, weight: null, volWeight: null, courierService: 'ECO 1', courierCost: 91.30, leadTime: '2–3 days', rushLeadTime: '1–2 days', totalDays: '4–6 days', requiresFreight: false, category: 'Literature & Digital' },
  { sku: '3SB-LF-011', name: 'Canvas Printing A2', price: 450, weight: null, volWeight: null, courierService: 'ECO 1', courierCost: 91.30, leadTime: '2–3 days', rushLeadTime: '1–2 days', totalDays: '4–6 days', requiresFreight: false, category: 'Literature & Digital' },
  { sku: '3SB-LF-012', name: 'Canvas Printing A1', price: 750, weight: null, volWeight: null, courierService: 'ECO 1', courierCost: 91.30, leadTime: '2–3 days', rushLeadTime: '1–2 days', totalDays: '4–6 days', requiresFreight: false, category: 'Literature & Digital' },
  { sku: '3SB-LF-013', name: 'Canvas Printing A0', price: 1200, weight: null, volWeight: null, courierService: 'ECO 1', courierCost: 91.30, leadTime: '2–3 days', rushLeadTime: '1–2 days', totalDays: '4–6 days', requiresFreight: false, category: 'Literature & Digital' },
  { sku: '3SB-LF-014', name: 'Acrylic Printing A4', price: 450, weight: null, volWeight: null, courierService: 'ECO 1', courierCost: 91.30, leadTime: '2–3 days', rushLeadTime: '1–2 days', totalDays: '4–6 days', requiresFreight: false, category: 'Literature & Digital' },
  { sku: '3SB-LF-015', name: 'Acrylic Printing A3', price: 550, weight: null, volWeight: null, courierService: 'ECO 1', courierCost: 91.30, leadTime: '2–3 days', rushLeadTime: '1–2 days', totalDays: '4–6 days', requiresFreight: false, category: 'Literature & Digital' },
  { sku: '3SB-LF-016', name: 'Acrylic Printing A2', price: 750, weight: null, volWeight: null, courierService: 'ECO 1', courierCost: 91.30, leadTime: '2–3 days', rushLeadTime: '1–2 days', totalDays: '4–6 days', requiresFreight: false, category: 'Literature & Digital' },
  { sku: '3SB-LF-017', name: 'Acrylic Printing A1', price: 1760, weight: null, volWeight: null, courierService: 'ECO 1', courierCost: 91.30, leadTime: '2–3 days', rushLeadTime: '1–2 days', totalDays: '4–6 days', requiresFreight: false, category: 'Literature & Digital' },
  { sku: '3SB-LF-018', name: 'Acrylic Printing A0', price: 2450, weight: null, volWeight: null, courierService: 'ECO 1', courierCost: 91.30, leadTime: '2–3 days', rushLeadTime: '1–2 days', totalDays: '4–6 days', requiresFreight: false, category: 'Literature & Digital' },
  // ── C.10 Vehicle Branding & Large Format ─────────────────────────────────────
  { sku: '3SB-VB-001', name: 'Vehicle Branding (Vinyl Decals / Partial / Full Wrap)', price: 1250, weight: null, volWeight: null, courierService: null, courierCost: null, leadTime: 'By quote', rushLeadTime: null, totalDays: null, requiresFreight: false, category: 'Vehicle Branding' },
  { sku: '3SB-VB-002', name: 'Large Format Printing — Vinyl / PVC / Stickers / Wallpaper / Sandblast (per metre)', price: 350, weight: null, volWeight: null, courierService: 'ECO 1', courierCost: 91.30, leadTime: '1–2 days', rushLeadTime: null, totalDays: '3–5 days', requiresFreight: false, category: 'Vehicle Branding' },
  { sku: '3SB-VB-003', name: 'Chromadek Sign', price: 1750, weight: null, volWeight: null, courierService: null, courierCost: null, leadTime: '2–3 days', rushLeadTime: null, totalDays: null, requiresFreight: false, category: 'Vehicle Branding' },
  { sku: '3SB-VB-004', name: 'Acrylic Laser-Cut Sign', price: 1250, weight: null, volWeight: null, courierService: null, courierCost: null, leadTime: '2–3 days', rushLeadTime: null, totalDays: null, requiresFreight: false, category: 'Vehicle Branding' },
  { sku: '3SB-VB-005', name: 'Illuminated Lightbox', price: 2250, weight: null, volWeight: null, courierService: null, courierCost: null, leadTime: '3–5 days', rushLeadTime: null, totalDays: null, requiresFreight: false, category: 'Vehicle Branding' },

  // ── Section D — Combo Deals ───────────────────────────────────────────────────
  { sku: '3SB-CB-001', name: 'Combo Deal 1 — Gazebo + 2x Telescopic + Pop-Up + Director Chairs', price: 12000, weight: null, volWeight: null, courierService: null, courierCost: null, leadTime: '5–7 days', rushLeadTime: null, totalDays: null, requiresFreight: true, category: 'Combo Deals' },
  { sku: '3SB-CB-002', name: 'Combo Deal 2 — 4x Teardrops + Gazebo + 2x Pop-Up + Tablecloth', price: 15550, weight: null, volWeight: null, courierService: null, courierCost: null, leadTime: '5–7 days', rushLeadTime: null, totalDays: null, requiresFreight: true, category: 'Combo Deals' },
  { sku: '3SB-CB-003', name: 'Combo Deal 3 — 4x Teardrops + Gazebo + 2x Pop-Up + Tablecloth + Director Chairs', price: 16950, weight: null, volWeight: null, courierService: null, courierCost: null, leadTime: '5–7 days', rushLeadTime: null, totalDays: null, requiresFreight: true, category: 'Combo Deals' },
];

// ─────────────────────────────────────────────────────────────────────────────
// Main update function — upserts each product by SKU
// ─────────────────────────────────────────────────────────────────────────────
async function updateProducts() {
  const productsCol = collection(db, 'products');
  let created = 0;
  let updated = 0;
  let errors = 0;

  console.log(`Starting update — ${CATALOGUE_UPDATES.length} products to process...`);

  for (const product of CATALOGUE_UPDATES) {
    try {
      // Query Firestore for an existing document with this SKU
      const q = query(productsCol, where('sku', '==', product.sku));
      const snapshot = await getDocs(q);

      if (!snapshot.empty) {
        // Update the first matching document
        const docRef = snapshot.docs[0].ref;
        await updateDoc(docRef, {
          ...product,
          updatedAt: serverTimestamp(),
        });
        console.log(`  [UPDATE] ${product.sku} — ${product.name}`);
        updated++;
      } else {
        // Create a new document
        await addDoc(productsCol, {
          ...product,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
        console.log(`  [CREATE] ${product.sku} — ${product.name}`);
        created++;
      }
    } catch (err) {
      console.error(`  [ERROR]  ${product.sku} — ${err.message}`);
      errors++;
    }
  }

  console.log('');
  console.log('─────────────────────────────────────────');
  console.log(`Done.  Created: ${created}  |  Updated: ${updated}  |  Errors: ${errors}`);
  console.log('─────────────────────────────────────────');
}

updateProducts().catch(console.error);
