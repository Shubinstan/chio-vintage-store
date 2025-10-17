// src/pages/CatalogPage.tsx

import { useState, useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import styled from 'styled-components';
import ProductCard from '../components/products/ProductCard';
import FilterControls from '../components/common/FilterControls';
import type { Product } from '../types/product';
import { db } from '../services/firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';

// Helper function to parse query parameters from the URL
function useQuery() {
  return new URLSearchParams(useLocation().search);
}

// Helper function to capitalize the first letter of a string
const capitalizeFirstLetter = (string: string | null) => {
  if (!string) return '';
  return string.charAt(0).toUpperCase() + string.slice(1);
};

const CatalogPage = () => {
  // This state holds ALL products fetched from Firebase for the current category
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // These states manage the user's input in the filter controls
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('default');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });

  const queryParams = useQuery();
  const categoryFilter = queryParams.get('category');

  // This effect fetches products from Firebase ONLY when the category changes
  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const productsCollectionRef = collection(db, 'products');
        let productsQuery;
        
        if (categoryFilter && categoryFilter.toLowerCase() !== 'all') {
          const formattedCategory = capitalizeFirstLetter(categoryFilter);
          productsQuery = query(productsCollectionRef, where("category", "==", formattedCategory));
        } else {
          productsQuery = query(productsCollectionRef);
        }

        const querySnapshot = await getDocs(productsQuery);
        const productsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
        setAllProducts(productsData);
      } catch (err) {
        console.error("Firebase fetch error:", err);
        setError("Failed to load vintage treasures.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, [categoryFilter]);

  // This hook applies filtering and sorting on the client-side
  const filteredAndSortedProducts = useMemo(() => {
    return allProducts
      .filter(product => {
        // Search term filter (case-insensitive)
        const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
        
        // Price range filter
        const minPrice = parseFloat(priceRange.min) || 0;
        const maxPrice = parseFloat(priceRange.max) || Infinity;
        const isInPriceRange = product.price >= minPrice && product.price <= maxPrice;

        return matchesSearch && isInPriceRange;
      })
      .sort((a, b) => {
        // Sorting logic
        switch (sortOrder) {
          case 'price-asc': return a.price - b.price;
          case 'price-desc': return b.price - a.price;
          case 'name-asc': return a.name.localeCompare(b.name);
          case 'name-desc': return b.name.localeCompare(a.name);
          default: return 0;
        }
      });
  }, [allProducts, searchTerm, sortOrder, priceRange]);

  // Handler for price input changes
  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPriceRange(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  if (isLoading) {
    return <StatusMessage>Loading vintage treasures...</StatusMessage>;
  }

  if (error) {
    return <StatusMessage>{error}</StatusMessage>;
  }

  return (
    <div>
      <PageTitle>{capitalizeFirstLetter(categoryFilter) || 'All Products'}</PageTitle>
      
      <FilterControls
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        sortOrder={sortOrder}
        onSortChange={setSortOrder}
        priceRange={priceRange}
        onPriceChange={handlePriceChange}
      />
      
      {filteredAndSortedProducts.length === 0 ? (
        <StatusMessage>No products match your criteria.</StatusMessage>
      ) : (
        <ProductGrid>
          {filteredAndSortedProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </ProductGrid>
      )}
    </div>
  );
};

// --- Styled Components ---

const PageTitle = styled.h1`
  text-align: center;
  margin-bottom: 2rem;
  font-family: 'Georgia', serif;
  font-weight: normal;
  text-transform: capitalize;
`;

const ProductGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
  padding: 0 2rem;

  @media (max-width: 768px) {
    gap: 1rem;
    padding: 0;
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr; /* Switch to a single column on small phones */
    gap: 1.5rem;
  }
`;

const StatusMessage = styled.p`
  text-align: center;
  font-size: 1.2rem;
  padding: 4rem;
  font-family: 'Georgia', serif;
`;

export default CatalogPage;