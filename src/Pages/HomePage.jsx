import React from "react";
import "./HomePage.css";
import axios from "axios";
import { useEffect, useState } from "react";
import Header from "../components/Header";
import { formatMoney } from "../utils/money";

const HomePage = ({ cart }) => {
  const [products, setProducts] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [addedToCart, setAddedToCart] = useState({});

  useEffect(() => {
    const fetchProducts = async () => {
      const response = await axios.get("/api/products");
      setProducts(response.data);
      // Initialize quantities to 1 for each product
      const initialQuantities = {};
      response.data.forEach((product) => {
        initialQuantities[product.id] = 1;
      });
      setQuantities(initialQuantities);
    };
    fetchProducts();
  }, []);

  const handleQuantityChange = (productId, quantity) => {
    setQuantities({
      ...quantities,
      [productId]: parseInt(quantity),
    });
  };

  const handleAddToCart = (productId) => {
    const quantity = quantities[productId] || 1;
    axios
      .post("/api/cart-items", {
        productId: productId,
        quantity: quantity,
      })
      .then(() => {
        // Show "Added" message
        setAddedToCart({ ...addedToCart, [productId]: true });
        // Hide after 2 seconds
        setTimeout(() => {
          setAddedToCart({ ...addedToCart, [productId]: false });
        }, 2000);
      })
      .catch((error) => {
        console.error("Error adding to cart:", error);
        alert("Failed to add product to cart.");
      });
  };

  return (
    <div>
      <title>Home</title>
      <Header cart={cart} />

      <div className="home-page">
        <div className="products-grid">
          {products.map((product) => {
            return (
              <div key={product.id} className="product-container">
                <div className="product-image-container">
                  <img className="product-image" src={`/${product.image}`} />
                </div>

                <div className="product-name limit-text-to-2-lines">
                  {product.name}
                </div>

                <div className="product-rating-container">
                  <img
                    className="product-rating-stars"
                    src={`/images/ratings/rating-${
                      product.rating.stars * 10
                    }.png`}
                  />
                  <div className="product-rating-count link-primary">
                    {product.rating.count}
                  </div>
                </div>

                <div className="product-price">
                  {formatMoney(product.priceCents)}
                </div>

                <div className="product-quantity-container">
                  <select
                    value={quantities[product.id] || 1}
                    onChange={(e) =>
                      handleQuantityChange(product.id, e.target.value)
                    }>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                    <option value="6">6</option>
                    <option value="7">7</option>
                    <option value="8">8</option>
                    <option value="9">9</option>
                    <option value="10">10</option>
                  </select>
                </div>

                <div className="product-spacer"></div>

                <div
                  className="added-to-cart"
                  style={{ opacity: addedToCart[product.id] ? 1 : 0 }}>
                  <img src="/images/icons/checkmark.png" />
                  Added
                </div>

                <button
                  className="add-to-cart-button button-primary"
                  onClick={() => handleAddToCart(product.id)}>
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
