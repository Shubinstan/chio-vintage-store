// src/store/authStore.ts
import { create } from 'zustand';
import type { User } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../services/firebase';

// This interface defines the extra data we'll store for a user
interface UserData {
  hasMadeFirstPurchase?: boolean;
}

interface AuthState {
  user: User | null;
  userData: UserData | null; // New state for user's custom data
  isLoading: boolean;
  setUser: (user: User | null) => void;
  fetchUserData: (uid: string) => Promise<void>; // New action to get user data
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  userData: null,
  isLoading: true,
  setUser: (user) => set({ user }),
  setLoading: (loading) => set({ isLoading: loading }),

  // Fetches custom user data (like purchase history) from Firestore
  fetchUserData: async (uid: string) => {
    const userDocRef = doc(db, 'users', uid);
    const docSnap = await getDoc(userDocRef);
    if (docSnap.exists()) {
      set({ userData: docSnap.data() as UserData });
    } else {
      set({ userData: {} }); // User exists but has no custom data yet
    }
  },
}));