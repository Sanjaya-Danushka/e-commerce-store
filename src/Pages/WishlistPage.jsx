import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import Header from "../components/Header";
import { formatMoney } from "../utils/money";
import axios from "axios";

const WishlistPage = ({ cart, wishlist, refreshCart, refreshWishlist, updateWishlist }) => {
  const [products, setProducts] = useState([]);
  const [addedToCart, setAddedToCart] = useState({});
  const [showDescription, setShowDescription] = useState(null);
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    // Fetch all products to match with wishlist items
    const fetchProducts = async () => {
      try {
        const response = await axios.get("/api/products");
        if (response.status === 200) {
          const data = response.data;
          // Extract products array from API response
          const allProducts = data.products || data || [];
          // Ensure we always set an array, even if API returns something else
          setProducts(Array.isArray(allProducts) ? allProducts : []);
        } else {
          console.error("Failed to fetch products:", response.status);
          setProducts([]);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
        setProducts([]);
      }
    };
    fetchProducts();

    // Refresh wishlist data from source of truth
    const refreshWishlistData = () => {
      console.log('Refreshing wishlist data...');
      if (localStorage.getItem('authToken')) {
        // For authenticated users, refresh from API
        if (refreshWishlist) {
          console.log('Calling refreshWishlist for authenticated user');
          refreshWishlist();
        }
      } else {
        // For guest users, refresh from localStorage
        const guestWishlist = localStorage.getItem('guestWishlist');
        console.log('Loading guest wishlist from localStorage:', guestWishlist);
        if (guestWishlist) {
          try {
            const wishlistData = JSON.parse(guestWishlist);
            console.log('Parsed guest wishlist data:', wishlistData?.length || 0, 'items');
            if (updateWishlist) {
              updateWishlist(wishlistData);
              console.log('Updated wishlist state with guest data');
            }
          } catch (error) {
            console.error('Error parsing guest wishlist:', error);
          }
        } else {
          console.log('No guest wishlist found in localStorage');
          if (updateWishlist) {
            updateWishlist([]);
            console.log('Updated wishlist state with empty array');
          }
        }
      }
    };

    refreshWishlistData();
  }, [updateWishlist, refreshWishlist]);

  const [renderKey, setRenderKey] = useState(0);

  // Force complete component re-render when wishlist changes
  useEffect(() => {
    console.log('WishlistPage: wishlist prop changed, forcing re-render');
    setRenderKey(prev => prev + 1);
  }, [wishlist]);

  // Get wishlist products by matching product IDs
  const wishlistProducts = (products && Array.isArray(products)) ? products.filter(product =>
    wishlist.some(wishlistItem => wishlistItem.productId === product.id)
  ) : [];

  // Debug logging
  console.log('WishlistPage render:', {
    wishlistLength: wishlist?.length || 0,
    productsLength: products?.length || 0,
    wishlistProductsLength: wishlistProducts?.length || 0,
    wishlistItems: wishlist?.map(item => item.productId) || [],
    renderKey
  });

  const removeFromWishlist = async (productId) => {
    console.log('removeFromWishlist called:', {
      productId,
      currentWishlistLength: wishlist?.length || 0,
      currentWishlistItems: wishlist?.map(item => item.productId) || []
    });

    // Optimistic UI update - hide item immediately
    const updatedWishlist = wishlist.filter(item => item.productId !== productId);
    console.log('After filter:', {
      updatedWishlistLength: updatedWishlist?.length || 0,
      updatedWishlistItems: updatedWishlist?.map(item => item.productId) || []
    });

    // Immediately update both localStorage and UI state for guest items
    if (!localStorage.getItem('authToken')) {
      const guestWishlist = localStorage.getItem('guestWishlist');
      if (guestWishlist) {
        const guestItems = JSON.parse(guestWishlist);
        console.log('Before removal - guest items:', guestItems.length, guestItems.map(item => item.productId));
        const filteredItems = guestItems.filter(item => item.productId !== productId);
        if (filteredItems.length < guestItems.length) {
          localStorage.setItem('guestWishlist', JSON.stringify(filteredItems));
          console.log('✅ Immediately removed from guest storage:', productId);
          console.log('After removal - guest items:', filteredItems.length, filteredItems.map(item => item.productId));
          // Verify the update worked
          const verifyStorage = localStorage.getItem('guestWishlist');
          if (verifyStorage) {
            const verifyItems = JSON.parse(verifyStorage);
            console.log('Verification - localStorage now has:', verifyItems.length, 'items');
          }
        }
      }
    }

    if (updateWishlist) {
      updateWishlist(updatedWishlist);
      console.log('updateWishlist called with:', updatedWishlist?.length || 0, 'items');
    }

    // Force component re-render to ensure UI updates
    setRenderKey(prev => prev + 1);

    // Try to remove from backend in background (silent)
    try {
      if (localStorage.getItem('authToken')) {
        // Try API removal first
        try {
          await axios.delete(`/api/wishlist/${productId}`);
          console.log('✅ Removed from user account:', productId);
        } catch (apiError) {
          console.log('API removal failed:', apiError.response?.status);
          // API failed - try localStorage cleanup for guest items
          if (apiError.response?.status === 404) {
            const guestWishlist = localStorage.getItem('guestWishlist');
            console.log('API 404 - checking guest storage:', guestWishlist);
            if (guestWishlist) {
              const guestItems = JSON.parse(guestWishlist);
              console.log('Guest items before cleanup:', guestItems.length, guestItems.map(item => item.productId));
              const filteredItems = guestItems.filter(item => item.productId !== productId);
              if (filteredItems.length < guestItems.length) {
                localStorage.setItem('guestWishlist', JSON.stringify(filteredItems));
                console.log('✅ Removed guest item from localStorage after API 404');
                console.log('Guest items after cleanup:', filteredItems.length, filteredItems.map(item => item.productId));
                // Verify the update worked
                const verifyStorage = localStorage.getItem('guestWishlist');
                if (verifyStorage) {
                  const verifyItems = JSON.parse(verifyStorage);
                  console.log('Verification - localStorage now has:', verifyItems.length, 'items after API 404 cleanup');
                }
              }
            }
          }
        }
      }
    } catch (error) {
      // Silent failure - UI already updated optimistically and localStorage cleaned
      console.log('Background removal failed, but UI and localStorage updated:', error.message);
    }
  };

  const handleAddToCart = async (product) => {
    // Check if user is authenticated
    if (!isAuthenticated) {
      // Guest user - redirect to login page
      navigate('/login', {
        state: {
          from: { pathname: window.location.pathname },
          message: 'Please login to add items to your cart'
        }
      });
      return;
    }

    try {
      await axios.post("/api/cart-items", {
        productId: product.id,
        quantity: 1,
      });

      // For authenticated users, refresh from API
      if (refreshCart) {
        refreshCart();
      }

      // Show success feedback
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
    } catch (error) {
      console.error("Error adding to cart:", error);
      alert("Failed to add product to cart.");
    }
  };

  const toggleDescription = (productId) => {
    setShowDescription(showDescription === productId ? null : productId);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <title>Wishlist</title>
      <Header cart={cart} wishlist={wishlist} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            My Wishlist
            <span className="block bg-gradient-to-r from-pink-500 to-red-500 bg-clip-text text-transparent text-2xl font-normal">
              {wishlistProducts.length} {wishlistProducts.length === 1 ? 'item' : 'items'}
            </span>
          </h1>

          <p className="text-xl text-gray-600">
            Your favorite products, saved for later
          </p>
        </div>

        {wishlistProducts.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Your wishlist is empty</h3>
            <p className="text-gray-600 text-lg mb-8 max-w-md mx-auto">
              Start adding products to your wishlist by clicking the heart icon on product cards
            </p>
            <a
              href="/"
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-pink-500 to-red-500 text-white font-semibold rounded-xl hover:from-pink-600 hover:to-red-600 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              Continue Shopping
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
          </div>
        ) : (
          <div key={renderKey} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {wishlistProducts.map((product) => {
              return (
                <div key={product.id} className="group product-card bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 p-8 transform hover:-translate-y-3 border border-gray-100 hover:border-red-200 max-w-sm mx-auto">
                  <div className="relative aspect-[4/3] mb-8 overflow-hidden rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 shadow-lg">
                    <img
                      className="product-image w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                      src={`/${product.image}`}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                    {/* Sale badge */}
                    <div className="absolute top-4 left-4 bg-red-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                      SALE
                    </div>

                    {/* Remove from wishlist button */}
                    <button
                      onClick={() => removeFromWishlist(product.id)}
                      className="absolute top-4 right-4 w-12 h-12 bg-red-500/90 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 hover:scale-110 shadow-lg"
                    >
                      <svg className="w-6 h-6 text-white" fill="currentColor" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div className="product-name h-20">
                      <h3 className="font-bold text-gray-900 text-lg leading-tight line-clamp-2 group-hover:text-red-600 transition-colors duration-200">
                        {product.name}
                      </h3>
                    </div>

                    <div className="product-rating-container flex items-center space-x-3">
                      <div className="flex items-center space-x-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <svg
                            key={star}
                            className={`w-5 h-5 ${star <= product.rating.stars ? 'text-yellow-400' : 'text-gray-300'}`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                      <div className="product-rating-count text-green-600 text-sm font-medium bg-green-50 px-3 py-1 rounded-full">
                        ({product.rating.count})
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <div className="product-price text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                        {formatMoney(product.priceCents)}
                      </div>
                      <span className="text-lg text-gray-500 line-through">
                        {formatMoney(Math.round(product.priceCents * 1.3))}
                      </span>
                      <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                        Save {Math.round(30)}%
                      </span>
                    </div>

                    {/* Product Description (collapsible) */}
                    {showDescription === product.id && (
                      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                        <p className="text-sm text-gray-700 leading-relaxed">
                          {product.description || "Premium quality product with exceptional features and reliable performance. Perfect for everyday use and special occasions."}
                        </p>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                      <button
                        onClick={() => toggleDescription(product.id)}
                        className="flex-1 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white font-bold py-3 px-4 rounded-xl transition-all duration-300 flex items-center justify-center text-sm shadow-lg hover:shadow-xl transform hover:scale-105"
                      >
                        {showDescription === product.id ? 'Hide Details' : 'View Details'}
                        <svg className={`w-4 h-4 ml-2 transform transition-transform duration-200 ${showDescription === product.id ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleAddToCart(product)}
                        disabled={addedToCart[product.id]}
                        className={`flex-1 font-bold py-3 px-4 rounded-xl transition-all duration-300 flex items-center justify-center text-sm shadow-lg hover:shadow-xl transform hover:scale-105 ${
                          addedToCart[product.id]
                            ? 'bg-green-500 hover:bg-green-600 text-white'
                            : 'bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 text-white'
                        }`}
                      >
                        {addedToCart[product.id] ? (
                          <>
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                            </svg>
                            Added!
                          </>
                        ) : (
                          <>
                            Add to Cart
                            <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                            </svg>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default WishlistPage;
