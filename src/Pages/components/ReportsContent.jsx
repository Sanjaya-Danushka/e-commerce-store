import React, { useState, useEffect, useCallback } from 'react';
import adminAPI from '../../services/adminAPI';

const ReportsContent = ({ theme }) => {
  const [reportData, setReportData] = useState({
    sales: {
      totalRevenue: 0,
      totalOrders: 0,
      averageOrderValue: 0,
      salesGrowth: 0,
      monthlySales: [],
      dailySales: []
    },
    customers: {
      totalCustomers: 0,
      newCustomers: 0,
      returningCustomers: 0,
      customerGrowth: 0,
      topCustomers: []
    },
    products: {
      totalProducts: 0,
      lowStockProducts: 0,
      outOfStockProducts: 0,
      bestSellingProducts: [],
      categorySales: []
    },
    geography: {
      salesByCountry: [],
      salesByCity: [],
      topRegions: []
    }
  });

  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [dateRange, setDateRange] = useState('30d');

  // Fetch all report data
  const fetchReportData = useCallback(async () => {
    try {
      setLoading(true);

      // Fetch sales data
      const salesResponse = await adminAPI.getOrderStats();

      // Fetch customer data
      const customersResponse = await adminAPI.getStats();

      // Fetch product data
      const productsResponse = await adminAPI.getProducts({ limit: 1000 });

      // Process the data for reports
      const processedData = {
        sales: {
          totalRevenue: salesResponse.totalRevenue || 0,
          totalOrders: salesResponse.totalOrders || 0,
          averageOrderValue: salesResponse.averageOrderValue || 0,
          salesGrowth: 12.5, // Mock data - would come from API
          monthlySales: [
            { month: 'Jan', revenue: 45000, orders: 120 },
            { month: 'Feb', revenue: 52000, orders: 135 },
            { month: 'Mar', revenue: 48000, orders: 128 },
            { month: 'Apr', revenue: 61000, orders: 156 },
            { month: 'May', revenue: 55000, orders: 142 },
            { month: 'Jun', revenue: 67000, orders: 178 }
          ],
          dailySales: Array.from({ length: 30 }, (_, i) => ({
            day: `Day ${i + 1}`,
            revenue: Math.floor(Math.random() * 5000) + 1000,
            orders: Math.floor(Math.random() * 20) + 5
          }))
        },
        customers: {
          totalCustomers: customersResponse.totalUsers || 0,
          newCustomers: Math.floor((customersResponse.totalUsers || 0) * 0.3),
          returningCustomers: Math.floor((customersResponse.totalUsers || 0) * 0.7),
          customerGrowth: 8.2,
          topCustomers: [
            { name: 'John Doe', email: 'john@example.com', orders: 15, totalSpent: 2500 },
            { name: 'Jane Smith', email: 'jane@example.com', orders: 12, totalSpent: 1800 },
            { name: 'Bob Johnson', email: 'bob@example.com', orders: 10, totalSpent: 1500 },
            { name: 'Alice Brown', email: 'alice@example.com', orders: 8, totalSpent: 1200 },
            { name: 'Charlie Wilson', email: 'charlie@example.com', orders: 6, totalSpent: 900 }
          ]
        },
        products: {
          totalProducts: productsResponse.products?.length || 0,
          lowStockProducts: Math.floor((productsResponse.products?.length || 0) * 0.15),
          outOfStockProducts: Math.floor((productsResponse.products?.length || 0) * 0.05),
          bestSellingProducts: [
            { name: 'iPhone 15 Pro', sales: 145, revenue: 145000 },
            { name: 'MacBook Air M3', sales: 89, revenue: 107000 },
            { name: 'iPad Pro', sales: 67, revenue: 53600 },
            { name: 'AirPods Pro', sales: 234, revenue: 46800 },
            { name: 'Apple Watch', sales: 156, revenue: 62400 }
          ],
          categorySales: [
            { category: 'Electronics', sales: 45, revenue: 225000 },
            { category: 'Fashion', sales: 32, revenue: 64000 },
            { category: 'Home & Garden', sales: 28, revenue: 42000 },
            { category: 'Sports', sales: 18, revenue: 27000 },
            { category: 'Books', sales: 12, revenue: 18000 }
          ]
        },
        geography: {
          salesByCountry: [
            { country: 'United States', sales: 245, revenue: 490000 },
            { country: 'United Kingdom', sales: 89, revenue: 178000 },
            { country: 'Canada', sales: 67, revenue: 134000 },
            { country: 'Australia', sales: 45, revenue: 90000 },
            { country: 'Germany', sales: 38, revenue: 76000 }
          ],
          salesByCity: [
            { city: 'New York', sales: 45, revenue: 90000 },
            { city: 'Los Angeles', sales: 38, revenue: 76000 },
            { city: 'London', sales: 32, revenue: 64000 },
            { city: 'Toronto', sales: 28, revenue: 56000 },
            { city: 'Sydney', sales: 22, revenue: 44000 }
          ],
          topRegions: [
            { region: 'North America', sales: 312, revenue: 624000 },
            { region: 'Europe', sales: 127, revenue: 254000 },
            { region: 'Asia Pacific', sales: 67, revenue: 134000 },
            { region: 'Other', sales: 23, revenue: 46000 }
          ]
        }
      };

      setReportData(processedData);
    } catch (error) {
      console.error('Error fetching report data:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReportData();
  }, [fetchReportData]);

  // Format currency
  const formatCurrency = (cents) => {
    return `$${(cents / 100).toFixed(2)}`;
  };

  // Format number with commas
  const formatNumber = (num) => {
    return new Intl.NumberFormat().format(num);
  };

  return (
    <div className="space-y-10">
      <div className="flex justify-between items-center">
        <h2 className={`text-5xl font-bold ${theme.text} mb-10`}>Business Reports</h2>
        <div className="flex gap-4">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className={`${theme.input} px-4 py-2 rounded-lg`}
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
          </select>
          <button
            onClick={fetchReportData}
            className={`${theme.button} px-6 py-2 text-white rounded-lg`}
          >
            🔄 Refresh Data
          </button>
        </div>
      </div>

      {/* Report Tabs */}
      <div className={`${theme.card} ${theme.border} rounded-3xl ${theme.shadow}`}>
        <div className="flex border-b ${theme.border}">
          {[
            { id: 'overview', label: '📊 Overview', icon: '📊' },
            { id: 'sales', label: '💰 Sales', icon: '💰' },
            { id: 'customers', label: '👥 Customers', icon: '👥' },
            { id: 'products', label: '📦 Products', icon: '📦' },
            { id: 'geography', label: '🌍 Geography', icon: '🌍' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 px-6 py-4 text-sm font-medium transition-all duration-200 ${
                activeTab === tab.id
                  ? `${theme.text} border-b-2 border-blue-500 bg-blue-50`
                  : `${theme.textSecondary} hover:${theme.text} hover:bg-gray-50`
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label.split(' ')[1]}
            </button>
          ))}
        </div>

        <div className="p-8">
          {loading ? (
            <div className="text-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p className={`${theme.textSecondary}`}>Loading report data...</p>
            </div>
          ) : (
            <>
              {activeTab === 'overview' && <OverviewTab data={reportData} theme={theme} formatCurrency={formatCurrency} formatNumber={formatNumber} />}
              {activeTab === 'sales' && <SalesTab data={reportData.sales} theme={theme} formatCurrency={formatCurrency} formatNumber={formatNumber} />}
              {activeTab === 'customers' && <CustomersTab data={reportData.customers} theme={theme} formatCurrency={formatCurrency} formatNumber={formatNumber} />}
              {activeTab === 'products' && <ProductsTab data={reportData.products} theme={theme} formatCurrency={formatCurrency} formatNumber={formatNumber} />}
              {activeTab === 'geography' && <GeographyTab data={reportData.geography} theme={theme} formatCurrency={formatCurrency} formatNumber={formatNumber} />}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

// Overview Tab Component
const OverviewTab = ({ data, theme, formatCurrency, formatNumber }) => (
  <div className="space-y-8">
    {/* Key Metrics Cards */}
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div className={`${theme.card} ${theme.border} rounded-xl p-6 ${theme.shadow}`}>
        <div className="flex items-center justify-between">
          <div>
            <p className={`${theme.textSecondary} text-sm`}>Total Revenue</p>
            <p className={`text-3xl font-bold ${theme.text}`}>{formatCurrency(data.sales.totalRevenue)}</p>
            <p className={`text-sm ${data.sales.salesGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {data.sales.salesGrowth >= 0 ? '↗' : '↘'} {Math.abs(data.sales.salesGrowth)}% from last month
            </p>
          </div>
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
            💰
          </div>
        </div>
      </div>

      <div className={`${theme.card} ${theme.border} rounded-xl p-6 ${theme.shadow}`}>
        <div className="flex items-center justify-between">
          <div>
            <p className={`${theme.textSecondary} text-sm`}>Total Orders</p>
            <p className={`text-3xl font-bold ${theme.text}`}>{formatNumber(data.sales.totalOrders)}</p>
            <p className={`text-sm ${data.sales.salesGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {data.sales.salesGrowth >= 0 ? '↗' : '↘'} {Math.abs(data.sales.salesGrowth)}% from last month
            </p>
          </div>
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
            📦
          </div>
        </div>
      </div>

      <div className={`${theme.card} ${theme.border} rounded-xl p-6 ${theme.shadow}`}>
        <div className="flex items-center justify-between">
          <div>
            <p className={`${theme.textSecondary} text-sm`}>Total Customers</p>
            <p className={`text-3xl font-bold ${theme.text}`}>{formatNumber(data.customers.totalCustomers)}</p>
            <p className={`text-sm ${data.customers.customerGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {data.customers.customerGrowth >= 0 ? '↗' : '↘'} {Math.abs(data.customers.customerGrowth)}% from last month
            </p>
          </div>
          <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
            👥
          </div>
        </div>
      </div>

      <div className={`${theme.card} ${theme.border} rounded-xl p-6 ${theme.shadow}`}>
        <div className="flex items-center justify-between">
          <div>
            <p className={`${theme.textSecondary} text-sm`}>Avg Order Value</p>
            <p className={`text-3xl font-bold ${theme.text}`}>{formatCurrency(data.sales.averageOrderValue)}</p>
            <p className={`text-sm ${data.sales.salesGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {data.sales.salesGrowth >= 0 ? '↗' : '↘'} {Math.abs(data.sales.salesGrowth)}% from last month
            </p>
          </div>
          <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
            📊
          </div>
        </div>
      </div>
    </div>

    {/* Charts Row */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Monthly Sales Chart */}
      <div className={`${theme.card} ${theme.border} rounded-xl p-6 ${theme.shadow}`}>
        <h3 className={`text-xl font-bold ${theme.text} mb-4`}>Monthly Sales Trend</h3>
        <div className="h-64 flex items-end justify-between space-x-2">
          {data.sales.monthlySales.map((month) => (
            <div key={month.month} className="flex flex-col items-center flex-1">
              <div
                className="w-full bg-blue-500 rounded-t min-h-[20px] max-h-[200px] transition-all duration-300 hover:bg-blue-600"
                style={{ height: `${(month.revenue / 70000) * 100}%` }}
                title={`${month.month}: ${formatCurrency(month.revenue)}`}
              ></div>
              <span className={`text-xs ${theme.textSecondary} mt-2`}>{month.month}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Top Products */}
      <div className={`${theme.card} ${theme.border} rounded-xl p-6 ${theme.shadow}`}>
        <h3 className={`text-xl font-bold ${theme.text} mb-4`}>Best Selling Products</h3>
        <div className="space-y-3">
          {data.products.bestSellingProducts.slice(0, 5).map((product, index) => (
            <div key={product.name} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                  index === 0 ? 'bg-yellow-100 text-yellow-800' :
                  index === 1 ? 'bg-gray-100 text-gray-800' :
                  index === 2 ? 'bg-orange-100 text-orange-800' :
                  'bg-blue-100 text-blue-800'
                }`}>
                  {index + 1}
                </span>
                <span className={`${theme.text} font-medium`}>{product.name}</span>
              </div>
              <div className="text-right">
                <p className={`${theme.text} font-semibold`}>{product.sales} sales</p>
                <p className={`${theme.textSecondary} text-sm`}>{formatCurrency(product.revenue)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

// Sales Tab Component
const SalesTab = ({ data, theme, formatCurrency, formatNumber }) => (
  <div className="space-y-8">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className={`${theme.card} ${theme.border} rounded-xl p-6 ${theme.shadow}`}>
        <h3 className={`text-lg font-bold ${theme.text} mb-2`}>Total Revenue</h3>
        <p className={`text-3xl font-bold ${theme.text}`}>{formatCurrency(data.totalRevenue)}</p>
        <p className={`text-sm ${theme.textSecondary}`}>All time sales</p>
      </div>
      <div className={`${theme.card} ${theme.border} rounded-xl p-6 ${theme.shadow}`}>
        <h3 className={`text-lg font-bold ${theme.text} mb-2`}>Total Orders</h3>
        <p className={`text-3xl font-bold ${theme.text}`}>{formatNumber(data.totalOrders)}</p>
        <p className={`text-sm ${theme.textSecondary}`}>Orders placed</p>
      </div>
      <div className={`${theme.card} ${theme.border} rounded-xl p-6 ${theme.shadow}`}>
        <h3 className={`text-lg font-bold ${theme.text} mb-2`}>Average Order Value</h3>
        <p className={`text-3xl font-bold ${theme.text}`}>{formatCurrency(data.averageOrderValue)}</p>
        <p className={`text-sm ${theme.textSecondary}`}>Per order</p>
      </div>
    </div>

    {/* Sales Trend Chart */}
    <div className={`${theme.card} ${theme.border} rounded-xl p-6 ${theme.shadow}`}>
      <h3 className={`text-xl font-bold ${theme.text} mb-6`}>Sales Trend (Last 6 Months)</h3>
      <div className="h-80">
        <div className="flex h-full">
          <div className="flex flex-col justify-between text-sm ${theme.textSecondary} mr-4">
            {Array.from({ length: 6 }, (_, i) => (
              <span key={i}>${((5 - i) * 20000).toLocaleString()}</span>
            ))}
          </div>
          <div className="flex-1 flex items-end justify-between">
            {data.monthlySales.map((month) => (
              <div key={month.month} className="flex flex-col items-center flex-1 mx-1">
                <div className="w-full flex flex-col items-center">
                  <div
                    className="w-8 bg-gradient-to-t from-blue-500 to-blue-300 rounded-t transition-all duration-300"
                    style={{ height: `${(month.revenue / 70000) * 280}px` }}
                  ></div>
                  <div
                    className="w-8 bg-gradient-to-t from-green-500 to-green-300 rounded-t mt-1 transition-all duration-300"
                    style={{ height: `${(month.orders / 200) * 280}px` }}
                  ></div>
                </div>
                <span className={`text-xs ${theme.textSecondary} mt-2`}>{month.month}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="flex justify-center mt-4 space-x-6">
          <div className="flex items-center">
            <div className="w-4 h-4 bg-blue-500 rounded mr-2"></div>
            <span className={`text-sm ${theme.textSecondary}`}>Revenue</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-green-500 rounded mr-2"></div>
            <span className={`text-sm ${theme.textSecondary}`}>Orders</span>
          </div>
        </div>
      </div>
    </div>
  </div>
);

// Customers Tab Component
const CustomersTab = ({ data, theme, formatCurrency, formatNumber }) => (
  <div className="space-y-8">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className={`${theme.card} ${theme.border} rounded-xl p-6 ${theme.shadow}`}>
        <h3 className={`text-lg font-bold ${theme.text} mb-2`}>Total Customers</h3>
        <p className={`text-3xl font-bold ${theme.text}`}>{formatNumber(data.totalCustomers)}</p>
        <p className={`text-sm ${theme.textSecondary}`}>Registered users</p>
      </div>
      <div className={`${theme.card} ${theme.border} rounded-xl p-6 ${theme.shadow}`}>
        <h3 className={`text-lg font-bold ${theme.text} mb-2`}>New Customers</h3>
        <p className={`text-3xl font-bold ${theme.text}`}>{formatNumber(data.newCustomers)}</p>
        <p className={`text-sm ${theme.textSecondary}`}>This month</p>
      </div>
      <div className={`${theme.card} ${theme.border} rounded-xl p-6 ${theme.shadow}`}>
        <h3 className={`text-lg font-bold ${theme.text} mb-2`}>Returning Customers</h3>
        <p className={`text-3xl font-bold ${theme.text}`}>{formatNumber(data.returningCustomers)}</p>
        <p className={`text-sm ${theme.textSecondary}`}>Regular buyers</p>
      </div>
    </div>

    {/* Top Customers Table */}
    <div className={`${theme.card} ${theme.border} rounded-xl p-6 ${theme.shadow}`}>
      <h3 className={`text-xl font-bold ${theme.text} mb-6`}>Top Customers</h3>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className={`${theme.border} border-b`}>
              <th className={`px-4 py-3 text-left ${theme.text} font-semibold`}>Customer</th>
              <th className={`px-4 py-3 text-left ${theme.text} font-semibold`}>Orders</th>
              <th className={`px-4 py-3 text-left ${theme.text} font-semibold`}>Total Spent</th>
              <th className={`px-4 py-3 text-left ${theme.text} font-semibold`}>Status</th>
            </tr>
          </thead>
          <tbody>
            {data.topCustomers.map((customer) => (
              <tr key={customer.email} className={`${theme.border} border-b`}>
                <td className={`px-4 py-3 ${theme.text}`}>
                  <div>
                    <p className="font-medium">{customer.name}</p>
                    <p className={`${theme.textSecondary} text-sm`}>{customer.email}</p>
                  </div>
                </td>
                <td className={`px-4 py-3 ${theme.text} font-medium`}>{customer.orders}</td>
                <td className={`px-4 py-3 ${theme.text} font-medium`}>{formatCurrency(customer.totalSpent * 100)}</td>
                <td className={`px-4 py-3`}>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    customer.orders > 10 ? 'bg-green-100 text-green-800' :
                    customer.orders > 5 ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {customer.orders > 10 ? 'VIP' : customer.orders > 5 ? 'Regular' : 'New'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
);

// Products Tab Component
const ProductsTab = ({ data, theme, formatCurrency, formatNumber }) => (
  <div className="space-y-8">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className={`${theme.card} ${theme.border} rounded-xl p-6 ${theme.shadow}`}>
        <h3 className={`text-lg font-bold ${theme.text} mb-2`}>Total Products</h3>
        <p className={`text-3xl font-bold ${theme.text}`}>{formatNumber(data.totalProducts)}</p>
        <p className={`text-sm ${theme.textSecondary}`}>In catalog</p>
      </div>
      <div className={`${theme.card} ${theme.border} rounded-xl p-6 ${theme.shadow}`}>
        <h3 className={`text-lg font-bold ${theme.text} mb-2`}>Low Stock</h3>
        <p className={`text-3xl font-bold ${theme.text} text-orange-600`}>{formatNumber(data.lowStockProducts)}</p>
        <p className={`text-sm ${theme.textSecondary}`}>Need restocking</p>
      </div>
      <div className={`${theme.card} ${theme.border} rounded-xl p-6 ${theme.shadow}`}>
        <h3 className={`text-lg font-bold ${theme.text} mb-2`}>Out of Stock</h3>
        <p className={`text-3xl font-bold ${theme.text} text-red-600`}>{formatNumber(data.outOfStockProducts)}</p>
        <p className={`text-sm ${theme.textSecondary}`}>Unavailable</p>
      </div>
    </div>

    {/* Best Selling Products */}
    <div className={`${theme.card} ${theme.border} rounded-xl p-6 ${theme.shadow}`}>
      <h3 className={`text-xl font-bold ${theme.text} mb-6`}>Best Selling Products</h3>
      <div className="space-y-4">
        {data.bestSellingProducts.map((product, index) => (
          <div key={product.name} className="flex items-center justify-between p-4 ${theme.border} border rounded-lg">
            <div className="flex items-center space-x-4">
              <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                index === 0 ? 'bg-yellow-100 text-yellow-800' :
                index === 1 ? 'bg-gray-100 text-gray-800' :
                index === 2 ? 'bg-orange-100 text-orange-800' :
                'bg-blue-100 text-blue-800'
              }`}>
                {index + 1}
              </span>
              <div>
                <p className={`${theme.text} font-medium`}>{product.name}</p>
                <p className={`${theme.textSecondary} text-sm`}>{product.sales} units sold</p>
              </div>
            </div>
            <div className="text-right">
              <p className={`${theme.text} font-bold`}>{formatCurrency(product.revenue)}</p>
              <p className={`${theme.textSecondary} text-sm`}>Revenue</p>
            </div>
          </div>
        ))}
      </div>
    </div>

    {/* Category Sales */}
    <div className={`${theme.card} ${theme.border} rounded-xl p-6 ${theme.shadow}`}>
      <h3 className={`text-xl font-bold ${theme.text} mb-6`}>Sales by Category</h3>
      <div className="space-y-4">
        {data.categorySales.map((category) => (
          <div key={category.category} className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <span className={`${theme.text} font-medium`}>{category.category}</span>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-32 bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(category.sales / Math.max(...data.categorySales.map(c => c.sales))) * 100}%` }}
                ></div>
              </div>
              <span className={`${theme.text} font-medium w-16 text-right`}>{category.sales}%</span>
              <span className={`${theme.text} font-bold w-20 text-right`}>{formatCurrency(category.revenue)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// Geography Tab Component
const GeographyTab = ({ data, theme, formatCurrency, formatNumber }) => (
  <div className="space-y-8">
    {/* Sales by Country */}
    <div className={`${theme.card} ${theme.border} rounded-xl p-6 ${theme.shadow}`}>
      <h3 className={`text-xl font-bold ${theme.text} mb-6`}>Sales by Country</h3>
      <div className="space-y-4">
        {data.salesByCountry.map((country) => (
          <div key={country.country} className="flex items-center justify-between p-4 ${theme.border} border rounded-lg">
            <div className="flex items-center space-x-4">
              <div className={`w-10 h-6 rounded ${country.country === 'United States' ? 'bg-red-500' :
                country.country === 'United Kingdom' ? 'bg-blue-500' :
                country.country === 'Canada' ? 'bg-red-400' :
                country.country === 'Australia' ? 'bg-blue-600' : 'bg-gray-400'}`}></div>
              <span className={`${theme.text} font-medium`}>{country.country}</span>
            </div>
            <div className="flex items-center space-x-4">
              <span className={`${theme.text} font-medium`}>{formatNumber(country.sales)} sales</span>
              <span className={`${theme.text} font-bold`}>{formatCurrency(country.revenue)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>

    {/* Top Regions */}
    <div className={`${theme.card} ${theme.border} rounded-xl p-6 ${theme.shadow}`}>
      <h3 className={`text-xl font-bold ${theme.text} mb-6`}>Sales by Region</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {data.topRegions.map((region) => (
          <div key={region.region} className="p-4 ${theme.border} border rounded-lg">
            <h4 className={`${theme.text} font-bold text-lg mb-2`}>{region.region}</h4>
            <div className="flex justify-between items-center">
              <span className={`${theme.textSecondary}`}>{formatNumber(region.sales)} sales</span>
              <span className={`${theme.text} font-bold`}>{formatCurrency(region.revenue)}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div
                className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(region.sales / Math.max(...data.topRegions.map(r => r.sales))) * 100}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default ReportsContent;
