import { db } from '../firebase';
import { auth } from '../firebase';
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
  serverTimestamp,
} from 'firebase/firestore';

const COLLECTION = 'orders';

export const addOrder = async (orderData) => {
  const docRef = await addDoc(collection(db, COLLECTION), {
    ...orderData,
    status: 'pending',
    createdAt: serverTimestamp(),
  });
  return docRef.id;
};

/**
 * Fetch orders belonging to the currently signed-in user only.
 * Throws if no user is authenticated.
 */
export const getMyOrders = async () => {
  const currentUser = auth.currentUser;
  if (!currentUser) throw new Error('Must be signed in to view orders.');
  const q = query(
    collection(db, COLLECTION),
    where('userId', '==', currentUser.uid),
    orderBy('createdAt', 'desc')
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

/**
 * Fetch a single order — only if it belongs to the current user.
 */
export const getOrderById = async (id) => {
  const currentUser = auth.currentUser;
  const snap = await getDoc(doc(db, COLLECTION, id));
  if (!snap.exists()) throw new Error('Order not found.');
  const data = snap.data();
  // Guests have no userId — allow access by orderId match only (no sensitive re-read)
  if (data.userId && (!currentUser || data.userId !== currentUser.uid)) {
    throw new Error('Access denied.');
  }
  return { id: snap.id, ...data };
};

export const updateOrderStatus = async (id, status) => {
  await updateDoc(doc(db, COLLECTION, id), { status, updatedAt: serverTimestamp() });
};
