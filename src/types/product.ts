// src/types/product.ts

export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  imageUrl: string;
  hoverImageUrl: string;
  condition: 'perfect' | 'good' | 'worn';
  description?: string; // <-- ДОБАВЬТЕ ЭТУ СТРОКУ
}