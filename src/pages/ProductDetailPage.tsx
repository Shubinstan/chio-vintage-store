// src/pages/ProductDetailPage.tsx

import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import { useCartStore } from '../store/cartStore';
import { db } from '../services/firebase';
import { doc, getDoc } from 'firebase/firestore';
import type { Product } from '../types/product';
import toast from 'react-hot-toast';

const ProductDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const addItemToCart = useCartStore(state => state.addItem);

  useEffect(() => {
    if (!id) {
      setError('Product ID is missing.');
      setIsLoading(false);
      return;
    }

    const fetchProduct = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const productDocRef = doc(db, 'products', id);
        const docSnap = await getDoc(productDocRef);

        if (docSnap.exists()) {
          setProduct({ id: docSnap.id, ...docSnap.data() } as Product);
        } else {
          setError('Product not found.');
        }
      } catch (err) {
        console.error("Error fetching product:", err);
        setError('Failed to load product details.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (product) {
      addItemToCart(product);
      toast.success(`${product.name} has been added to your cart!`);
    }
  };

  if (isLoading) {
    return <StatusMessage>Loading details...</StatusMessage>;
  }

  // THE FIX IS HERE: The closing tag now correctly matches the opening tag.
  if (error) {
    return <StatusMessage>{error}</StatusMessage>;
  }

  if (!product) {
    return <StatusMessage>Product not found.</StatusMessage>;
  }

  return (
    <DetailPageContainer>
      <ImageColumn>
        <ProductImage src={product.imageUrl} alt={product.name} />
      </ImageColumn>
      <InfoColumn>
        <ProductName>{product.name}</ProductName>
        <ProductPrice>${(product.price || 0).toFixed(2)}</ProductPrice>
        <InfoBlock>
          <strong>Category:</strong> {product.category}
        </InfoBlock>
        <InfoBlock>
          <strong>Condition:</strong> {product.condition}
        </InfoBlock>
        {product.description && <Description>{product.description}</Description>}
        <AddToCartButton onClick={handleAddToCart}>Add to Cart</AddToCartButton>
      </InfoColumn>
    </DetailPageContainer>
  );
};

// --- Styled Components ---

const DetailPageContainer = styled.div`
  display: flex;
  gap: 3rem;
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;

  /* On tablets and phones, stack the columns */
  @media (max-width: 768px) {
    flex-direction: column;
    padding: 1rem 0;
    gap: 2rem;
  }
`;

const ImageColumn = styled.div`
  flex: 1;
  min-width: 300px;
`;

const InfoColumn = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const ProductImage = styled.img`
  width: 100%;
  height: auto;
  max-height: 80vh;
  object-fit: cover;
  border: 1px solid ${({ theme }) => theme.text}20;
`;

const ProductName = styled.h1`
  font-family: 'Georgia', serif;
  font-size: 2.5rem;
  font-weight: normal;
  margin: 0 0 1rem 0;

  @media (max-width: 768px) {
    font-size: 2rem; /* Reduce font size on mobile */
  }
`;

const ProductPrice = styled.p`
  font-size: 2rem;
  color: ${({ theme }) => theme.accent};
  font-weight: bold;
  margin: 0 0 1.5rem 0;
`;

const InfoBlock = styled.p`
  font-size: 1rem;
  margin: 0.5rem 0;
  text-transform: capitalize;
`;

const Description = styled.p`
  margin-top: 1.5rem;
  line-height: 1.6;
  color: ${({ theme }) => theme.text}99;
`;

const AddToCartButton = styled.button`
  padding: 1rem 2rem;
  margin-top: auto;
  font-size: 1rem;
  font-weight: bold;
  color: ${({ theme }) => theme.body};
  background-color: ${({ theme }) => theme.accent};
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: opacity 0.2s;
  text-transform: uppercase;

  &:hover {
    opacity: 0.85;
  }
`;

const StatusMessage = styled.p`
  text-align: center;
  font-size: 1.2rem;
  padding: 4rem;
`;

export default ProductDetailPage;