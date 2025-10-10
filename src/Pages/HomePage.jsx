import React from "react";
import "./HomePage.css";
import axios from "axios";
import { useEffect, useState } from "react";
import Header from "../components/Header";
import { formatMoney } from "../utils/money";

const HomePage = ({ cart, refreshCart }) => {
  const [products, setProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [addedToCart, setAddedToCart] = useState({});
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      const response = await axios.get("/api/products");
      setProducts(response.data);
      setAllProducts(response.data);
      // Initialize quantities to 1 for each product
      const initialQuantities = {};
      response.data.forEach((product) => {
        initialQuantities[product.id] = 1;
      });
      setQuantities(initialQuantities);
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    // Filter products based on search query
    if (searchQuery.trim() === "") {
      setProducts(allProducts);
    } else {
      const filtered = allProducts.filter((product) =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setProducts(filtered);
    }
  }, [searchQuery, allProducts]);

  const handleQuantityChange = (productId, quantity) => {
    setQuantities({
      ...quantities,
      [productId]: parseInt(quantity),
    });
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <title>Home</title>
      <Header cart={cart} />

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              Discover Amazing Products
            </h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90">
              Shop the latest trends with unbeatable prices
            </p>
            <div className="max-w-md mx-auto">
              <div className="relative">
                <input
                  type="text"
                  placeholder="What are you looking for?"
                  className="w-full px-6 py-4 text-gray-900 bg-white rounded-full text-lg focus:outline-none focus:ring-4 focus:ring-white/20"
                  value={searchQuery || ""}
                  onChange={(e) => handleSearch(e.target.value)}
                />
                <button className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Featured Products Section */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-900">
              {searchQuery ? `Search Results for "${searchQuery}"` : 'Featured Products'}
            </h2>
            {searchQuery && (
              <button
                onClick={() => handleSearch("")}
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                Clear Search
              </button>
            )}
          </div>

          {products.length === 0 && searchQuery ? (
            <div className="text-center py-12">
              <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2z" />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
              <p className="text-gray-500">Try searching for something else or browse our featured products.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
              {products.map((product) => {
                return (
                  <div key={product.id} className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-shadow duration-300 p-6 group max-w-sm mx-auto">
                    <div className="aspect-[4/3] mb-6 overflow-hidden rounded-lg bg-gray-100">
                      <img
                        className="product-image w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        src={`/${product.image}`}
                      />
                    </div>

                    <div className="product-name h-16 mb-4">
                      <h3 className="font-semibold text-gray-900 text-base leading-tight line-clamp-2">
                        {product.name}
                      </h3>
                    </div>

                    <div className="product-rating-container flex items-center mb-4">
                      <img
                        className="product-rating-stars w-20 h-5 mr-3"
                        src={`/images/ratings/rating-${product.rating.stars * 10}.png`}
                      />
                      <div className="product-rating-count text-green-600 text-sm font-medium">
                        ({product.rating.count})
                      </div>
                    </div>

                    <div className="product-price text-xl font-bold text-gray-900 mb-4">
                      {formatMoney(product.priceCents)}
                    </div>

                    <div className="product-quantity-container mb-6">
                      <select
                        value={quantities[product.id] || 1}
                        onChange={(e) => handleQuantityChange(product.id, e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                        <option value="1">Qty: 1</option>
                        <option value="2">Qty: 2</option>
                        <option value="3">Qty: 3</option>
                        <option value="4">Qty: 4</option>
                        <option value="5">Qty: 5</option>
                        <option value="6">Qty: 6</option>
                        <option value="7">Qty: 7</option>
                        <option value="8">Qty: 8</option>
                        <option value="9">Qty: 9</option>
                        <option value="10">Qty: 10</option>
                      </select>
                    </div>

                    <div
                      className={`added-to-cart flex items-center text-green-600 text-base font-medium mb-4 transition-opacity duration-300 ${
                        addedToCart[product.id] ? 'opacity-100' : 'opacity-0'
                      }`}>
                      <img src="/images/icons/checkmark.png" className="w-5 h-5 mr-2" />
                      Added to cart!
                    </div>

                    <button
                      className="add-to-cart-button w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center text-base"
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
                      Add to Cart
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
