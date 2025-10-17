// src/components/products/ProductCard.tsx

import { Link } from 'react-router-dom';
import styled from 'styled-components';
import type { Product } from '../../types/product';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  // console.log('Product Card получил:', product); // Можете оставить эту строку для проверки

  return (
    <CardLink to={`/product/${product.id}`}>
      <CardContainer>
        <ImageContainer>
          <ProductImage className="main-image" src={product.imageUrl} alt={product.name} />
          <ProductImage className="hover-image" src={product.hoverImageUrl} alt={product.name} />
        </ImageContainer>
        <InfoContainer>
          <ViewDetailsButton>View Details</ViewDetailsButton>
          <ProductName>{product.name}</ProductName>
          {/* Эта строка — ключевая. 
            Она берёт product.price (которое, как мы видим в консоли, равно 50)
            и форматирует его. Если здесь всё ещё 0.00, значит, что-то мешает
            этому коду правильно выполниться.
          */}
          <ProductPrice>${(product.price || 0).toFixed(2)}</ProductPrice>
        </InfoContainer>
      </CardContainer>
    </CardLink>
  );
};

// --- Styled Components ---

const CardLink = styled(Link)`
  text-decoration: none;
  color: inherit;
  display: block;
`;

const ViewDetailsButton = styled.button`
  padding: 10px 20px;
  background-color: ${({ theme }) => theme.accent};
  color: ${({ theme }) => theme.body};
  border: none;
  cursor: pointer;
  text-transform: uppercase;
  font-weight: bold;
  font-size: 0.9rem;
  margin-bottom: 1rem;
  opacity: 0;
  transform: translateY(10px);
  transition: opacity 0.3s ease-out, transform 0.3s ease-out;
`;

const CardContainer = styled.div`
  border: 1px solid ${({ theme }) => theme.text}20;
  background-color: ${({ theme }) => theme.cardBg};
  position: relative;
  overflow: hidden;
  transition: box-shadow 0.3s ease-in-out;

  &:hover {
    box-shadow: 0 4px 15px ${({ theme }) => theme.text}15;
    ${ViewDetailsButton} {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const ImageContainer = styled.div`
  position: relative;
  cursor: pointer;
  height: 400px;

  &:hover .hover-image {
    opacity: 1;
  }
  &:hover .main-image {
    opacity: 0;
  }
`;

const ProductImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: opacity 0.4s ease-in-out;
  position: absolute;
  top: 0;
  left: 0;
  
  &.hover-image {
    opacity: 0;
  }
  &.main-image {
    opacity: 1;
  }
`;

const InfoContainer = styled.div`
  padding: 1.5rem;
  text-align: center;
`;

const ProductName = styled.h3`
  font-size: 1.1rem;
  margin: 0 0 0.5rem 0;
  color: ${({ theme }) => theme.text};
  font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const ProductPrice = styled.p`
  font-size: 1rem;
  font-weight: bold;
  color: ${({ theme }) => theme.accent};
  margin: 0;
`;

export default ProductCard;