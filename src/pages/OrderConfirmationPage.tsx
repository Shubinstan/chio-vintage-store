// src/pages/OrderConfirmationPage.tsx

import styled from 'styled-components';
import { Link } from 'react-router-dom';

const OrderConfirmationPage = () => {
  return (
    <ConfirmationContainer>
      <h1>Thank You for Your Order!</h1>
      <p>Your vintage treasures are on their way. A confirmation email has been sent to you shortly.</p>
      <StyledLink to="/catalog">Continue Shopping</StyledLink>
    </ConfirmationContainer>
  );
};

// --- Styled Components ---

const ConfirmationContainer = styled.div`
  text-align: center;
  padding: 5rem 2rem;
  max-width: 600px;
  margin: 2rem auto;
  background-color: ${({ theme }) => theme.cardBg};
  border: 1px solid ${({ theme }) => theme.text}20;
  border-radius: 8px;

  h1 { 
    font-family: 'Georgia', serif; 
    margin-bottom: 1rem;
  }

  p {
    line-height: 1.6;
    font-size: 1.1rem;
  }
`;

const StyledLink = styled(Link)`
  display: inline-block;
  margin-top: 2rem;
  padding: 1rem 2rem;
  text-decoration: none;
  font-weight: bold;
  color: ${({ theme }) => theme.body};
  background-color: ${({ theme }) => theme.accent};
  border-radius: 4px;

  &:hover { 
    opacity: 0.85; 
  }
`;

export default OrderConfirmationPage;