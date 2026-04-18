import { db } from '../firebase';
import {
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore';

const COLLECTION = 'contacts';

/**
 * Save a contact form submission.
 * @param {object} formData - { name, email, phone, message }
 * @returns {string} The new document ID
 */
export const addContact = async (formData) => {
  const docRef = await addDoc(collection(db, COLLECTION), {
    ...formData,
    read: false,
    createdAt: serverTimestamp(),
  });
  return docRef.id;
};

/**
 * Fetch all contact submissions, newest first.
 * @returns {Array}
 */
export const getContacts = async () => {
  const q = query(collection(db, COLLECTION), orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};
