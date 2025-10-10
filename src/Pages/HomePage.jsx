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
      <Header cart={cart} onSearch={handleSearch} searchQuery={searchQuery} />

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6">
          {products.map((product) => {
            return (
              <div key={product.id} className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-shadow duration-300 p-4 group">
                <div className="aspect-square mb-4 overflow-hidden rounded-lg bg-gray-100">
                  <img
                    className="product-image w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    src={`/${product.image}`}
                  />
                </div>

                <div className="product-name h-12 mb-2">
                  <h3 className="font-medium text-gray-900 text-sm leading-tight line-clamp-2">
                    {product.name}
                  </h3>
                </div>

                <div className="product-rating-container flex items-center mb-3">
                  <img
                    className="product-rating-stars w-16 h-4 mr-2"
                    src={`/images/ratings/rating-${product.rating.stars * 10}.png`}
                  />
                  <div className="product-rating-count text-green-600 text-xs font-medium">
                    ({product.rating.count})
                  </div>
                </div>

                <div className="product-price text-lg font-bold text-gray-900 mb-3">
                  {formatMoney(product.priceCents)}
                </div>

                <div className="product-quantity-container mb-4">
                  <select
                    value={quantities[product.id] || 1}
                    onChange={(e) => handleQuantityChange(product.id, e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
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
                  className={`added-to-cart flex items-center text-green-600 text-sm font-medium mb-3 transition-opacity duration-300 ${
                    addedToCart[product.id] ? 'opacity-100' : 'opacity-0'
                  }`}>
                  <img src="/images/icons/checkmark.png" className="w-4 h-4 mr-2" />
                  Added to cart!
                </div>

                <button
                  className="add-to-cart-button w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center"
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
      </div>
    </div>
  );
};

export default HomePage;
