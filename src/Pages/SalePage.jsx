import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import { Link } from "react-router";
import { formatMoney } from "../utils/money";
import axios from "axios";
import CustomDropdown from "../components/CustomDropdown";

const SalePage = ({ cart, wishlist, refreshCart }) => {
  const [saleProducts, setSaleProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantities, setQuantities] = useState({});
  const [addedToCart, setAddedToCart] = useState({});

  useEffect(() => {
    const fetchSaleProducts = async () => {
      try {
        // For sale products, we'll get all products and mark them as on sale
        // You can modify this to specifically get sale products from your backend
        const response = await fetch('/api/products');
        const products = await response.json();

        // For demo purposes, we'll take the first 8 products as "sale products"
        // In a real app, you'd have a specific endpoint for sale products
        setSaleProducts(products.slice(0, 8));
        // Initialize quantities to 1 for each product
        const initialQuantities = {};
        products.slice(0, 8).forEach((product) => {
          initialQuantities[product.id] = 1;
        });
        setQuantities(initialQuantities);
      } catch (error) {
        console.error('Error fetching sale products:', error);
        setSaleProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSaleProducts();
  }, []);

  const handleQuantityChange = (productId, quantity) => {
    setQuantities({
      ...quantities,
      [productId]: parseInt(quantity),
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header cart={cart} wishlist={wishlist} />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading sale products...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header cart={cart} wishlist={wishlist} />

      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-red-600 via-pink-600 to-orange-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-sm font-medium mb-6">
            🔥 MEGA SALE
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Up to 70% OFF
          </h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90 max-w-3xl mx-auto">
            Don't miss our biggest sale of the year! Limited time offers on thousands of products.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <div className="flex items-center space-x-2 text-white/90">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
              </svg>
              <span className="text-lg font-semibold">Sale Ends: 2 Days 14 Hours</span>
            </div>
          </div>
        </div>
      </div>

      {/* Sale Categories */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Sale Categories</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">Shop our biggest discounts across all categories</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {[
            { name: 'Electronics Sale', discount: '60% OFF', items: '500+ deals', color: 'from-blue-500 to-indigo-600' },
            { name: 'Fashion Sale', discount: '70% OFF', items: '800+ deals', color: 'from-purple-500 to-pink-600' },
            { name: 'Home Sale', discount: '50% OFF', items: '300+ deals', color: 'from-green-500 to-emerald-600' },
            { name: 'Sports Sale', discount: '55% OFF', items: '400+ deals', color: 'from-orange-500 to-red-600' }
          ].map((sale) => (
            <Link
              key={sale.name}
              to={`/sale/${sale.name.toLowerCase().replace(' ', '-')}`}
              className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-6 transform hover:-translate-y-2 border border-gray-100 hover:border-red-200"
            >
              <div className={`w-16 h-16 bg-gradient-to-br ${sale.color} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                <span className="text-2xl">🔥</span>
              </div>

              <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-red-600 transition-colors duration-200">
                {sale.name}
              </h3>

              <div className="text-2xl font-bold text-red-600 mb-2">{sale.discount}</div>
              <div className="text-sm text-gray-600">{sale.items}</div>
            </Link>
          ))}
        </div>

        {/* Featured Sale Items */}
        <div className="bg-white rounded-3xl shadow-lg p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">🔥 Featured Sale Items</h2>
            <p className="text-gray-600">Hand-picked deals you don't want to miss</p>
          </div>

          {saleProducts.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-24 h-24 bg-gradient-to-br from-red-100 to-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-12 h-12 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">No sale items available</h3>
              <p className="text-gray-600 text-lg mb-8 max-w-md mx-auto">
                We're working on bringing you amazing deals. Check back soon for our next sale!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 justify-items-center">
              {saleProducts.map((product) => (
                <div key={product.id} className="group bg-gray-50 rounded-2xl p-6 hover:bg-white hover:shadow-lg transition-all duration-300 w-full max-w-sm">
                  <div className="aspect-[4/3] bg-gradient-to-br from-gray-200 to-gray-300 rounded-xl mb-4 flex items-center justify-center relative overflow-hidden">
                    <img
                      className="w-full h-full object-cover"
                      src={`/${product.image}`}
                      alt={product.name}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>

                    {/* Sale badge */}
                    <div className="absolute top-3 left-3 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                      SALE
                    </div>
                  </div>

                  <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2 min-h-[3rem]">
                    {product.name}
                  </h3>

                  <div className="flex items-center space-x-2 mb-3">
                    <span className="text-lg font-bold text-red-600">{formatMoney(product.priceCents)}</span>
                    <span className="text-sm text-gray-500 line-through">{formatMoney(Math.round(product.priceCents * 1.3))}</span>
                    <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-medium">
                      {Math.round(30)}% OFF
                    </span>
                  </div>

                  {/* Quantity Selector */}
                  <div className="mb-3">
                    <CustomDropdown
                      options={[
                        { value: 1, label: "Qty: 1" },
                        { value: 2, label: "Qty: 2" },
                        { value: 3, label: "Qty: 3" },
                        { value: 4, label: "Qty: 4" },
                        { value: 5, label: "Qty: 5" }
                      ]}
                      value={quantities[product.id] || 1}
                      onChange={(value) => handleQuantityChange(product.id, value)}
                      placeholder="Select quantity"
                      className="w-full"
                    />
                  </div>

                  {/* Success message */}
                  <div
                    className={`mb-3 flex items-center justify-center text-green-600 text-sm font-medium bg-green-50 rounded-lg py-2 transition-all duration-300 ${
                      addedToCart[product.id] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                    }`}>
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    Added to cart!
                  </div>

                  <button
                    className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center"
                    onClick={() => {
                      axios
                        .post("/api/cart-items", {
                          productId: product.id,
                          quantity: quantities[product.id] || 1,
                        })
                        .then(() => {
                          refreshCart();
                          setAddedToCart({
                            ...addedToCart,
                            [product.id]: true,
                          });
                          setTimeout(() => {
                            setAddedToCart({
                              ...addedToCart,
                              [product.id]: false,
                            });
                          }, 2000);
                        })
                        .catch((error) => {
                          console.error("Error adding to cart:", error);
                          alert("Failed to add product to cart.");
                        });
                    }}>
                    <span className="flex items-center">
                      Add to Cart
                      <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                      </svg>
                    </span>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SalePage;
