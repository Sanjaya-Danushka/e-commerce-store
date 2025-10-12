import React, { useState, useCallback, useEffect } from "react";
import axios from "axios";
import HomePage from "./Pages/HomePage";
import CategoriesPage from "./Pages/CategoriesPage";
import BrandsPage from "./Pages/BrandsPage";
import SalePage from "./Pages/SalePage";
import NewArrivalsPage from "./Pages/NewArrivalsPage";
import ProductsPage from "./Pages/ProductsPage";
import WishlistPage from "./Pages/WishlistPage";
import CheckoutPage from "./Pages/CheckutPage";
import OrdersPage from "./Pages/OrdersPage";
import TrackingPage from "./Pages/TrackingPage";
import AboutPage from "./Pages/AboutPage";
import ContactPage from "./Pages/ContactPage";
import TermsOfServicePage from "./Pages/TermsOfServicePage";
import PrivacyPage from "./Pages/PrivacyPage";
import AccessibilityPage from "./Pages/AccessibilityPage";
import CareersPage from "./Pages/CareersPage";
import PressPage from "./Pages/PressPage";
import BlogPage from "./Pages/BlogPage";
import AffiliateProgramPage from "./Pages/AffiliateProgramPage";
import WholesalePage from "./Pages/WholesalePage";
import ShippingInfoPage from "./Pages/ShippingInfoPage";
import ReturnsExchangesPage from "./Pages/ReturnsExchangesPage";
import SizeGuidePage from "./Pages/SizeGuidePage";
import TrackOrderPage from "./Pages/TrackOrderPage";
import GiftCardsPage from "./Pages/GiftCardsPage";
import AdminPage from "./Pages/AdminPage";
import AdminLoginPage from "./Pages/AdminLoginPage";
import LoginPage from "./Pages/LoginPage";
import SignupPage from "./Pages/SignupPage";
import ProfilePage from "./Pages/ProfilePage";
import ProfileCompletionModal from "./components/ProfileCompletionModal";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { Routes, Route } from "react-router-dom";

// AppContent component to handle profile completion modal and cart state management
const AppContent = ({ cart, wishlist, refreshCart, refreshWishlist, updateWishlist }) => {
  const { needsProfileCompletion, user, isAuthenticated } = useAuth();
  const [showProfileModal, setShowProfileModal] = useState(false);

  useEffect(() => {
    console.log('AppContent: Auth state check - user:', !!user, 'needsProfileCompletion:', needsProfileCompletion(), 'isAuthenticated:', isAuthenticated);

    // Show profile completion modal after 1 second delay for new users who need to complete their profile
    if (needsProfileCompletion() && user && !user.profileCompleted && isAuthenticated) {
      console.log('AppContent: Scheduling profile modal to appear in 1 second');
      const timer = setTimeout(() => {
        console.log('AppContent: Showing profile modal after delay');
        setShowProfileModal(true);
      }, 1000); // 1 second delay

      return () => clearTimeout(timer);
    }
  }, [needsProfileCompletion, user, isAuthenticated]);

  const handleProfileComplete = () => {
    console.log('AppContent: Profile completed, closing modal');
    setShowProfileModal(false);
    // Profile is now completed, user can continue using the site
  };

  return (
    <>
      <div className="App">
        <Routes>
          <Route path="/" element={<HomePage cart={cart} wishlist={wishlist} refreshCart={refreshCart} refreshWishlist={refreshWishlist} updateWishlist={updateWishlist} />} />
          <Route path="/categories" element={<CategoriesPage cart={cart} wishlist={wishlist} />} />
          <Route path="/brands" element={<BrandsPage cart={cart} wishlist={wishlist} />} />
          <Route path="/products" element={<ProductsPage cart={cart} wishlist={wishlist} refreshCart={refreshCart} refreshWishlist={refreshWishlist} updateWishlist={updateWishlist} />} />
          <Route path="/sale" element={<SalePage cart={cart} wishlist={wishlist} refreshCart={refreshCart} />} />
          <Route path="/new-arrivals" element={<NewArrivalsPage cart={cart} wishlist={wishlist} refreshCart={refreshCart} updateWishlist={updateWishlist} />} />
          <Route path="/wishlist" element={<WishlistPage cart={cart} wishlist={wishlist} refreshCart={refreshCart} updateWishlist={updateWishlist} />} />
          <Route path="/checkout" element={<CheckoutPage cart={cart} />} />
          <Route path="/orders" element={<OrdersPage cart={cart} wishlist={wishlist} refreshCart={refreshCart} />} />
          <Route path="/tracking" element={<TrackingPage cart={cart} />} />
          <Route path="/about" element={<AboutPage cart={cart} wishlist={wishlist} />} />
          <Route path="/contact" element={<ContactPage cart={cart} wishlist={wishlist} />} />
          <Route path="/terms-of-service" element={<TermsOfServicePage cart={cart} wishlist={wishlist} />} />
          <Route path="/privacy" element={<PrivacyPage cart={cart} wishlist={wishlist} />} />
          <Route path="/accessibility" element={<AccessibilityPage cart={cart} />} />
          <Route path="/careers" element={<CareersPage cart={cart} />} />
          <Route path="/press" element={<PressPage cart={cart} />} />
          <Route path="/blog" element={<BlogPage cart={cart} />} />
          <Route path="/affiliate-program" element={<AffiliateProgramPage cart={cart} />} />
          <Route path="/wholesale" element={<WholesalePage cart={cart} />} />
          <Route path="/shipping-info" element={<ShippingInfoPage cart={cart} />} />
          <Route path="/returns-exchanges" element={<ReturnsExchangesPage cart={cart} />} />
          <Route path="/size-guide" element={<SizeGuidePage cart={cart} />} />
          <Route path="/track-order" element={<TrackOrderPage cart={cart} />} />
          <Route path="/gift-cards" element={<GiftCardsPage cart={cart} />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route path="/admin" element={<AdminPage />} />
        </Routes>
      </div>

      {/* Profile Completion Modal - appears after 1 second delay */}
      <ProfileCompletionModal
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        onComplete={handleProfileComplete}
      />
    </>
  );
};

const App = () => {
  // Cart and Wishlist state management
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);

  // Fetch cart items from API (only for authenticated users)
  const fetchCart = useCallback(async () => {
    if (!localStorage.getItem('authToken')) {
      return; // Don't make API calls for guest users
    }

    try {
      const response = await axios.get('/api/cart-items?expand=product');
      setCart(response.data);
      console.log('Cart fetched:', response.data);
    } catch (error) {
      console.error('Error fetching cart:', error);
      setCart([]);
    }
  }, []);

  // Fetch wishlist items from API (only for authenticated users)
  const fetchWishlist = useCallback(async () => {
    if (!localStorage.getItem('authToken')) {
      return; // Don't make API calls for guest users
    }

    try {
      const response = await axios.get('/api/wishlist?expand=product');
      const wishlistItems = response.data.map(item => ({
        productId: item.productId,
        dateAdded: item.dateAdded,
        product: item.product
      }));
      setWishlist(wishlistItems);
      console.log('Wishlist fetched:', wishlistItems);
    } catch (error) {
      console.error('Error fetching wishlist:', error);
      setWishlist([]);
    }
  }, []);

  // Refresh cart after adding/removing items (only for authenticated users)
  const refreshCart = useCallback(() => {
    if (localStorage.getItem('authToken')) {
      console.log('Refreshing cart...');
      fetchCart();
    } else {
      console.log('Guest user - no cart to refresh');
    }
  }, [fetchCart]);

  // Refresh wishlist (only for authenticated users)
  const refreshWishlist = useCallback(() => {
    if (localStorage.getItem('authToken')) {
      console.log('Refreshing wishlist...');
      fetchWishlist();
    } else {
      console.log('Guest user - no wishlist to refresh');
    }
  }, [fetchWishlist]);

  // Update wishlist (handles both guest and authenticated users)
  const updateWishlist = useCallback((newWishlist) => {
    console.log('Updating wishlist:', newWishlist);

    if (localStorage.getItem('authToken')) {
      // For authenticated users, use API approach
      setWishlist(newWishlist);
    } else {
      // For guest users, save to localStorage and update state
      localStorage.setItem('guestWishlist', JSON.stringify(newWishlist));
      setWishlist(newWishlist);
    }
  }, []);

  // Handle user login - fetch user's cart and wishlist data and sync guest data
  const handleUserLogin = useCallback(async (userData) => {
    console.log('User logged in, fetching user data for:', userData.email);

    try {
      // First fetch user's existing data from API
      await Promise.all([fetchCart(), fetchWishlist()]);
    } catch (error) {
      console.error('Error during login data sync:', error);
    }
  }, [fetchCart, fetchWishlist]);

  // Handle user logout - clear user's cart and wishlist data
  const handleUserLogout = useCallback(() => {
    console.log('User logged out, clearing user data');
    setCart([]);
    setWishlist([]);
  }, []);

  // Load cart and wishlist on component mount - check both localStorage and API
  useEffect(() => {
    const loadUserData = async () => {
      if (localStorage.getItem('authToken')) {
        // Authenticated user - fetch from API
        try {
          await Promise.all([fetchCart(), fetchWishlist()]);
        } catch (error) {
          console.error('Error loading user data:', error);
        }
      } else {
        // Non-authenticated user - load from localStorage for wishlist only
        loadGuestData();
      }
    };

    const loadGuestData = () => {
      const guestWishlist = localStorage.getItem('guestWishlist');

      if (guestWishlist) {
        try {
          const wishlistData = JSON.parse(guestWishlist);
          console.log('Parsed guest wishlist:', wishlistData);
          setWishlist(wishlistData);
        } catch (error) {
          console.error('Error parsing guest wishlist:', error);
          setWishlist([]);
        }
      } else {
        console.log('No guest wishlist found');
        setWishlist([]);
      }
    };

    loadUserData();
  }, [fetchCart, fetchWishlist]);

  return (
    <AuthProvider onUserLogin={handleUserLogin} onUserLogout={handleUserLogout}>
      <AppContent
        cart={cart}
        wishlist={wishlist}
        refreshCart={refreshCart}
        refreshWishlist={refreshWishlist}
        updateWishlist={updateWishlist}
      />
    </AuthProvider>
  );
};

export default App;
