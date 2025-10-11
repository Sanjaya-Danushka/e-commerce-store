import React, { useEffect, useState, useCallback } from "react";
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
  // Cart and Wishlist state management (moved to App level)
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [cartLoading, setCartLoading] = useState(true);
  const [wishlistLoading, setWishlistLoading] = useState(true);

  // Fetch cart items from API
  const fetchCart = useCallback(async () => {
    try {
      setCartLoading(true);
      const response = await axios.get('/api/cart-items?expand=product');
      setCart(response.data);
      console.log('Cart fetched:', response.data);
    } catch (error) {
      console.error('Error fetching cart:', error);
      setCart([]);
    } finally {
      setCartLoading(false);
    }
  }, []);

  // Fetch wishlist items from API
  const fetchWishlist = useCallback(async () => {
    try {
      setWishlistLoading(true);
      const response = await axios.get('/api/wishlist?expand=product');
      // Convert API response to the format expected by the UI
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
    } finally {
      setWishlistLoading(false);
    }
  }, []);

  // Refresh cart after adding/removing items
  const refreshCart = useCallback(() => {
    console.log('Refreshing cart...');
    fetchCart();
  }, [fetchCart]);

  // Update wishlist
  const updateWishlist = useCallback(async (newWishlist) => {
    console.log('Updating wishlist:', newWishlist);
    // For now, we'll use the API approach - this function is mainly for UI updates
    // The actual persistence happens via API calls in individual components
    setWishlist(newWishlist);
  }, []);

  // Refresh wishlist
  const refreshWishlist = useCallback(() => {
    console.log('Refreshing wishlist...');
    fetchWishlist();
  }, [fetchWishlist]);

  // Handle user login - fetch user's cart and wishlist data
  const handleUserLogin = useCallback((userData) => {
    console.log('User logged in, fetching user data for:', userData.email);
    fetchCart();
    fetchWishlist();
  }, [fetchCart, fetchWishlist]);

  // Handle user logout - clear user's cart and wishlist data
  const handleUserLogout = useCallback(() => {
    console.log('User logged out, clearing user data');
    setCart([]);
    setWishlist([]);
    setCartLoading(false);
    setWishlistLoading(false);
  }, []);

  // Load cart and wishlist on component mount
  useEffect(() => {
    fetchCart();
    fetchWishlist();
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
