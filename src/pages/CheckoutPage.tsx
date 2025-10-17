// src/pages/CheckoutPage.tsx

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useCartStore } from '../store/cartStore';
import { useAuthStore } from '../store/authStore';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import { collection, addDoc, serverTimestamp, doc, setDoc } from 'firebase/firestore';
import { db } from '../services/firebase';

const CheckoutPage = () => {
  // --- Component logic (remains the same) ---
  const { items, clearCart } = useCartStore();
  const { user, userData } = useAuthStore();
  const navigate = useNavigate();

  const [shippingInfo, setShippingInfo] = useState({ name: '', email: '', address: '', city: '', postalCode: '' });
  const [paymentMethod, setPaymentMethod] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user && user.email) {
      setShippingInfo(prev => ({ ...prev, email: user.email! }));
    }
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setShippingInfo(prevState => ({ ...prevState, [name]: value }));
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!paymentMethod) {
      setError('Please select a payment method.');
      return;
    }
    
    setIsLoading(true);
    setError('');

    const subtotal = items.reduce((total, item) => total + item.price * item.quantity, 0);
    const isDiscountEligible = user && !userData?.hasMadeFirstPurchase;
    const discountAmount = isDiscountEligible ? subtotal * 0.10 : 0;
    const totalPrice = subtotal - discountAmount;

    const order = {
      userId: user ? user.uid : null,
      customerEmail: shippingInfo.email,
      items,
      totalPrice,
      shippingInfo,
      paymentMethod,
      status: 'pending',
      createdAt: serverTimestamp(),
    };

    try {
      await addDoc(collection(db, 'orders'), order);
      if (user && isDiscountEligible) {
        const userDocRef = doc(db, 'users', user.uid);
        await setDoc(userDocRef, { hasMadeFirstPurchase: true }, { merge: true });
      }
      clearCart();
      navigate('/order-confirmation');
    } catch (err) {
      console.error("Order placement error:", err);
      setError('Failed to place order. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <CheckoutContainer>
      <h1>Checkout</h1>
      <form onSubmit={handlePlaceOrder}>
        <SectionTitle>Contact & Shipping</SectionTitle>
        <Input name="email" type="email" placeholder="Email Address" value={shippingInfo.email} onChange={handleInputChange} required disabled={!!user} />
        <Input name="name" placeholder="Full Name" onChange={handleInputChange} required />
        <Input name="address" placeholder="Street Address" onChange={handleInputChange} required />
        <Input name="city" placeholder="City" onChange={handleInputChange} required />
        <Input name="postalCode" placeholder="Postal Code" onChange={handleInputChange} required />

        <SectionTitle>Payment Method (Simulation)</SectionTitle>
        <PaymentOptions>
          {/* THE FIX IS HERE: Using '$active' transient prop */}
          <PaymentButton type="button" $active={paymentMethod === 'visa'} onClick={() => setPaymentMethod('visa')}>Visa</PaymentButton>
          <PaymentButton type="button" $active={paymentMethod === 'mastercard'} onClick={() => setPaymentMethod('mastercard')}>MasterCard</PaymentButton>
          <PaymentButton type="button" $active={paymentMethod === 'paypal'} onClick={() => setPaymentMethod('paypal')}>PayPal</PaymentButton>
        </PaymentOptions>

        {error && <ErrorMessage>{error}</ErrorMessage>}
        <Button type="submit" disabled={isLoading || items.length === 0}>
          {isLoading ? 'Placing Order...' : 'Place Order'}
        </Button>
      </form>
    </CheckoutContainer>
  );
};

// --- Styled Components ---
const CheckoutContainer = styled.div`
  max-width: 600px;
  margin: 2rem auto;
  padding: 2rem;
  background: ${({ theme }) => theme.cardBg};
  border: 1px solid ${({ theme }) => theme.text}20;
  border-radius: 8px;
  @media (max-width: 480px) {
    padding: 1.5rem;
    margin: 1rem auto;
  }
`;

const SectionTitle = styled.h2`
  font-family: 'Georgia', serif;
  margin-top: 2rem;
  margin-bottom: 1rem;
  border-bottom: 1px solid ${({ theme }) => theme.text}30;
  padding-bottom: 0.5rem;
`;

const PaymentOptions = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;

  /* THE FIX IS HERE: Stack buttons vertically on small screens */
  @media (max-width: 480px) {
    flex-direction: column;
  }
`;

const PaymentButton = styled.button<{ $active?: boolean }>`
  flex: 1;
  padding: 1rem;
  border: 1px solid ${({ theme, $active }) => ($active ? theme.accent : theme.text + '80')};
  background: ${({ theme, $active }) => ($active ? theme.accent : 'transparent')};
  color: ${({ theme, $active }) => ($active ? theme.body : theme.text)};
  cursor: pointer;
  font-size: 1rem;
  border-radius: 4px;
  transition: all 0.2s;

  &:hover {
    opacity: 0.8;
  }
`;

const ErrorMessage = styled.p`
  color: red;
  text-align: center;
  margin-bottom: 1rem;
`;

export default CheckoutPage;