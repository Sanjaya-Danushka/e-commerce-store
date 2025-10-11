import React, { useEffect, useState } from "react";
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

// AppContent component to handle profile completion modal
const AppContent = () => {
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
          <Route path="/" element={<HomePage cart={[]} wishlist={[]} refreshCart={() => {}} refreshWishlist={() => {}} updateWishlist={() => {}} />} />
          <Route path="/categories" element={<CategoriesPage cart={[]} wishlist={[]} />} />
          <Route path="/brands" element={<BrandsPage cart={[]} wishlist={[]} />} />
          <Route path="/products" element={<ProductsPage cart={[]} wishlist={[]} refreshCart={() => {}} refreshWishlist={() => {}} updateWishlist={() => {}} />} />
          <Route path="/sale" element={<SalePage cart={[]} wishlist={[]} refreshCart={() => {}} />} />
          <Route path="/new-arrivals" element={<NewArrivalsPage cart={[]} wishlist={[]} refreshCart={() => {}} updateWishlist={() => {}} />} />
          <Route path="/wishlist" element={<WishlistPage cart={[]} wishlist={[]} refreshCart={() => {}} updateWishlist={() => {}} />} />
          <Route path="/checkout" element={<CheckoutPage cart={[]} />} />
          <Route path="/orders" element={<OrdersPage cart={[]} wishlist={[]} refreshCart={() => {}} />} />
          <Route path="/tracking" element={<TrackingPage cart={[]} />} />
          <Route path="/about" element={<AboutPage cart={[]} wishlist={[]} />} />
          <Route path="/contact" element={<ContactPage cart={[]} wishlist={[]} />} />
          <Route path="/terms-of-service" element={<TermsOfServicePage cart={[]} wishlist={[]} />} />
          <Route path="/privacy" element={<PrivacyPage cart={[]} wishlist={[]} />} />
          <Route path="/accessibility" element={<AccessibilityPage cart={[]} />} />
          <Route path="/careers" element={<CareersPage cart={[]} />} />
          <Route path="/press" element={<PressPage cart={[]} />} />
          <Route path="/blog" element={<BlogPage cart={[]} />} />
          <Route path="/affiliate-program" element={<AffiliateProgramPage cart={[]} />} />
          <Route path="/wholesale" element={<WholesalePage cart={[]} />} />
          <Route path="/shipping-info" element={<ShippingInfoPage cart={[]} />} />
          <Route path="/returns-exchanges" element={<ReturnsExchangesPage cart={[]} />} />
          <Route path="/size-guide" element={<SizeGuidePage cart={[]} />} />
          <Route path="/track-order" element={<TrackOrderPage cart={[]} />} />
          <Route path="/gift-cards" element={<GiftCardsPage cart={[]} />} />
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
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;
