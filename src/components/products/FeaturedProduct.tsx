// src/components/products/FeaturedProduct.tsx

import { Link } from 'react-router-dom';
import styled from 'styled-components';
import type { Product } from '../../types/product';

// Define the component's props
interface FeaturedProductProps {
  product: Product;
}

const FeaturedProduct: React.FC<FeaturedProductProps> = ({ product }) => {
  return (
    <FeaturedLink to={`/product/${product.id}`}>
      <Container $image={product.imageUrl}>
        <Overlay>
          <ContentWrapper>
            <Title>{product.name}</Title>
            <ShopButton>Shop Now</ShopButton>
          </ContentWrapper>
        </Overlay>
      </Container>
    </FeaturedLink>
  );
};

// --- Styled Components ---

const FeaturedLink = styled(Link)`
  text-decoration: none;
  color: inherit;
  display: block;
`;

const Container = styled.div<{ $image: string }>`
  width: 100%;
  height: 80vh; /* Height for desktop screens */
  max-height: 700px;
  background-image: url(${({ $image }) => $image});
  background-size: cover;
  background-position: center;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  overflow: hidden;

  /* Media query for tablets and smaller devices */
  @media (max-width: 768px) {
    height: 60vh; /* Reduce height on mobile */
  }
`;

const Overlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.3);
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem;
  color: white;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: rgba(0, 0, 0, 0.45);
  }
`;

const ContentWrapper = styled.div`
  text-align: center;
  transition: transform 0.3s ease-out;

  ${Container}:hover & {
    transform: translateY(-20px);
  }
`;

const Title = styled.h2`
  font-family: 'Georgia', serif;
  font-size: 3rem; /* Font size for desktop */
  font-weight: normal;
  text-shadow: 2px 2px 6px rgba(0, 0, 0, 0.7);
  margin: 0;
  transition: font-size 0.3s ease;

  /* Media query for tablets */
  @media (max-width: 768px) {
    font-size: 2.2rem; /* Reduce font size */
  }

  /* Media query for small phones */
  @media (max-width: 480px) {
    font-size: 1.8rem; /* Make it even smaller */
  }
`;

const ShopButton = styled.button`
  margin-top: 1.5rem;
  padding: 0.8rem 2rem;
  background: white;
  color: black;
  border: none;
  font-size: 1rem;
  font-weight: bold;
  text-transform: uppercase;
  cursor: pointer;
`;

export default FeaturedProduct;