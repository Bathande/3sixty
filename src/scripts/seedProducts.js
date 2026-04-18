/**
 * ONE-TIME SEED SCRIPT
 * -----------------------------------------------------------
 * Uploads all products & categories from src/data/products.js
 * into Firestore.
 *
 * HOW TO RUN (easiest — browser):
 *   1. Temporarily add a button anywhere in your app:
 *
 *      import { seedAll } from '../scripts/seedProducts';
 *      <button onClick={seedAll}>Seed Database</button>
 *
 *   2. Click it ONCE, watch the console for progress.
 *   3. Verify data in Firebase console → Firestore.
 *   4. Remove the button.
 *
 * WARNING: Running more than once will create duplicates.
 * The script checks for existing data and aborts if found.
 * -----------------------------------------------------------
 */

import { db } from '../firebase';
import { collection, addDoc, getDocs, serverTimestamp } from 'firebase/firestore';
import { products, categories } from '../data/products';

export async function seedProducts() {
  const existing = await getDocs(collection(db, 'products'));
  if (!existing.empty) {
    console.warn(`⚠️  "products" collection already has ${existing.size} documents. Seed aborted.`);
    return { skipped: true, reason: 'Collection already has data' };
  }

  console.log(`🌱 Seeding ${products.length} products...`);
  let count = 0;

  for (const product of products) {
    const { id: localId, ...rest } = product;
    await addDoc(collection(db, 'products'), {
      ...rest,
      localId,
      createdAt: serverTimestamp(),
    });
    count++;
    console.log(`  ✓ [${count}/${products.length}] ${product.name}`);
  }

  console.log('✅ Products seeded successfully!');
  return { success: true, count };
}

export async function seedCategories() {
  const existing = await getDocs(collection(db, 'categories'));
  if (!existing.empty) {
    console.warn(`⚠️  "categories" collection already has ${existing.size} documents. Seed aborted.`);
    return { skipped: true, reason: 'Collection already has data' };
  }

  console.log(`🌱 Seeding ${categories.length} categories...`);

  for (const category of categories) {
    await addDoc(collection(db, 'categories'), {
      ...category,
      createdAt: serverTimestamp(),
    });
    console.log(`  ✓ ${category.name}`);
  }

  console.log('✅ Categories seeded successfully!');
  return { success: true, count: categories.length };
}

export async function seedAll() {
  console.log('🚀 Starting full database seed...');
  const catResult = await seedCategories();
  const prodResult = await seedProducts();
  console.log('🎉 Seed complete!', { categories: catResult, products: prodResult });
  return { categories: catResult, products: prodResult };
}
