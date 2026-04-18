import { db } from '../firebase';
import {
  collection,
  addDoc,
  getDocs,
  getDoc,
  doc,
  query,
  orderBy,
  updateDoc,
  serverTimestamp,
} from 'firebase/firestore';

const COLLECTION = 'quotes';

/**
 * Save a new quote request.
 * @param {object} formData - Fields from the quote form
 * @returns {string} The new document ID
 */
export const addQuote = async (formData) => {
  const docRef = await addDoc(collection(db, COLLECTION), {
    ...formData,
    status: 'pending',       // pending | reviewed | completed
    createdAt: serverTimestamp(),
  });
  return docRef.id;
};

/**
 * Fetch all quotes, newest first.
 * @returns {Array} Array of quote objects with their Firestore IDs
 */
export const getQuotes = async () => {
  const q = query(collection(db, COLLECTION), orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

/**
 * Fetch a single quote by ID.
 * @param {string} id - Firestore document ID
 */
export const getQuoteById = async (id) => {
  const snap = await getDoc(doc(db, COLLECTION, id));
  if (!snap.exists()) throw new Error('Quote not found');
  return { id: snap.id, ...snap.data() };
};

/**
 * Update the status of a quote.
 * @param {string} id - Firestore document ID
 * @param {string} status - 'pending' | 'reviewed' | 'completed'
 */
export const updateQuoteStatus = async (id, status) => {
  await updateDoc(doc(db, COLLECTION, id), { status, updatedAt: serverTimestamp() });
};
