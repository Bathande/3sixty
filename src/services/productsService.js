import { db } from '../firebase';
import {
  collection,
  addDoc,
  getDocs,
  getDoc,
  doc,
  query,
  where,
  orderBy,
  updateDoc,
  deleteDoc,
  serverTimestamp,
} from 'firebase/firestore';

const COLLECTION = 'products';

/**
 * Add a new product to the catalogue.
 * @param {object} productData - Product fields (name, category, price, description, image, etc.)
 * @returns {string} The new document ID
 */
export const addProduct = async (productData) => {
  const docRef = await addDoc(collection(db, COLLECTION), {
    ...productData,
    createdAt: serverTimestamp(),
  });
  return docRef.id;
};

/**
 * Fetch all products.
 * @returns {Array} Array of product objects with their Firestore IDs
 */
export const getProducts = async () => {
  try {
    const q = query(collection(db, COLLECTION), orderBy('name', 'asc'));
    const snapshot = await getDocs(q);
    const results = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    console.log(`[Firestore] getProducts → ${results.length} products loaded`);
    return results;
  } catch (err) {
    console.error('[Firestore] getProducts failed:', err.code, err.message);
    throw err;
  }
};

/**
 * Fetch products filtered by category.
 * @param {string} category - e.g. 'indoor-branding', 'outdoor-branding'
 * @returns {Array}
 */
export const getProductsByCategory = async (category) => {
  const q = query(
    collection(db, COLLECTION),
    where('category', '==', category),
    orderBy('name', 'asc')
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

/**
 * Fetch a single product by ID.
 * @param {string} id - Firestore document ID
 */
export const getProductById = async (id) => {
  const snap = await getDoc(doc(db, COLLECTION, id));
  if (!snap.exists()) throw new Error('Product not found');
  return { id: snap.id, ...snap.data() };
};

/**
 * Update a product.
 * @param {string} id - Firestore document ID
 * @param {object} updates - Fields to update
 */
export const updateProduct = async (id, updates) => {
  await updateDoc(doc(db, COLLECTION, id), { ...updates, updatedAt: serverTimestamp() });
};

/**
 * Delete a product.
 * @param {string} id - Firestore document ID
 */
export const deleteProduct = async (id) => {
  await deleteDoc(doc(db, COLLECTION, id));
};
