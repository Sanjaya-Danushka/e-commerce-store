import React, { useState, useEffect } from 'react';

const AdminsContent = ({ theme }) => {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState(null);

  // Fetch admins function
  const fetchAdmins = async (page = 1, search = '') => {
    try {
      setLoading(true);
      const response = await fetch(`/api/admin/users?page=${page}&limit=10&role=admin${search ? `&search=${search}` : ''}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch admins');
      }

      const data = await response.json();
      setAdmins(data.users);
      setTotalPages(data.pagination.pages);
      setCurrentPage(page);
    } catch (error) {
      console.error('Error fetching admins:', error);
      if (error.response?.status === 401) {
        window.location.href = '/admin/login';
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins(currentPage, searchTerm);
  }, [currentPage, searchTerm]);

  // Handle search input
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  // Open modal for edit
  const openModal = (admin = null) => {
    if (admin) {
      setEditingAdmin(admin);
    } else {
      setEditingAdmin(null);
    }
    setShowModal(true);
  };

  // Close modal
  const closeModal = () => {
    setShowModal(false);
    setEditingAdmin(null);
  };

  // Handle admin deletion
  const handleDelete = async (adminId) => {
    if (!window.confirm('Are you sure you want to delete this admin account?')) return;

    try {
      const response = await fetch(`/api/admin/users/${adminId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete admin');
      }

      fetchAdmins(currentPage, searchTerm);
    } catch (error) {
      console.error('Error deleting admin:', error);
      alert('Error deleting admin');
    }
  };

  return (
    <div className="space-y-10">
      <div className="flex justify-between items-center">
        <h2 className={`text-5xl font-bold ${theme.text} mb-10`}>Admin Management</h2>
      </div>

      {/* Controls */}
      <div className="mb-5 flex gap-6 items-center">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search admins..."
            value={searchTerm}
            onChange={handleSearch}
            className={`w-full px-6 py-4 ${theme.input} ${theme.border} rounded-2xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 ${theme.text} placeholder:${theme.textSecondary}`}
          />
        </div>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="text-center py-20">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-red-600 mx-auto mb-8"></div>
          <div className={`${theme.textSecondary} text-lg`}>Loading admins...</div>
        </div>
      ) : (
        <>
          {/* Admins Table */}
          <div className={`${theme.card} ${theme.border} rounded-3xl ${theme.shadow} overflow-hidden`}>
            <div className="overflow-hidden">
              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50/50">
                  <tr>
                    <th className={`px-8 py-5 text-left text-sm font-semibold ${theme.textSecondary} uppercase tracking-wider`}>
                      Admin
                    </th>
                    <th className={`px-8 py-5 text-left text-sm font-semibold ${theme.textSecondary} uppercase tracking-wider`}>
                      Email
                    </th>
                    <th className={`px-8 py-5 text-left text-sm font-semibold ${theme.textSecondary} uppercase tracking-wider`}>
                      Phone
                    </th>
                    <th className={`px-8 py-5 text-left text-sm font-semibold ${theme.textSecondary} uppercase tracking-wider`}>
                      Status
                    </th>
                    <th className={`px-8 py-5 text-left text-sm font-semibold ${theme.textSecondary} uppercase tracking-wider`}>
                      Joined
                    </th>
                    <th className={`px-8 py-5 text-right text-sm font-semibold ${theme.textSecondary} uppercase tracking-wider`}>
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className={`divide-y ${theme.border}`}>
                  {admins.map((admin) => (
                    <tr key={admin.id} className={`hover:bg-slate-50/30 transition-colors duration-200`}>
                      <td className="px-8 py-6 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-14 w-14 relative">
                            <img
                              className="h-14 w-14 rounded-full object-cover border-2 border-slate-200 transition-opacity duration-300"
                              src={admin.profilePicture || '/images/mobile-logo.png'}
                              alt={`${admin.firstName} ${admin.lastName}`}
                              onError={(e) => {
                                e.target.style.opacity = '0';
                              }}
                              loading="lazy"
                            />
                            <div
                              className={`absolute inset-0 h-14 w-14 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold text-lg border-2 border-slate-200 transition-opacity duration-300 ${
                                admin.profilePicture ? 'opacity-0' : 'opacity-100'
                              }`}
                            >
                              {(admin.firstName?.[0] || admin.lastName?.[0] || admin.email?.[0] || '?').toUpperCase()}
                            </div>
                          </div>
                          <div className="ml-5">
                            <div className={`text-base font-semibold ${theme.text}`}>
                              {admin.firstName && admin.lastName
                                ? `${admin.firstName} ${admin.lastName}`
                                : 'N/A'
                              }
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className={`px-8 py-6 whitespace-nowrap text-base ${theme.text}`}>
                        {admin.email}
                      </td>
                      <td className={`px-8 py-6 whitespace-nowrap text-base ${theme.textSecondary}`}>
                        {admin.phoneNumber || 'N/A'}
                      </td>
                      <td className="px-8 py-6 whitespace-nowrap">
                        <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${
                          admin.isEmailVerified
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {admin.isEmailVerified ? 'Verified' : 'Unverified'}
                        </span>
                      </td>
                      <td className={`px-8 py-6 whitespace-nowrap text-base ${theme.textSecondary}`}>
                        {new Date(admin.createdAt).toLocaleDateString()}
                      </td>
                      <td className={`px-8 py-6 whitespace-nowrap text-right text-base font-medium`}>
                        <button
                          onClick={() => openModal(admin)}
                          className="text-blue-600 hover:text-blue-900 mr-5 transition-colors duration-200"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(admin.id)}
                          className="text-red-600 hover:text-red-900 transition-colors duration-200"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          <div className="flex justify-center gap-3 mt-8">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                className={`px-5 py-3 rounded-2xl text-base font-medium transition-all duration-200 ${
                  page === currentPage
                    ? `bg-gradient-to-r ${theme.button} text-white shadow-lg`
                    : `${theme.hover} ${theme.text}`
                }`}
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </button>
            ))}
          </div>
        </>
      )}

      {/* Edit Admin Modal */}
      {showModal && editingAdmin && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-6">
          <div className={`${theme.card} ${theme.border} rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto ${theme.shadow}`}>
            <div className="p-10">
              <h2 className={`text-3xl font-bold ${theme.text} mb-8`}>Edit Admin</h2>

              <form>
                <div className="grid grid-cols-2 gap-8 mb-8">
                  <div>
                    <label className={`block text-base font-medium ${theme.textSecondary} mb-3`}>First Name:</label>
                    <input
                      type="text"
                      defaultValue={editingAdmin.firstName || ''}
                      className={`w-full px-5 py-4 ${theme.input} ${theme.border} rounded-2xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 ${theme.text}`}
                      placeholder="First Name"
                    />
                  </div>
                  <div>
                    <label className={`block text-base font-medium ${theme.textSecondary} mb-3`}>Last Name:</label>
                    <input
                      type="text"
                      defaultValue={editingAdmin.lastName || ''}
                      className={`w-full px-5 py-4 ${theme.input} ${theme.border} rounded-2xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 ${theme.text}`}
                      placeholder="Last Name"
                    />
                  </div>
                </div>

                <div className="mb-8">
                  <label className={`block text-base font-medium ${theme.textSecondary} mb-3`}>Email:</label>
                  <input
                    type="email"
                    defaultValue={editingAdmin.email}
                    className={`w-full px-5 py-4 ${theme.border} rounded-2xl bg-slate-50 ${theme.text}`}
                    readOnly
                  />
                  <p className={`text-sm ${theme.textSecondary} mt-2`}>Email cannot be changed</p>
                </div>

                <div className="mb-8">
                  <label className={`block text-base font-medium ${theme.textSecondary} mb-3`}>Phone Number:</label>
                  <input
                    type="tel"
                    defaultValue={editingAdmin.phoneNumber || ''}
                    className={`w-full px-5 py-4 ${theme.input} ${theme.border} rounded-2xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 ${theme.text}`}
                    placeholder="Phone Number"
                  />
                </div>

                <div className="mb-10">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      defaultChecked={editingAdmin.isEmailVerified}
                      className="w-6 h-6 rounded-lg border-2 border-slate-300 text-red-600 focus:ring-red-500"
                    />
                    <span className={`ml-4 text-base font-medium ${theme.text}`}>Email Verified</span>
                  </label>
                </div>

                <div className="flex gap-5 justify-end">
                  <button
                    type="button"
                    onClick={closeModal}
                    className={`px-8 py-4 ${theme.border} ${theme.text} rounded-2xl hover:bg-slate-50 transition-all duration-200 font-semibold`}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className={`px-8 py-4 bg-gradient-to-r ${theme.button} text-white rounded-2xl hover:scale-105 transition-all duration-200 shadow-lg font-semibold`}
                  >
                    Update Admin
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

export default AdminsContent;
