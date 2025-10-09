import React from "react";
import "./orders.css";
import Header from "../components/Header";

const OrdersPage = () => {
  return (
    <div>
      {" "}
      <title>Orders</title>
      <Header />
      <div class="orders-page">
        <div class="page-title">Your Orders</div>

        <div class="orders-grid">
          <div class="order-container">
            <div class="order-header">
              <div class="order-header-left-section">
                <div class="order-date">
                  <div class="order-header-label">Order Placed:</div>
                  <div>August 12</div>
                </div>
                <div class="order-total">
                  <div class="order-header-label">Total:</div>
                  <div>$35.06</div>
                </div>
              </div>

              <div class="order-header-right-section">
                <div class="order-header-label">Order ID:</div>
                <div>27cba69d-4c3d-4098-b42d-ac7fa62b7664</div>
              </div>
            </div>

            <div class="order-details-grid">
              <div class="product-image-container">
                <img src="images/products/athletic-cotton-socks-6-pairs.jpg" />
              </div>

              <div class="product-details">
                <div class="product-name">
                  Black and Gray Athletic Cotton Socks - 6 Pairs
                </div>
                <div class="product-delivery-date">Arriving on: August 15</div>
                <div class="product-quantity">Quantity: 1</div>
                <button class="buy-again-button button-primary">
                  <img
                    class="buy-again-icon"
                    src="images/icons/buy-again.png"
                  />
                  <span class="buy-again-message">Add to Cart</span>
                </button>
              </div>

              <div class="product-actions">
                <a href="/tracking">
                  <button class="track-package-button button-secondary">
                    Track package
                  </button>
                </a>
              </div>

              <div class="product-image-container">
                <img src="images/products/adults-plain-cotton-tshirt-2-pack-teal.jpg" />
              </div>

              <div class="product-details">
                <div class="product-name">
                  Adults Plain Cotton T-Shirt - 2 Pack
                </div>
                <div class="product-delivery-date">Arriving on: August 19</div>
                <div class="product-quantity">Quantity: 2</div>
                <button class="buy-again-button button-primary">
                  <img
                    class="buy-again-icon"
                    src="images/icons/buy-again.png"
                  />
                  <span class="buy-again-message">Add to Cart</span>
                </button>
              </div>

              <div class="product-actions">
                <a href="/tracking">
                  <button class="track-package-button button-secondary">
                    Track package
                  </button>
                </a>
              </div>
            </div>
          </div>

          <div class="order-container">
            <div class="order-header">
              <div class="order-header-left-section">
                <div class="order-date">
                  <div class="order-header-label">Order Placed:</div>
                  <div>June 10</div>
                </div>
                <div class="order-total">
                  <div class="order-header-label">Total:</div>
                  <div>$41.90</div>
                </div>
              </div>

              <div class="order-header-right-section">
                <div class="order-header-label">Order ID:</div>
                <div>b6b6c212-d30e-4d4a-805d-90b52ce6b37d</div>
              </div>
            </div>

            <div class="order-details-grid">
              <div class="product-image-container">
                <img src="images/products/intermediate-composite-basketball.jpg" />
              </div>

              <div class="product-details">
                <div class="product-name">Intermediate Size Basketball</div>
                <div class="product-delivery-date">Arriving on: June 17</div>
                <div class="product-quantity">Quantity: 2</div>
                <button class="buy-again-button button-primary">
                  <img
                    class="buy-again-icon"
                    src="images/icons/buy-again.png"
                  />
                  <span class="buy-again-message">Add to Cart</span>
                </button>
              </div>

              <div class="product-actions">
                <a href="/tracking">
                  <button class="track-package-button button-secondary">
                    Track package
                  </button>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrdersPage;
