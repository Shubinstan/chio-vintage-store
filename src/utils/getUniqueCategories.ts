// src/utils/getUniqueCategories.ts
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../services/firebase';

export const getUniqueCategories = async (): Promise<string[]> => {
  const productsCollectionRef = collection(db, 'products');
  const querySnapshot = await getDocs(productsCollectionRef);
  
  const categories = new Set<string>();
  querySnapshot.forEach((doc) => {
    const data = doc.data();
    if (data.category) {
      categories.add(data.category);
    }
  });
  
  return Array.from(categories);
};