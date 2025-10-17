// src/App.tsx

import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import styled, { ThemeProvider } from 'styled-components';
import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from './services/firebase';
import { useAuthStore } from './store/authStore';
import { useCartStore } from './store/cartStore';
import { Toaster } from 'react-hot-toast';

// Import styles and themes
import { lightTheme, darkTheme } from './styles/theme';
import { GlobalStyles } from './styles/GlobalStyles';

// Import layout and common components
import Header from './components/layout/Header';
import SignUpOfferModal from './components/common/SignUpOfferModal';

// Import page components
import HomePage from './pages/HomePage';
import CatalogPage from './pages/CatalogPage';
import AboutPage from './pages/AboutPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderConfirmationPage from './pages/OrderConfirmationPage';

function App() {
  const [theme, setTheme] = useState('light');
  const [isOfferModalOpen, setOfferModalOpen] = useState(false);
  
  const { user, isLoading, setUser, setLoading, fetchUserData } = useAuthStore();
  const { syncCartWithFirestore, items: cartItems, _hasHydrated } = useCartStore();

  // Effect 1: Handles authentication state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser: User | null) => {
      setUser(currentUser);
      if (currentUser) {
        await fetchUserData(currentUser.uid);
      }
      if (_hasHydrated) { 
        if (currentUser) {
          await syncCartWithFirestore(currentUser);
        }
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [setUser, setLoading, fetchUserData, syncCartWithFirestore, _hasHydrated]);

  // Effect 2: Persists cart changes to Firestore for logged-in users
  useEffect(() => {
    if (user && _hasHydrated) {
      const cartRef = doc(db, 'users', user.uid);
      setDoc(cartRef, { cart: cartItems }, { merge: true });
    }
  }, [cartItems, user, _hasHydrated]);

  // Effect 3: Shows the sign-up offer modal to guest users
  useEffect(() => {
    if (isLoading || user) return;
    const offerDismissed = sessionStorage.getItem('signupOfferDismissed');
    if (offerDismissed) return;

    const timer = setTimeout(() => { setOfferModalOpen(true); }, 15000); // 15 seconds
    return () => clearTimeout(timer);
  }, [user, isLoading]);

  const handleCloseModal = () => {
    setOfferModalOpen(false);
    sessionStorage.setItem('signupOfferDismissed', 'true');
  };

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };
  
  const currentTheme = theme === 'light' ? lightTheme : darkTheme;

  return (
    <ThemeProvider theme={currentTheme}>
      <GlobalStyles />
      <Toaster 
        position="bottom-center"
        toastOptions={{ style: { background: '#333', color: '#fff' } }}
      />
      {isOfferModalOpen && <SignUpOfferModal onClose={handleCloseModal} />}
      <Header toggleTheme={toggleTheme} theme={theme} />

      <MainContent>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/catalog" element={<CatalogPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/product/:id" element={<ProductDetailPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/order-confirmation" element={<OrderConfirmationPage />} />
        </Routes>
      </MainContent>
    </ThemeProvider>
  );
}

// Styled component for the main content area to handle responsive padding
const MainContent = styled.main`
  padding: 2rem;
  @media (max-width: 768px) {
    padding: 1rem; // Reduce padding on smaller screens
  }
`;

export default App;