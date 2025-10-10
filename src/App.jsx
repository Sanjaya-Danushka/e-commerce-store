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
import TermsPage from "./Pages/TermsPage";
import PrivacyPage from "./Pages/PrivacyPage";
import axios from "axios";
import { Routes, Route } from "react-router-dom";

const App = () => {
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);

  const fetchCartItems = async () => {
    const response = await axios.get("/api/cart-items?expand=product");
    setCart(response.data);
  };

  const fetchWishlistItems = () => {
    try {
      const storedWishlist = localStorage.getItem('wishlist');
      if (storedWishlist) {
        setWishlist(JSON.parse(storedWishlist));
      } else {
        setWishlist([]);
      }
    } catch (error) {
      console.error("Error fetching wishlist:", error);
      setWishlist([]);
    }
  };

  const refreshWishlist = () => {
    fetchWishlistItems();
  };

  const updateWishlist = (newWishlist) => {
    setWishlist(newWishlist);
    localStorage.setItem('wishlist', JSON.stringify(newWishlist));
  };

  useEffect(() => {
    fetchCartItems();
    fetchWishlistItems();
  }, []);

  return (
    <Routes>
      <Route path="/" element={<HomePage cart={cart} wishlist={wishlist} refreshCart={fetchCartItems} refreshWishlist={refreshWishlist} updateWishlist={updateWishlist} />} />
      <Route path="/categories" element={<CategoriesPage cart={cart} wishlist={wishlist} />} />
      <Route path="/brands" element={<BrandsPage cart={cart} wishlist={wishlist} />} />
      <Route path="/products" element={<ProductsPage cart={cart} wishlist={wishlist} refreshCart={fetchCartItems} refreshWishlist={refreshWishlist} updateWishlist={updateWishlist} />} />
      <Route path="/sale" element={<SalePage cart={cart} wishlist={wishlist} refreshCart={fetchCartItems} />} />
      <Route path="/new-arrivals" element={<NewArrivalsPage cart={cart} wishlist={wishlist} refreshCart={fetchCartItems} />} />
      <Route path="/wishlist" element={<WishlistPage cart={cart} wishlist={wishlist} refreshCart={fetchCartItems} updateWishlist={updateWishlist} />} />
      <Route path="checkout" element={<CheckoutPage cart={cart} />} />
      <Route path="orders" element={<OrdersPage cart={cart} wishlist={wishlist} refreshCart={fetchCartItems} />} />
      <Route path="tracking" element={<TrackingPage cart={cart} />} />
      <Route path="about" element={<AboutPage cart={cart} wishlist={wishlist} />} />
      <Route path="contact" element={<ContactPage cart={cart} wishlist={wishlist} />} />
      <Route path="terms" element={<TermsPage cart={cart} wishlist={wishlist} />} />
      <Route path="privacy" element={<PrivacyPage cart={cart} wishlist={wishlist} />} />
    </Routes>
  );
};

export default App;
