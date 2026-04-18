import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, getDocs, serverTimestamp } from 'firebase/firestore';

// Firebase config — reads from your .env values directly
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

// ---- paste your products array here (copied from src/data/products.js) ----
// We import it dynamically below instead
import { products, categories } from '../src/data/products.js';

async function seed() {
  // --- CATEGORIES ---
  const existingCats = await getDocs(collection(db, 'categories'));
  if (existingCats.empty) {
    console.log('Seeding categories...');
    for (const cat of categories) {
      await addDoc(collection(db, 'categories'), { ...cat, createdAt: serverTimestamp() });
      console.log('  + ' + cat.name);
    }
  } else {
    console.log('Categories already exist (' + existingCats.size + ') — skipping.');
  }

  // --- PRODUCTS ---
  const existingProds = await getDocs(collection(db, 'products'));
  if (existingProds.empty) {
    console.log('Seeding ' + products.length + ' products...');
    let i = 0;
    for (const product of products) {
      const { id: localId, ...rest } = product;
      await addDoc(collection(db, 'products'), { ...rest, localId, createdAt: serverTimestamp() });
      i++;
      console.log('  [' + i + '/' + products.length + '] ' + product.name);
    }
    console.log('Done! ' + i + ' products added to Firestore.');
  } else {
    console.log('Products already exist (' + existingProds.size + ') — skipping.');
    console.log('To re-seed, delete the products collection in Firebase console first.');
  }
}

seed().catch(console.error);
