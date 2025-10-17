// src/store/cartStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import toast from 'react-hot-toast'; // Import toast
import type { Product } from '../types/product';
import type { User } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../services/firebase';

export interface CartItem extends Product {
  quantity: number;
}

interface CartState {
  items: CartItem[];
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  increaseQuantity: (productId: string) => void;
  decreaseQuantity: (productId: string) => void;
  clearCart: () => void;
  _hasHydrated: boolean;
  setHasHydrated: (state: boolean) => void;
  syncCartWithFirestore: (user: User | null) => void;
}

const MAX_ITEM_QUANTITY = 10; // The maximum quantity for a single item

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      _hasHydrated: false,
      setHasHydrated: (state) => set({ _hasHydrated: state }),

      addItem: (product) => {
        const { items } = get();
        const existingItem = items.find(item => item.id === product.id);

        if (existingItem) {
          if (existingItem.quantity < MAX_ITEM_QUANTITY) {
            const updatedItems = items.map(item =>
              item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
            );
            set({ items: updatedItems });
          } else {
            // Replace alert with an error toast
            toast.error(`You can only add up to ${MAX_ITEM_QUANTITY} units.`);
          }
        } else {
          set({ items: [...items, { ...product, quantity: 1 }] });
        }
      },

      removeItem: (productId) => {
        set({ items: get().items.filter(item => item.id !== productId) });
      },

      increaseQuantity: (productId) => {
        const { items } = get();
        const updatedItems = items.map(item => {
          if (item.id === productId && item.quantity < MAX_ITEM_QUANTITY) {
            return { ...item, quantity: item.quantity + 1 };
          }
          if (item.id === productId && item.quantity >= MAX_ITEM_QUANTITY) {
            // Replace alert here too
            toast.error(`You can only have up to ${MAX_ITEM_QUANTITY} units.`);
          }
          return item;
        });
        set({ items: updatedItems });
      },

      decreaseQuantity: (productId) => {
        const { items } = get();
        const updatedItems = items
          .map(item => 
            item.id === productId ? { ...item, quantity: item.quantity - 1 } : item
          )
          .filter(item => item.quantity > 0);
        set({ items: updatedItems });
      },

      clearCart: () => set({ items: [] }),

      syncCartWithFirestore: async (user) => {
        if (!user) return;

        const localCart = get().items;
        const cartRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(cartRef);
        let firestoreCart: CartItem[] = [];

        if (docSnap.exists() && docSnap.data().cart) {
          firestoreCart = docSnap.data().cart;
        }
        
        const mergedCart = [...firestoreCart];
        localCart.forEach(localItem => {
          const existingItem = mergedCart.find(item => item.id === localItem.id);
          if (existingItem) {
            const newQuantity = existingItem.quantity + localItem.quantity;
            existingItem.quantity = Math.min(newQuantity, MAX_ITEM_QUANTITY);
          } else {
            mergedCart.push(localItem);
          }
        });
        
        set({ items: mergedCart });
        await setDoc(cartRef, { cart: mergedCart }, { merge: true });
      },
    }),
    {
      name: 'chio-vintage-cart',
      onRehydrateStorage: () => (state) => {
        if (state) state.setHasHydrated(true);
      },
    }
  )
);