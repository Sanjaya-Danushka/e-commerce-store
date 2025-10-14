import React, { useState, useEffect, useCallback } from 'react';
import adminAPI from '../../services/adminAPI';

const ProductsContent = ({ theme }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    priceCents: '',
    rating: '',
    category: '',
    keywords: '',
    image: ''
  });
  const [imageFile, setImageFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  // Debounced search effect
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchTerm !== undefined) {
        setCurrentPage(1);
        fetchProducts(1, searchTerm);
      }
    }, 300); // 300ms debounce delay

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  // Fetch products
  const fetchProducts = useCallback(async (page = 1, search = '') => {
    try {
      setLoading(true);
      console.log('Calling adminAPI.getProducts with params:', { page, limit: 10, search });

      const response = await adminAPI.getProducts({
        page,
        limit: 10,
        search
      });

      console.log('Products API response received');

      if (response && response.data && response.data.products) {
        console.log('Setting products:', response.data.products.length, 'products');
        setProducts(response.data.products || []);
        setTotalPages(response.data.pagination?.pages || 1);
        setCurrentPage(page);
      } else {
        console.log('No products in response data');
        setProducts([]);
        setTotalPages(1);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      console.error('Error response:', error.response);
      if (error.response?.status === 401) {
        console.log('401 error - redirecting to admin page');
        // Redirect to login if not authenticated
        window.location.href = '/admin';
        return;
      }
      // If we get any other error, try again after a short delay (in case token is being set)
      const currentToken = localStorage.getItem('adminToken');
      if (!currentToken) {
        console.log('No token and error occurred, waiting and retrying...');
        setTimeout(() => {
          fetchProducts(page, search);
        }, 1000);
        return;
      }
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    console.log('Admin token in ProductsContent:', token ? 'Present' : 'Missing');

    if (!token) {
      console.log('No admin token found, redirecting to admin page');
      window.location.href = '/admin';
      return;
    }

    console.log('Fetching products...');
    fetchProducts(currentPage, searchTerm);
  }, [currentPage, fetchProducts]); // Removed searchTerm from dependencies since it's handled by debounced effect

  // Handle search input
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Handle search button click (for explicit search)
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchProducts(1, searchTerm);
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle file input
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      console.log('File selected:', file.name, 'Size:', file.size, 'Type:', file.type);

      // Validate file size (10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        alert('File size must be less than 10MB');
        return;
      }

      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Only image files are allowed');
        return;
      }

      setImageFile(file);
      // Create preview URL
      const reader = new FileReader();
      reader.onload = (e) => {
        setFormData(prev => ({
          ...prev,
          image: e.target.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Upload image
  const uploadImage = async () => {
    if (!imageFile) return null;

    try {
      setUploading(true);
      console.log('Starting image upload for file:', imageFile.name, 'Size:', imageFile.size);

      const response = await adminAPI.uploadImage(imageFile);
      console.log('Upload response:', response);
      console.log('Upload response data:', response.data);

      // The response structure is: { data: { imagePath: '...', ... }, status: 200, ... }
      const imagePath = response.data?.imagePath;
      console.log('Extracted imagePath:', imagePath);

      return imagePath;
    } catch (error) {
      console.error('Error uploading image:', error);
      console.error('Error response:', error.response?.data);
      alert('Failed to upload image: ' + (error.response?.data?.error || error.message));
      return null;
    } finally {
      setUploading(false);
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let imagePath = null;

      // Upload image first if provided
      if (imageFile) {
        const uploadedPath = await uploadImage();
        if (!uploadedPath) {
          alert('Failed to upload image. Please try again.');
          return;
        }
        imagePath = uploadedPath;
      } else if (editingProduct) {
        // For editing, keep the existing image if no new file is provided
        imagePath = formData.image;
      }

      // Don't proceed if we have no image path
      if (!imagePath) {
        alert('Please select an image for the product.');
        return;
      }

      const productData = {
        name: formData.name,
        priceCents: parseInt(formData.priceCents),
        rating: {
          stars: parseFloat(formData.rating),
          count: editingProduct && typeof editingProduct.rating === 'object' 
            ? editingProduct.rating.count 
            : 100  // Default count for new products or if no count exists
        },
        category: formData.category,
        keywords: formData.keywords.split(',').map(k => k.trim()),
        image: imagePath
      };

      if (editingProduct) {
        // Update existing product
        await adminAPI.updateProduct(editingProduct.id, productData);
      } else {
        // Create new product
        await adminAPI.createProduct(productData);
      }

      setShowModal(false);
      setEditingProduct(null);
      setFormData({
        name: '',
        priceCents: '',
        rating: '',
        category: '',
        keywords: '',
        image: ''
      });
      setImageFile(null);
      fetchProducts(currentPage, searchTerm);
    } catch (error) {
      console.error('Error saving product:', error);
      alert('Failed to save product');
    }
  };

  // Handle edit
  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      priceCents: product.priceCents,
      rating: typeof product.rating === 'object' ? product.rating.stars : product.rating,
      category: product.category,
      keywords: Array.isArray(product.keywords) ? product.keywords.join(', ') : product.keywords,
      image: product.image  // This should be a file path, not base64 data
    });
    setImageFile(null);  // Clear any selected file when editing
    setShowModal(true);
  };

  // Handle delete
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await adminAPI.deleteProduct(id);
        fetchProducts(currentPage, searchTerm);
      } catch (error) {
        console.error('Error deleting product:', error);
        alert('Failed to delete product');
      }
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      name: '',
      priceCents: '',
      rating: '',
      category: '',
      keywords: '',
      image: ''
    });
    setImageFile(null);
    setEditingProduct(null);
  };

  // Open create modal
  const openCreateModal = () => {
    resetForm();
    setShowModal(true);
  };

  return (
    <div className="space-y-10">
      <div className="flex justify-between items-center">
        <h2 className={`text-5xl font-bold ${theme.text} mb-10`}>Product Management</h2>
        <button
          onClick={openCreateModal}
          className={`px-6 py-3 ${theme.button} text-white rounded-lg font-semibold shadow-lg hover:scale-105 transition-all duration-200`}
        >
          ➕ Add Product
        </button>
      </div>

      {/* Search Bar */}
      <div className={`${theme.card} ${theme.border} rounded-3xl p-6 ${theme.shadow}`}>
        <form onSubmit={handleSearchSubmit} className="flex gap-4">
          <input
            type="text"
            placeholder="Search products by name, category, or keywords..."
            value={searchTerm}
            onChange={handleSearchChange}
            className={`flex-1 ${theme.input} rounded-lg px-4 py-3 text-lg`}
          />
          <button
            type="submit"
            className={`${theme.button} px-6 py-3 text-white rounded-lg font-semibold hover:scale-105 transition-all duration-200`}
          >
            🔍 Search
          </button>
        </form>
      </div>

      {/* Products Table */}
      <div className={`${theme.card} ${theme.border} rounded-3xl ${theme.shadow} overflow-hidden`}>
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            <p className={`${theme.textSecondary} mt-4`}>Loading products...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="p-8 text-center">
            <p className={`${theme.textSecondary} text-lg`}>No products found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className={`${theme.background} ${theme.border} border-b`}>
                <tr>
                  <th className={`px-6 py-4 text-left ${theme.text} font-semibold`}>Image</th>
                  <th className={`px-6 py-4 text-left ${theme.text} font-semibold`}>Name</th>
                  <th className={`px-6 py-4 text-left ${theme.text} font-semibold`}>Category</th>
                  <th className={`px-6 py-4 text-left ${theme.text} font-semibold`}>Price</th>
                  <th className={`px-6 py-4 text-left ${theme.text} font-semibold`}>Rating</th>
                  <th className={`px-6 py-4 text-center ${theme.text} font-semibold`}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id} className={`${theme.border} border-b hover:bg-opacity-50 transition-colors`}>
                    <td className="px-6 py-4">
                      <img
                        src={product.image.startsWith('data:') ? '/images/products/placeholder.jpg' : `/${product.image}`}
                        alt={product.name}
                        className="w-16 h-16 object-cover rounded-lg"
                        onError={(e) => {
                          e.target.src = '/images/products/placeholder.jpg';
                        }}
                      />
                    </td>
                    <td className={`px-6 py-4 ${theme.text} font-medium`}>{product.name}</td>
                    <td className={`px-6 py-4 ${theme.textSecondary}`}>{product.category}</td>
                    <td className={`px-6 py-4 ${theme.text} font-semibold`}>
                      ${(product.priceCents / 100).toFixed(2)}
                    </td>
                    <td className={`px-6 py-4 ${theme.textSecondary}`}>
                      ⭐ {typeof product.rating === 'object' ? product.rating.stars : product.rating}/5
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => handleEdit(product)}
                          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                        >
                          ✏️ Edit
                        </button>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                        >
                          🗑️ Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 flex justify-center gap-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className={`px-4 py-2 ${theme.button} text-white rounded-lg disabled:opacity-50`}
            >
              ⬅️ Previous
            </button>
            <span className={`px-4 py-2 ${theme.text}`}>
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className={`px-4 py-2 ${theme.button} text-white rounded-lg disabled:opacity-50`}
            >
              Next ➡️
            </button>
          </div>
        )}
      </div>

      {/* Product Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className={`${theme.card} ${theme.border} rounded-3xl p-8 ${theme.shadow} w-full max-w-2xl max-h-[90vh] overflow-y-auto`}>
            <div className="flex justify-between items-center mb-6">
              <h3 className={`text-3xl font-bold ${theme.text}`}>
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className={`text-2xl ${theme.textSecondary} hover:${theme.text}`}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Product Name */}
              <div>
                <label className={`block ${theme.text} font-semibold mb-2`}>Product Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`${theme.input} w-full rounded-lg px-4 py-3`}
                  required
                />
              </div>

              {/* Price and Rating Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className={`block ${theme.text} font-semibold mb-2`}>Price (cents)</label>
                  <input
                    type="number"
                    name="priceCents"
                    value={formData.priceCents}
                    onChange={handleInputChange}
                    className={`${theme.input} w-full rounded-lg px-4 py-3`}
                    required
                    min="0"
                  />
                </div>
                <div>
                  <label className={`block ${theme.text} font-semibold mb-2`}>Rating (1-5)</label>
                  <input
                    type="number"
                    name="rating"
                    value={formData.rating}
                    onChange={handleInputChange}
                    className={`${theme.input} w-full rounded-lg px-4 py-3`}
                    required
                    min="1"
                    max="5"
                    step="0.1"
                  />
                </div>
              </div>

              {/* Category and Keywords Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className={`block ${theme.text} font-semibold mb-2`}>Category</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className={`${theme.input} w-full rounded-lg px-4 py-3`}
                    required
                  >
                    <option value="">Select Category</option>
                    <option value="Electronics">Electronics</option>
                    <option value="Fashion">Fashion</option>
                    <option value="Home & Garden">Home & Garden</option>
                    <option value="Sports">Sports</option>
                    <option value="Books">Books</option>
                    <option value="Beauty">Beauty</option>
                    <option value="Toys">Toys</option>
                    <option value="Automotive">Automotive</option>
                  </select>
                </div>
                <div>
                  <label className={`block ${theme.text} font-semibold mb-2`}>Keywords (comma-separated)</label>
                  <input
                    type="text"
                    name="keywords"
                    value={formData.keywords}
                    onChange={handleInputChange}
                    className={`${theme.input} w-full rounded-lg px-4 py-3`}
                    placeholder="laptop, computer, electronics"
                  />
                </div>
              </div>

              {/* Image Upload */}
              <div>
                <label className={`block ${theme.text} font-semibold mb-2`}>Product Image</label>
                <div className="flex gap-4 items-center">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className={`${theme.input} flex-1`}
                  />
                  {uploading && (
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                  )}
                </div>
                {formData.image && (
                  <div className="mt-4">
                    <img
                      src={formData.image.startsWith('data:') ? formData.image : `/${formData.image}`}
                      alt="Preview"
                      className="w-32 h-32 object-cover rounded-lg border-2 border-gray-300"
                    />
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 pt-6">
                <button
                  type="submit"
                  disabled={uploading}
                  className={`flex-1 ${theme.button} text-white py-3 px-6 rounded-lg font-semibold shadow-lg hover:scale-105 transition-all duration-200 disabled:opacity-50`}
                >
                  {editingProduct ? '💾 Update Product' : '➕ Create Product'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className={`px-6 py-3 ${theme.border} border ${theme.text} rounded-lg font-semibold hover:scale-105 transition-all duration-200`}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductsContent;
