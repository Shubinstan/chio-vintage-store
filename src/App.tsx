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
import { GlobalStyles } from './styles/GlobalStyles'; // Ensure GlobalStyles is imported

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
  // State for managing the light/dark theme ('light' or 'dark')
  const [theme, setTheme] = useState('light');
  // State to control the visibility of the sign-up offer modal
  const [isOfferModalOpen, setOfferModalOpen] = useState(false);
  
  // Get state and actions from the global authentication store
  const { user, isLoading, setUser, setLoading, fetchUserData } = useAuthStore();
  // Get state and actions from the global cart store
  const { syncCartWithFirestore, items: cartItems, _hasHydrated } = useCartStore();

  // Effect 1: Handles authentication state changes and initial cart sync.
  // Runs once on mount and whenever the relevant store functions/state change.
  useEffect(() => {
    // onAuthStateChanged listens for login/logout events from Firebase Auth
    const unsubscribe = onAuthStateChanged(auth, async (currentUser: User | null) => {
      setUser(currentUser); // Update the global user state
      if (currentUser) {
        // If a user logs in, fetch their custom data (e.g., purchase history)
        await fetchUserData(currentUser.uid);
      }
      
      // Only attempt to sync the cart after it has been loaded from localStorage (_hasHydrated is true)
      if (_hasHydrated) { 
        if (currentUser) {
          // If a user is logged in, merge their local cart (from guest session) with their Firestore cart
          await syncCartWithFirestore(currentUser);
        }
        // If currentUser is null (user logged out), we don't clear the cart here.
        // It persists in localStorage for the guest session.
      }
      setLoading(false); // Mark authentication check as complete
    });

    // Cleanup function: Unsubscribe from the listener when the App component unmounts
    return () => unsubscribe();
  }, [setUser, setLoading, fetchUserData, syncCartWithFirestore, _hasHydrated]); // Dependencies array

  // Effect 2: Persists cart changes to Firestore for logged-in users.
  // Runs whenever the cart items (`cartItems`), user status, or hydration status change.
  useEffect(() => {
    // Only save to Firestore if the user is logged in and the cart has loaded from localStorage
    if (user && _hasHydrated) {
      const cartRef = doc(db, 'users', user.uid);
      // Save the entire cart `items` array under the 'cart' field in the user's document.
      // { merge: true } prevents overwriting other potential user data.
      setDoc(cartRef, { cart: cartItems }, { merge: true });
    }
  }, [cartItems, user, _hasHydrated]); // Dependencies array

  // Effect 3: Shows the sign-up offer modal to guest users after a delay.
  // Runs when authentication state or loading status changes.
  useEffect(() => {
    // Don't show the modal if authentication is still loading or if the user is logged in
    if (isLoading || user) return;
    
    // Check if the user already dismissed the modal during this browser session
    const offerDismissed = sessionStorage.getItem('signupOfferDismissed');
    if (offerDismissed) return;

    // Set a timer to open the modal after 15 seconds
    const timer = setTimeout(() => { setOfferModalOpen(true); }, 15000); // 15 seconds

    // Cleanup function: Clear the timer if the component unmounts or if user/loading state changes before 15s
    return () => clearTimeout(timer);
  }, [user, isLoading]); // Dependencies array

  // Function passed to the modal to handle closing it
  const handleCloseModal = () => {
    setOfferModalOpen(false);
    // Use sessionStorage to remember dismissal only for the current browser session
    sessionStorage.setItem('signupOfferDismissed', 'true');
  };

  // Function to toggle between 'light' and 'dark' themes
  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };
  
  // Select the appropriate theme object based on the current state
  const currentTheme = theme === 'light' ? lightTheme : darkTheme;

  return (
    // ThemeProvider makes the 'theme' object available to all styled-components below it
    <ThemeProvider theme={currentTheme}> 
      {/* GlobalStyles must be INSIDE ThemeProvider to access the theme */}
      <GlobalStyles /> 
      
      {/* Toaster provides the context for showing toast notifications */}
      <Toaster 
        position="bottom-center"
        toastOptions={{ style: { background: '#333', color: '#fff' } }}
      />
      
      {/* Conditionally render the sign-up modal */}
      {isOfferModalOpen && <SignUpOfferModal onClose={handleCloseModal} />}
      
      {/* Render the site header */}
      <Header toggleTheme={toggleTheme} theme={theme} />

      {/* Main content area where pages will be rendered */}
      <MainContent>
        {/* React Router's component for defining application routes */}
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