// src/pages/CartPage.tsx

import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useCartStore } from '../store/cartStore';
import { useAuthStore } from '../store/authStore';
import type { CartItem } from '../store/cartStore';

const CartPage = () => {
  // --- Component logic (remains the same) ---
  const { items, removeItem, increaseQuantity, decreaseQuantity } = useCartStore();
  const { user, userData } = useAuthStore();
  const navigate = useNavigate();
  const subtotal = items.reduce((total, item) => total + item.price * item.quantity, 0);
  const isDiscountEligible = user && !userData?.hasMadeFirstPurchase;
  const discountAmount = isDiscountEligible ? subtotal * 0.10 : 0;
  const totalPrice = subtotal - discountAmount;

  if (items.length === 0) {
    return (
      <EmptyCartMessage>
        <h1>Your Cart is Empty</h1>
        <p>Looks like you haven't added any vintage treasures yet.</p>
      </EmptyCartMessage>
    );
  }

  return (
    <CartContainer>
      <PageTitle>Your Shopping Cart</PageTitle>

      <CartHeader>
        <HeaderBlock style={{ textAlign: 'left' }}>Product</HeaderBlock>
        <HeaderBlock>Quantity</HeaderBlock>
        <HeaderBlock>Total</HeaderBlock>
      </CartHeader>
      
      {items.map((item: CartItem) => (
        <CartItemRow key={item.id}>
          <ProductInfo>
            <ProductImage src={item.imageUrl} alt={item.name} />
            <ProductDetails>
              <ProductName>{item.name}</ProductName>
              <ProductPriceMobile>${item.price.toFixed(2)} each</ProductPriceMobile>
            </ProductDetails>
          </ProductInfo>
          
          <DesktopControls>
            <QuantityControl>
              <QuantityButton onClick={() => decreaseQuantity(item.id)}>−</QuantityButton>
              <span>{item.quantity}</span>
              <QuantityButton onClick={() => increaseQuantity(item.id)}>+</QuantityButton>
            </QuantityControl>
            <ItemTotal>${(item.price * item.quantity).toFixed(2)}</ItemTotal>
          </DesktopControls>

          <RemoveButton onClick={() => removeItem(item.id)}>×</RemoveButton>
          
          <MobileControls>
             <ItemTotal>${(item.price * item.quantity).toFixed(2)}</ItemTotal>
             <QuantityControl>
              <QuantityButton onClick={() => decreaseQuantity(item.id)}>−</QuantityButton>
              <span>{item.quantity}</span>
              <QuantityButton onClick={() => increaseQuantity(item.id)}>+</QuantityButton>
            </QuantityControl>
          </MobileControls>

        </CartItemRow>
      ))}

      <CartFooter>
        <PriceDetails>
          <PriceLine>Subtotal: <span>${subtotal.toFixed(2)}</span></PriceLine>
          {isDiscountEligible && (
            <DiscountLine>
              First Purchase Discount (10%): <span>-${discountAmount.toFixed(2)}</span>
            </DiscountLine>
          )}
          <Total>Total: <span>${totalPrice.toFixed(2)}</span></Total>
        </PriceDetails>
        <CheckoutButton onClick={() => navigate('/checkout')}>
          Proceed to Checkout
        </CheckoutButton>
      </CartFooter>
    </CartContainer>
  );
};

// --- Styled Components ---

const CartContainer = styled.div`
  max-width: 1000px;
  margin: 2rem auto;
  padding: 2rem;
  background-color: ${({ theme }) => theme.cardBg};
  @media (max-width: 768px) {
    padding: 1rem;
    margin: 1rem auto;
    background-color: transparent;
  }
`;

const PageTitle = styled.h1`
  font-family: 'Georgia', serif;
  text-align: center;
  margin-bottom: 2rem;
  font-weight: normal;
`;

const CartHeader = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  padding-bottom: 1rem;
  margin: 0 1rem 1rem 1rem;
  border-bottom: 2px solid ${({ theme }) => theme.text}30;
  text-transform: uppercase;
  font-weight: bold;
  font-size: 0.9rem;
  @media (max-width: 768px) {
    display: none;
  }
`;

const HeaderBlock = styled.div`
  text-align: center;
`;

const CartItemRow = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;
  padding: 1.5rem 1rem;
  border-bottom: 1px solid ${({ theme }) => theme.text}20;
  
  @media (max-width: 768px) {
    background-color: ${({ theme }) => theme.cardBg};
    border-radius: 8px;
    margin-bottom: 1rem;
    border-bottom: none;
    position: relative;
    padding: 1rem;
    flex-wrap: wrap; /* Allow wrapping */
  }
`;

const ProductInfo = styled.div`
  flex: 1 1 200px; /* Grow, shrink, and have a base width */
  display: flex;
  align-items: center;
  gap: 1rem;
  min-width: 0;
`;

const ProductImage = styled.img`
  width: 90px;
  height: 90px;
  object-fit: cover;
  border-radius: 4px;
  flex-shrink: 0;
`;

const ProductDetails = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 0;
`;

const ProductName = styled.p`
  font-weight: bold;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const ProductPriceMobile = styled.p`
  display: none;
  font-size: 0.9rem;
  color: ${({ theme }) => theme.text}80;
  margin: 0.25rem 0 0 0;
  @media (max-width: 768px) {
    display: block;
  }
`;

const DesktopControls = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.5rem;
  flex: 1;

  @media (max-width: 768px) {
    display: none;
  }
`;

const MobileControls = styled.div`
  display: none;
  width: 100%;
  justify-content: space-between;
  align-items: center;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid ${({ theme }) => theme.text}20;

  @media (max-width: 768px) {
    display: flex;
  }
`;

const QuantityControl = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.75rem;
`;

const QuantityButton = styled.button`
  background: ${({ theme }) => theme.body};
  border: 1px solid ${({ theme }) => theme.text}30;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  cursor: pointer;
  font-size: 1.1rem;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
  &:hover { background: ${({ theme }) => theme.text}20; }
`;

const ItemTotal = styled.div`
  text-align: center;
  font-weight: bold;
  font-size: 1.1rem;
  min-width: 80px;
`;

const RemoveButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.accent};
  font-size: 1.8rem;
  cursor: pointer;
  padding: 0 0.5rem;
  margin-left: auto; /* Push to the far right on desktop */

  @media (max-width: 768px) {
    position: absolute;
    top: 5px;
    right: 5px;
    margin-left: 0;
  }
`;

// ... (CartFooter and other components remain the same)
const CartFooter = styled.div` margin-top: 2rem; display: flex; justify-content: space-between; align-items: flex-end; @media (max-width: 768px) { flex-direction: column; align-items: stretch; gap: 1.5rem; margin-top: 1rem; }`;
const PriceDetails = styled.div` @media (max-width: 768px) { width: 100%; padding: 1.5rem; background-color: ${({ theme }) => theme.cardBg}; border-radius: 4px; }`;
const PriceLine = styled.p` display: flex; justify-content: space-between; margin: 0.5rem 0; font-size: 1.1rem; `;
const DiscountLine = styled(PriceLine)` color: #27ae60; font-weight: bold; `;
const Total = styled.h2` display: flex; justify-content: space-between; font-family: 'Georgia', serif; font-size: 1.5rem; margin-top: 1rem; border-top: 1px solid ${({ theme }) => theme.text}30; padding-top: 1rem; `;
const CheckoutButton = styled.button` padding: 1rem 2rem; font-size: 1rem; font-weight: bold; color: ${({ theme }) => theme.body}; background-color: ${({ theme }) => theme.accent}; border: none; border-radius: 4px; cursor: pointer; &:hover { opacity: 0.85; }`;
const EmptyCartMessage = styled.div` text-align: center; padding: 5rem; h1 { font-family: 'Georgia', serif; }`;


export default CartPage;