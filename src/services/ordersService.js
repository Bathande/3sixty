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

const COLLECTION = 'orders';

/**
 * Save a new order after checkout.
 * @param {object} orderData - Cart items, customer info, totals
 * @returns {string} The new document ID
 */
export const addOrder = async (orderData) => {
  const docRef = await addDoc(collection(db, COLLECTION), {
    ...orderData,
    status: 'pending',       // pending | processing | shipped | delivered | cancelled
    createdAt: serverTimestamp(),
  });
  return docRef.id;
};

/**
 * Fetch all orders, newest first.
 * @returns {Array} Array of order objects with their Firestore IDs
 */
export const getOrders = async () => {
  const q = query(collection(db, COLLECTION), orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

/**
 * Fetch a single order by ID.
 * @param {string} id - Firestore document ID
 */
export const getOrderById = async (id) => {
  const snap = await getDoc(doc(db, COLLECTION, id));
  if (!snap.exists()) throw new Error('Order not found');
  return { id: snap.id, ...snap.data() };
};

/**
 * Update the status of an order.
 * @param {string} id - Firestore document ID
 * @param {string} status - 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
 */
export const updateOrderStatus = async (id, status) => {
  await updateDoc(doc(db, COLLECTION, id), { status, updatedAt: serverTimestamp() });
};
