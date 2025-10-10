import React, { useEffect, useState } from "react";
import HomePage from "./Pages/HomePage";
import { Routes, Route } from "react-router-dom";
import CheckoutPage from "./Pages/CheckutPage";
import OrdersPage from "./Pages/OrdersPage";
import TrackingPage from "./Pages/TrackingPage";
import AboutPage from "./Pages/AboutPage";
import ContactPage from "./Pages/ContactPage";
import TermsPage from "./Pages/TermsPage";
import PrivacyPage from "./Pages/PrivacyPage";
import axios from "axios";

const App = () => {
  const [cart, setCart] = useState([]);

  const fetchCartItems = async () => {
    const response = await axios.get("/api/cart-items?expand=product");
    setCart(response.data);
  };

  useEffect(() => {
    fetchCartItems();
  }, []);

  return (
    <Routes>
      <Route path="/" element={<HomePage cart={cart} refreshCart={fetchCartItems} />} />
      <Route path="checkout" element={<CheckoutPage cart={cart} />} />
      <Route path="orders" element={<OrdersPage cart={cart} refreshCart={fetchCartItems} />} />
      <Route path="tracking" element={<TrackingPage cart={cart} />} />
      <Route path="about" element={<AboutPage cart={cart} />} />
      <Route path="contact" element={<ContactPage cart={cart} />} />
      <Route path="terms" element={<TermsPage cart={cart} />} />
      <Route path="privacy" element={<PrivacyPage cart={cart} />} />
    </Routes>
  );
};

export default App;
