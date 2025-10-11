import React, { useState, useEffect } from 'react';
import adminAPI from '../services/adminAPI';

const AdminPage = () => {
  // State variables
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    image: '',
    rating: { stars: 0, count: 0 },
    priceCents: 0,
    keywords: [],
    category: 'All Categories'
  });

  // Fetch products function
  const fetchProducts = async (page = 1, search = '') => {
    try {
      setLoading(true);
      const response = await adminAPI.getProducts({ page, search });
      setProducts(response.data.products);
      setTotalPages(response.data.pagination.pages);
      setCurrentPage(page);
    } catch (error) {
      console.error('Error fetching products:', error);
      if (error.response?.status === 401) {
        window.location.href = '/admin/login';
      }
    } finally {
      setLoading(false);
    }
  };

  // Load products on component mount and when page/search changes
  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      window.location.href = '/admin/login';
      return;
    }
    fetchProducts(currentPage, searchTerm);
  }, [currentPage, searchTerm]);

  // Handle search input
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  // Open modal for add/edit
  const openModal = (product = null) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name,
        image: product.image,
        rating: product.rating,
        priceCents: product.priceCents,
        keywords: product.keywords,
        category: product.category || 'All Categories'
      });
    } else {
      setEditingProduct(null);
      setFormData({
        name: '',
        image: '',
        rating: { stars: 0, count: 0 },
        priceCents: 0,
        keywords: [],
        category: 'All Categories'
      });
    }
    setShowModal(true);
  };

  // Close modal
  const closeModal = () => {
    setShowModal(false);
    setEditingProduct(null);
    setFormData({
      name: '',
      image: '',
      rating: { stars: 0, count: 0 },
      priceCents: 0,
      keywords: [],
      category: 'All Categories'
    });
  };

  // Handle image upload
  const handleImageUpload = async (file) => {
    if (!file) return;

    setUploading(true);
    try {
      const response = await adminAPI.uploadImage(file);
      setFormData({
        ...formData,
        image: response.data.imagePath
      });
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Error uploading image');
    } finally {
      setUploading(false);
    }
  };

  // Drag and drop handlers
  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleImageUpload(files[0]);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleImageUpload(file);
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingProduct) {
        await adminAPI.updateProduct(editingProduct.id, formData);
      } else {
        await adminAPI.createProduct(formData);
      }
      closeModal();
      fetchProducts(currentPage, searchTerm);
    } catch (error) {
      console.error('Error saving product:', error);
      alert('Error saving product. Please check the form data.');
    }
  };

  // Handle product deletion
  const handleDelete = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;

    try {
      await adminAPI.deleteProduct(productId);
      fetchProducts(currentPage, searchTerm);
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Error deleting product');
    }
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    window.location.href = '/admin/login';
  };

  return (
    <div className="min-h-screen bg-gray-100 p-5">
      {/* Header */}
      <header className="bg-white rounded-lg shadow-md p-5 mb-5 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Admin Panel - Product Management</h1>
        <button
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md font-medium"
          onClick={handleLogout}
        >
          Logout
        </button>
      </header>

      {/* Controls */}
      <div className="mb-5 flex gap-4 items-center">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={handleSearch}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md font-medium"
          onClick={() => openModal()}
        >
          Add New Product
        </button>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="text-center py-10">
          <div className="text-lg text-gray-600">Loading products...</div>
        </div>
      ) : (
        <>
          {/* Products Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
            {products.map((product) => (
              <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <img
                  src={`/${product.image}`}
                  alt={product.name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">{product.name}</h3>
                  <p className="text-xl font-bold text-green-600 mb-2">
                    ${(product.priceCents / 100).toFixed(2)}
                  </p>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-yellow-500">★</span>
                    <span className="text-sm text-gray-600">
                      {product.rating.stars} ({product.rating.count} reviews)
                    </span>
                  </div>
                  <div className="text-xs text-gray-500 mb-4">
                    {product.keywords.join(', ')}
                  </div>
                  <div className="text-xs text-blue-600 font-medium mb-4">
                    📦 {product.category}
                  </div>
                </div>
                <div className="px-4 pb-4 flex gap-2">
                  <button
                    className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 px-3 rounded-md text-sm font-medium"
                    onClick={() => openModal(product)}
                  >
                    Edit
                  </button>
                  <button
                    className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 px-3 rounded-md text-sm font-medium"
                    onClick={() => handleDelete(product.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex justify-center gap-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                className={`px-3 py-2 border rounded-md text-sm font-medium ${
                  page === currentPage
                    ? 'bg-blue-500 text-white border-blue-500'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                }`}
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </button>
            ))}
          </div>
        </>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </h2>

              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Name:</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category:</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="All Categories">📦 All Categories</option>
                    <option value="Electronics">📱 Electronics</option>
                    <option value="Fashion">👕 Fashion</option>
                    <option value="Home & Garden">🏠 Home & Garden</option>
                    <option value="Sports">⚽ Sports</option>
                    <option value="Books">📚 Books</option>
                  </select>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Product Image:</label>

                  {/* Image Preview */}
                  {formData.image && (
                    <div className="mb-3">
                      <img
                        src={`/${formData.image}`}
                        alt="Product preview"
                        className="w-32 h-32 object-cover rounded-md border"
                      />
                    </div>
                  )}

                  {/* Drag and Drop Upload Area */}
                  <div
                    className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                      dragOver ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
                    }`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                  >
                    <div className="space-y-2">
                      <div className="text-gray-600">
                        {uploading ? 'Uploading...' : 'Drag and drop an image here, or click to select'}
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileSelect}
                        className="hidden"
                        id="image-upload"
                      />
                      <label
                        htmlFor="image-upload"
                        className="inline-block bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md cursor-pointer"
                      >
                        Choose File
                      </label>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Price (cents):</label>
                    <input
                      type="number"
                      value={formData.priceCents}
                      onChange={(e) => setFormData({...formData, priceCents: parseInt(e.target.value) || 0})}
                      min="0"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Rating Stars:</label>
                    <input
                      type="number"
                      value={formData.rating.stars}
                      onChange={(e) => setFormData({
                        ...formData,
                        rating: {...formData.rating, stars: parseFloat(e.target.value) || 0}
                      })}
                      min="0"
                      max="5"
                      step="0.1"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Rating Count:</label>
                    <input
                      type="number"
                      value={formData.rating.count}
                      onChange={(e) => setFormData({
                        ...formData,
                        rating: {...formData.rating, count: parseInt(e.target.value) || 0}
                      })}
                      min="0"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Keywords (comma-separated):
                  </label>
                  <input
                    type="text"
                    value={Array.isArray(formData.keywords) ? formData.keywords.join(', ') : formData.keywords}
                    onChange={(e) => setFormData({
                      ...formData,
                      keywords: e.target.value.split(',').map(k => k.trim()).filter(k => k)
                    })}
                    placeholder="sports, apparel, shoes"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="flex gap-3 justify-end">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-md font-medium"
                  >
                    {editingProduct ? 'Update' : 'Create'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPage;
