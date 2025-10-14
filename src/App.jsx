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
import AdminLoginPage from "./Pages/AdminLoginPage";
import AdminPage from "./Pages/AdminPage";
import NotFoundPage from "./Pages/NotFoundPage";
import LoginPage from "./Pages/LoginPage";
import SignupPage from "./Pages/SignupPage";
import ProfilePage from "./Pages/ProfilePage";
import ProfileCompletionModal from "./components/ProfileCompletionModal";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { Routes, Route } from "react-router-dom";
import { useMemo } from "react";
import { logger } from "./utils/logger";

// AppContent handles the main app layout and data management
const AppContent = ({ cart, wishlist, guestWishlist, refreshCart, refreshWishlist, updateWishlist }) => {
  const { needsProfileCompletion, user, isAuthenticated } = useAuth();

  // Get combined wishlist (user + guest) for display
  const combinedWishlist = useMemo(() => {
    if (isAuthenticated) {
      // User is logged in - combine user wishlist with guest wishlist
      const combined = [...wishlist, ...guestWishlist];
      // Remove duplicates based on productId
      const unique = combined.filter((item, index, self) =>
        index === self.findIndex(i => i.productId === item.productId)
      );
      logger.log('Combined wishlist:', {
        userItems: wishlist.length,
        guestItems: guestWishlist.length,
        totalUnique: unique.length,
        items: unique
      });
      return unique;
    } else {
      // Guest user - only show guest wishlist
      logger.log('Guest wishlist:', guestWishlist.length, 'items');
      return guestWishlist;
    }
  }, [wishlist, guestWishlist, isAuthenticated]);
  const [showProfileModal, setShowProfileModal] = useState(false);

  useEffect(() => {
    logger.log('AppContent: Auth state check - user:', !!user, 'needsProfileCompletion:', needsProfileCompletion(), 'isAuthenticated:', isAuthenticated);

    // Show profile completion modal after 1 second delay for new users who need to complete their profile
    if (needsProfileCompletion() && user && !user.profileCompleted && isAuthenticated) {
      logger.log('AppContent: Scheduling profile modal to appear in 1 second');
      const timer = setTimeout(() => {
        logger.log('AppContent: Showing profile modal after delay');
        setShowProfileModal(true);
      }, 1000); // 1 second delay

      return () => clearTimeout(timer);
    }
  }, [needsProfileCompletion, user, isAuthenticated]);

  const handleProfileComplete = () => {
    logger.log('AppContent: Profile completed, closing modal');
    setShowProfileModal(false);
    // Profile is now completed, user can continue using the site
  };

  return (
    <>
      <div className="App">
        <Routes>
          <Route path="/" element={<HomePage cart={cart} wishlist={combinedWishlist} refreshCart={refreshCart} refreshWishlist={refreshWishlist} updateWishlist={updateWishlist} />} />
          <Route path="/categories" element={<CategoriesPage cart={cart} wishlist={combinedWishlist} />} />
          <Route path="/brands" element={<BrandsPage cart={cart} wishlist={combinedWishlist} />} />
          <Route path="/products" element={<ProductsPage cart={cart} wishlist={combinedWishlist} refreshCart={refreshCart} refreshWishlist={refreshWishlist} updateWishlist={updateWishlist} />} />
          <Route path="/sale" element={<SalePage cart={cart} wishlist={combinedWishlist} refreshCart={refreshCart} updateWishlist={updateWishlist} />} />
          <Route path="/new-arrivals" element={<NewArrivalsPage cart={cart} wishlist={combinedWishlist} refreshCart={refreshCart} updateWishlist={updateWishlist} />} />
          <Route path="/wishlist" element={<WishlistPage cart={cart} wishlist={combinedWishlist} refreshCart={refreshCart} refreshWishlist={refreshWishlist} updateWishlist={updateWishlist} />} />
          <Route path="/checkout" element={<CheckoutPage cart={cart} />} />
          <Route path="/orders" element={<OrdersPage cart={cart} wishlist={combinedWishlist} refreshCart={refreshCart} />} />
          <Route path="/tracking" element={<TrackingPage cart={cart} />} />
          <Route path="/about" element={<AboutPage cart={cart} wishlist={combinedWishlist} />} />
          <Route path="/contact" element={<ContactPage cart={cart} wishlist={combinedWishlist} />} />
          <Route path="/terms-of-service" element={<TermsOfServicePage cart={cart} wishlist={combinedWishlist} />} />
          <Route path="/privacy" element={<PrivacyPage cart={cart} wishlist={combinedWishlist} />} />
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
          <Route path="*" element={<NotFoundPage cart={cart} wishlist={combinedWishlist} />} />
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
  const [guestWishlist, setGuestWishlist] = useState([]);

  // Fetch cart items from API (only for authenticated users)
  const fetchCart = useCallback(async () => {
    if (!localStorage.getItem('authToken')) {
      return; // Don't make API calls for guest users
    }

    try {
      const response = await axios.get('/api/cart-items?expand=product');
      setCart(response.data);
      logger.log('Cart fetched:', response.data);
    } catch (error) {
      logger.error('Error fetching cart:', error);
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
      logger.log('Wishlist fetched:', wishlistItems);
    } catch (error) {
      logger.error('Error fetching wishlist:', error);
      setWishlist([]);
    }
  }, []);

  // Refresh cart after adding/removing items (only for authenticated users)
  const refreshCart = useCallback(() => {
    if (localStorage.getItem('authToken')) {
      logger.log('Refreshing cart...');
      fetchCart();
    } else {
      logger.log('Guest user - no cart to refresh');
    }
  }, [fetchCart]);

  // Refresh wishlist (only for authenticated users)
  const refreshWishlist = useCallback(() => {
    if (localStorage.getItem('authToken')) {
      logger.log('Refreshing wishlist...');
      fetchWishlist();
    } else {
      logger.log('Guest user - no wishlist to refresh');
    }
  }, [fetchWishlist]);

  // Update wishlist (handles both guest and authenticated users)
  const updateWishlist = useCallback((newWishlist) => {
    logger.log('updateWishlist called with:', newWishlist?.length || 0, 'items');

    if (localStorage.getItem('authToken')) {
      // For authenticated users, update the combined state
      // The newWishlist contains the filtered items (guest items that couldn't be removed via API)
      setWishlist(newWishlist);

      // Also update guestWishlist state to trigger combinedWishlist recalculation
      setGuestWishlist(newWishlist);
      logger.log('Updated both wishlist and guestWishlist state for authenticated user');
    } else {
      // For guest users, save to localStorage and update state
      localStorage.setItem('guestWishlist', JSON.stringify(newWishlist));
      setGuestWishlist(newWishlist);
      logger.log('Updated guestWishlist state');
    }
  }, []);

  // Handle user login - fetch user's cart and wishlist data and show combined wishlist
  const handleUserLogin = useCallback(async (userData) => {
    logger.log('User logged in, fetching user data for:', userData.email);

    try {
      // Fetch user's existing data from API
      await Promise.all([fetchCart(), fetchWishlist()]);

      // Load guest wishlist data to combine with user wishlist for display
      const guestWishlistData = localStorage.getItem('guestWishlist');
      if (guestWishlistData) {
        try {
          const guestItems = JSON.parse(guestWishlistData);
          setGuestWishlist(guestItems);
          logger.log('Loaded guest wishlist for display:', guestItems.length, 'items');
        } catch (error) {
          logger.error('Error parsing guest wishlist:', error);
          setGuestWishlist([]);
        }
      }

      logger.log('Login complete - showing combined wishlist');
    } catch (error) {
      logger.error('Error during login data sync:', error);
    }
  }, [fetchCart, fetchWishlist]);

  // Handle user logout - clear user's cart and wishlist data but keep guest data separate
  const handleUserLogout = useCallback(() => {
    logger.log('User logged out, clearing user data but keeping guest wishlist');
    setCart([]);
    setWishlist([]);
    // Clear auth token to ensure proper logout
    localStorage.removeItem('authToken');
    // Guest wishlist remains in localStorage and state for next session
  }, []);

  // Load cart and wishlist on component mount - check both localStorage and API
  useEffect(() => {
    const loadUserData = async () => {
      // Always load guest wishlist data first (for combined display)
      loadGuestData();

      if (localStorage.getItem('authToken')) {
        // Authenticated user - fetch from API
        try {
          await Promise.all([fetchCart(), fetchWishlist()]);
        } catch (error) {
          console.error('Error loading user data:', error);
        }
      }
      // For non-authenticated users, we already loaded guest data above
    };

    const loadGuestData = () => {
      const guestWishlist = localStorage.getItem('guestWishlist');

      if (guestWishlist) {
        try {
          const wishlistData = JSON.parse(guestWishlist);
          logger.log('Parsed guest wishlist:', wishlistData);
          setGuestWishlist(wishlistData);
        } catch (error) {
          logger.error('Error parsing guest wishlist:', error);
          setGuestWishlist([]);
        }
      } else {
        logger.log('No guest wishlist found');
        setGuestWishlist([]);
      }
    };

    loadUserData();
  }, [fetchCart, fetchWishlist]);

  return (
    <AuthProvider onUserLogin={handleUserLogin} onUserLogout={handleUserLogout}>
      <AppContent
        cart={cart}
        wishlist={wishlist}
        guestWishlist={guestWishlist}
        refreshCart={refreshCart}
        refreshWishlist={refreshWishlist}
        updateWishlist={updateWishlist}
      />
    </AuthProvider>
  );
};

export default App;
