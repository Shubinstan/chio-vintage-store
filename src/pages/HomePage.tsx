// src/pages/HomePage.tsx

import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { db } from '../services/firebase';
import { collection, getDocs, query, limit } from 'firebase/firestore';
import type { Product } from '../types/product';
import FeaturedProduct from '../components/products/FeaturedProduct';

const HomePage = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const productsQuery = query(collection(db, 'products'), limit(4));
        const querySnapshot = await getDocs(productsQuery);
        
        const productsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as Product));
        setFeaturedProducts(productsData);
      } catch (error) {
        console.error("Error fetching featured products:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, []);

  if (isLoading) {
    return <StatusMessage>Loading the collection...</StatusMessage>;
  }

  return (
    <HomePageContainer>
      <HeroSection>
        <HeroTitle>Welcome to Chio Vintage</HeroTitle>
        <HeroSubtitle>Discover unique treasures with a story to tell.</HeroSubtitle>
      </HeroSection>

      <FeaturedItemsGrid>
        {featuredProducts.map(product => (
          <FeaturedProduct key={product.id} product={product} />
        ))}
      </FeaturedItemsGrid>
    </HomePageContainer>
  );
};

// --- Styled Components ---

const HomePageContainer = styled.div``;

const HeroSection = styled.section`
  text-align: center;
  padding: 4rem 2rem;
  background-color: ${({ theme }) => theme.cardBg};
  margin-bottom: 2rem;

  @media (max-width: 768px) {
    padding: 3rem 1rem; /* Reduce padding on smaller screens */
  }
`;

const HeroTitle = styled.h1`
  font-family: 'Georgia', serif;
  font-size: 3rem;
  font-weight: normal;
  margin: 0;

  @media (max-width: 768px) {
    font-size: 2.2rem; /* Reduce font size on smaller screens */
  }
`;

const HeroSubtitle = styled.p`
  font-size: 1.2rem;
  color: ${({ theme }) => theme.text}99;
  margin-top: 1rem;
`;

const FeaturedItemsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr; 
  gap: 2rem; 
`;

const StatusMessage = styled.p`
  text-align: center;
  padding: 5rem;
  font-size: 1.2rem;
`;

export default HomePage;