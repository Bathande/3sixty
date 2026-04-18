import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../firebase';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);       // Firebase Auth user
  const [profile, setProfile] = useState(null); // Firestore user profile
  const [authLoading, setAuthLoading] = useState(true);

  // Listen to auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        // Load profile from Firestore
        const snap = await getDoc(doc(db, 'users', firebaseUser.uid));
        if (snap.exists()) {
          setProfile(snap.data());
        }
      } else {
        setUser(null);
        setProfile(null);
      }
      setAuthLoading(false);
    });
    return unsubscribe;
  }, []);

  /**
   * Register a new user with email, password, name and phone.
   * Creates a Firestore profile document.
   */
  const register = async ({ email, password, firstName, lastName, phone }) => {
    const credential = await createUserWithEmailAndPassword(auth, email, password);
    const firebaseUser = credential.user;

    // Set display name on Auth profile
    await updateProfile(firebaseUser, {
      displayName: `${firstName} ${lastName}`,
    });

    // Save full profile to Firestore
    const profileData = {
      uid: firebaseUser.uid,
      email,
      firstName,
      lastName,
      displayName: `${firstName} ${lastName}`,
      phone,
      createdAt: serverTimestamp(),
    };
    await setDoc(doc(db, 'users', firebaseUser.uid), profileData);
    setProfile(profileData);
    return firebaseUser;
  };

  /**
   * Sign in with email and password.
   */
  const login = async ({ email, password }) => {
    const credential = await signInWithEmailAndPassword(auth, email, password);
    const snap = await getDoc(doc(db, 'users', credential.user.uid));
    if (snap.exists()) setProfile(snap.data());
    return credential.user;
  };

  /**
   * Sign out.
   */
  const logout = () => signOut(auth);

  /**
   * Update user profile in Firestore.
   */
  const updateUserProfile = async (updates) => {
    if (!user) return;
    const ref = doc(db, 'users', user.uid);
    await setDoc(ref, { ...profile, ...updates, updatedAt: serverTimestamp() }, { merge: true });
    setProfile((prev) => ({ ...prev, ...updates }));
  };

  return (
    <AuthContext.Provider value={{ user, profile, authLoading, register, login, logout, updateUserProfile }}>
      {authLoading ? (
        <div style={{
          minHeight: '100vh', display: 'flex', alignItems: 'center',
          justifyContent: 'center', background: '#f8f9fa', flexDirection: 'column', gap: 16
        }}>
          <div style={{
            width: 40, height: 40, border: '3px solid #f0f0f0',
            borderTopColor: '#C8102E', borderRadius: '50%',
            animation: 'spin 0.7s linear infinite'
          }} />
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          <span style={{ color: '#888', fontSize: 14 }}>Loading...</span>
        </div>
      ) : children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
