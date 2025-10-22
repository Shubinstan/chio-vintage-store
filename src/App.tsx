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

// Import my themes and the GlobalStyles component
import { lightTheme, darkTheme } from './styles/theme';
import { GlobalStyles } from './styles/GlobalStyles';

// Import layout and common components
import Header from './components/layout/Header';
import SignUpOfferModal from './components/common/SignUpOfferModal';

// Import all my page components
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
  // State to manage the current theme mode ('light' or 'dark')
  const [themeMode, setThemeMode] = useState('light');
  // State for the sign-up offer modal visibility
  const [isOfferModalOpen, setOfferModalOpen] = useState(false);

  // Getting state and functions from my Zustand stores
  const { user, isLoading, setUser, setLoading, fetchUserData } = useAuthStore();
  const { syncCartWithFirestore, items: cartItems, _hasHydrated } = useCartStore();

  // Determine the current theme object based on the themeMode state
  const currentTheme = themeMode === 'light' ? lightTheme : darkTheme;

  // WORKAROUND IMPLEMENTATION:
  // This effect runs whenever the theme changes.
  // It applies the current theme's colors as CSS variables directly onto the <body> tag.
  // This way, GlobalStyles can use these variables without needing the theme object directly, fixing the TS error.
  useEffect(() => {
    const root = document.body; // Target the body element
    // Set the CSS variables based on the current theme object
    root.style.setProperty('--color-bg', currentTheme.body);
    root.style.setProperty('--color-text', currentTheme.text);
    // Also setting variables for accent and card background for potential use elsewhere
    root.style.setProperty('--color-accent-val', currentTheme.accent);
    root.style.setProperty('--color-card-bg-val', currentTheme.cardBg);
  }, [currentTheme]); // Re-run this effect only when currentTheme changes

  // Effect 1: Handle user authentication state changes (login/logout)
  useEffect(() => {
    // Listen to Firebase Auth state changes
    const unsubscribe = onAuthStateChanged(auth, async (currentUser: User | null) => {
      setUser(currentUser); // Update user in global store
      if (currentUser) {
        await fetchUserData(currentUser.uid); // Fetch additional user data if logged in
      }
      // Sync cart with Firestore after localStorage hydration and user state is known
      if (_hasHydrated && currentUser) {
        await syncCartWithFirestore(currentUser);
      }
      setLoading(false); // Mark auth check as complete
    });
    // Cleanup the listener on component unmount
    return () => unsubscribe();
  }, [setUser, setLoading, fetchUserData, syncCartWithFirestore, _hasHydrated]);

  // Effect 2: Save cart to Firestore whenever it changes for a logged-in user
  useEffect(() => {
    if (user && _hasHydrated) { // Only run if user is logged in and cart is ready
      const cartRef = doc(db, 'users', user.uid);
      setDoc(cartRef, { cart: cartItems }, { merge: true }); // Save cart data
    }
  }, [cartItems, user, _hasHydrated]); // Re-run if cart or user changes

  // Effect 3: Show the sign-up offer modal to guests after a delay
  useEffect(() => {
    if (isLoading || user) return; // Don't show if loading or logged in
    const offerDismissed = sessionStorage.getItem('signupOfferDismissed');
    if (offerDismissed) return; // Don't show if dismissed this session
    const timer = setTimeout(() => { setOfferModalOpen(true); }, 15000); // 15s delay
    return () => clearTimeout(timer); // Clear timer on unmount or state change
  }, [user, isLoading]);

  // Function to close the sign-up modal and remember dismissal for the session
  const handleCloseModal = () => {
    setOfferModalOpen(false);
    sessionStorage.setItem('signupOfferDismissed', 'true');
  };

  // Function to toggle the theme mode state
  const toggleTheme = () => {
    setThemeMode(themeMode === 'light' ? 'dark' : 'light');
  };

  return (
    // ThemeProvider is still needed for other components that might use useTheme() or theme prop directly
    <ThemeProvider theme={currentTheme}>
      {/* GlobalStyles now works correctly without causing the TS error */}
      <GlobalStyles />

      {/* Toaster component for displaying notifications */}
      <Toaster
        position="bottom-center"
        toastOptions={{ style: { background: '#333', color: '#fff' } }}
      />
      {/* Conditionally render the sign-up modal */}
      {isOfferModalOpen && <SignUpOfferModal onClose={handleCloseModal} />}

      {/* Pass the toggle function and current mode ('light'/'dark') to Header */}
      <Header toggleTheme={toggleTheme} theme={themeMode} />

      {/* Main content area where pages are rendered by React Router */}
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

// Styled component for the main content area with responsive padding
const MainContent = styled.main`
  padding: 2rem;
  @media (max-width: 768px) {
    padding: 1rem; // Less padding on smaller screens
  }
`;

export default App;