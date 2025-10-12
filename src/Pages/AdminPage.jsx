import React, { useState, useEffect } from 'react';
import adminAPI from '../services/adminAPI';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line, Bar, Pie, Doughnut } from 'react-chartjs-2';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import enUS from 'date-fns/locale/en-US';
import 'react-big-calendar/lib/css/react-big-calendar.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

// Setup the localizer for react-big-calendar
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales: {
    'en-US': enUS,
  },
});

const AdminDashboard = () => {
  // State management
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('adminDarkMode');
    return saved ? JSON.parse(saved) : false;
  });
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalUsers: 0,
    totalOrders: 0,
    totalRevenue: 0,
    recentOrders: []
  });
  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState(null);
  const [todoItems, setTodoItems] = useState([
    { id: 1, title: 'Review new product submissions', completed: false, priority: 'high', category: 'product' },
    { id: 2, title: 'Check customer support tickets', completed: false, priority: 'medium', category: 'support' },
    { id: 3, title: 'Update inventory levels', completed: true, priority: 'low', category: 'inventory' },
    { id: 4, title: 'Generate monthly sales report', completed: false, priority: 'high', category: 'analytics' },
    { id: 5, title: 'Schedule social media posts', completed: false, priority: 'medium', category: 'marketing' },
  ]);

  // Enhanced color schemes with glass morphism
  const themes = {
    light: {
      name: 'Light',
      primary: 'from-blue-600 via-indigo-600 to-purple-600',
      secondary: 'from-emerald-500 via-teal-500 to-cyan-500',
      accent: 'from-rose-500 via-pink-500 to-fuchsia-500',
      warning: 'from-amber-500 via-yellow-500 to-orange-500',
      background: 'bg-gradient-to-br from-slate-50 via-white to-slate-100',
      card: 'bg-white/70 backdrop-blur-2xl border border-white/20 shadow-2xl shadow-slate-900/10',
      sidebar: 'bg-white/80 backdrop-blur-2xl border-r border-white/30 shadow-2xl',
      text: 'text-slate-900',
      textSecondary: 'text-slate-600',
      textMuted: 'text-slate-500',
      hover: 'hover:bg-white/80 hover:scale-105',
      border: 'border-slate-200/50',
      input: 'bg-white/50 border-slate-200 focus:border-blue-500 focus:ring-blue-500/20',
      button: 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700',
      shadow: 'shadow-xl shadow-slate-900/10'
    },
    dark: {
      name: 'Dark',
      primary: 'from-blue-400 via-indigo-400 to-purple-400',
      secondary: 'from-emerald-400 via-teal-400 to-cyan-400',
      accent: 'from-rose-400 via-pink-400 to-fuchsia-400',
      warning: 'from-amber-400 via-yellow-400 to-orange-400',
      background: 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900',
      card: 'bg-slate-800/70 backdrop-blur-2xl border border-slate-700/50 shadow-2xl shadow-slate-900/30',
      sidebar: 'bg-slate-900/80 backdrop-blur-2xl border-r border-slate-700/50 shadow-2xl',
      text: 'text-slate-100',
      textSecondary: 'text-slate-300',
      textMuted: 'text-slate-400',
      hover: 'hover:bg-slate-700/80 hover:scale-105',
      border: 'border-slate-700/50',
      input: 'bg-slate-800/50 border-slate-600 focus:border-blue-400 focus:ring-blue-400/20',
      button: 'bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600',
      shadow: 'shadow-2xl shadow-slate-900/30'
    }
  };

  const theme = isDarkMode ? themes.dark : themes.light;

  // Navigation configuration
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊', color: 'bg-blue-500 hover:bg-blue-600', description: 'Overview & Stats' },
    { id: 'analytics', label: 'Analytics', icon: '📈', color: 'bg-purple-500 hover:bg-purple-600', description: 'Charts & Insights' },
    { id: 'calendar', label: 'Calendar', icon: '📅', color: 'bg-green-500 hover:bg-green-600', description: 'Schedule & Events' },
    { id: 'tasks', label: 'Tasks', icon: '✅', color: 'bg-orange-500 hover:bg-orange-600', description: 'Task Management' },
    { id: 'products', label: 'Products', icon: '📦', color: 'bg-pink-500 hover:bg-pink-600', description: 'Inventory Control' },
    { id: 'customers', label: 'Customers', icon: '👥', color: 'bg-indigo-500 hover:bg-indigo-600', description: 'User Management' },
    { id: 'orders', label: 'Orders', icon: '🛒', color: 'bg-emerald-500 hover:bg-emerald-600', description: 'Order Processing' },
    { id: 'reports', label: 'Reports', icon: '📋', color: 'bg-amber-500 hover:bg-amber-600', description: 'Business Reports' },
  ];

  // Dark mode toggle
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    localStorage.setItem('adminDarkMode', JSON.stringify(!isDarkMode));
  };

  // Fetch dashboard data
  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getStats();
      setStats(prev => ({
        ...prev,
        totalProducts: response.totalProducts || 0,
        totalUsers: response.totalUsers || 0,
        totalOrders: response.totalOrders || 0,
        totalRevenue: response.totalRevenue || 0,
        recentProducts: response.recentProducts || 0
      }));

      // Enhanced chart data with gradients and animations
      setChartData({
        revenue: {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
          datasets: [{
            label: 'Revenue ($)',
            data: [12000, 19000, 15000, 25000, 22000, 30000, 35000],
            borderColor: isDarkMode ? 'rgba(59, 130, 246, 0.8)' : 'rgba(59, 130, 246, 1)',
            backgroundColor: isDarkMode
              ? 'linear-gradient(135deg, rgba(59, 130, 246, 0.3), rgba(147, 197, 253, 0.1))'
              : 'linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(147, 197, 253, 0.05))',
            fill: true,
            tension: 0.4,
            pointBackgroundColor: 'rgba(59, 130, 246, 1)',
            pointBorderColor: '#fff',
            pointBorderWidth: 3,
            pointRadius: 6,
            pointHoverRadius: 10,
            animation: {
              duration: 2000,
              easing: 'easeInOutQuart'
            }
          }]
        },
        users: {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
          datasets: [{
            label: 'New Users',
            data: [120, 150, 180, 200, 240, 280, 320],
            borderColor: isDarkMode ? 'rgba(16, 185, 129, 0.8)' : 'rgba(16, 185, 129, 1)',
            backgroundColor: isDarkMode
              ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.3), rgba(110, 231, 183, 0.1))'
              : 'linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(110, 231, 183, 0.05))',
            fill: true,
            tension: 0.4,
            pointBackgroundColor: 'rgba(16, 185, 129, 1)',
            pointBorderColor: '#fff',
            pointBorderWidth: 3,
            pointRadius: 6,
            pointHoverRadius: 10,
          }]
        },
        orders: {
          labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
          datasets: [{
            label: 'Orders',
            data: [45, 52, 38, 67, 49, 23, 31],
            backgroundColor: isDarkMode
              ? 'rgba(168, 85, 247, 0.7)'
              : 'rgba(168, 85, 247, 0.8)',
            borderRadius: 12,
            borderSkipped: false,
            hoverBackgroundColor: isDarkMode
              ? 'rgba(168, 85, 247, 0.9)'
              : 'rgba(168, 85, 247, 1)',
          }]
        },
        categories: {
          labels: ['Electronics', 'Fashion', 'Home & Garden', 'Sports', 'Books', 'Beauty'],
          datasets: [{
            data: [35, 25, 20, 15, 4, 1],
            backgroundColor: [
              'rgba(59, 130, 246, 0.9)',
              'rgba(16, 185, 129, 0.9)',
              'rgba(245, 158, 11, 0.9)',
              'rgba(239, 68, 68, 0.9)',
              'rgba(139, 92, 246, 0.9)',
              'rgba(236, 72, 153, 0.9)',
            ],
            borderWidth: 0,
            hoverOffset: 12,
            cutout: '60%',
          }]
        },
        conversion: {
          labels: ['Visitors', 'Leads', 'Customers', 'Repeat Customers'],
          datasets: [{
            data: [10000, 2500, 800, 320],
            backgroundColor: [
              'rgba(59, 130, 246, 0.8)',
              'rgba(16, 185, 129, 0.8)',
              'rgba(245, 158, 11, 0.8)',
              'rgba(236, 72, 153, 0.8)',
            ],
            borderWidth: 0,
            hoverOffset: 8,
          }]
        }
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      window.location.href = '/admin/login';
      return;
    }
    fetchStats();
  }, [isDarkMode]);

  // Logout handler
  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminDarkMode');
    window.location.href = '/admin/login';
  };

  // Todo management
  const toggleTodo = (id) => {
    setTodoItems(items =>
      items.map(item =>
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    );
  };

  const addTodo = (title, priority = 'medium', category = 'general') => {
    const newTodo = {
      id: Date.now(),
      title,
      completed: false,
      priority,
      category
    };
    setTodoItems([...todoItems, newTodo]);
  };

  // Render content based on active tab
  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardContent stats={stats} loading={loading} todoItems={todoItems} onToggleTodo={toggleTodo} theme={theme} isDarkMode={isDarkMode} />;
      case 'analytics':
        return <AnalyticsContent chartData={chartData} loading={loading} theme={theme} />;
      case 'calendar':
        return <CalendarContent theme={theme} isDarkMode={isDarkMode} />;
      case 'tasks':
        return <TasksContent todoItems={todoItems} onToggleTodo={toggleTodo} onAddTodo={addTodo} theme={theme} isDarkMode={isDarkMode} />;
      case 'products':
        return <ProductsContent theme={theme} />;
      case 'customers':
        return <CustomersContent theme={theme} />;
      case 'orders':
        return <OrdersContent theme={theme} />;
      case 'reports':
        return <ReportsContent theme={theme} />;
      default:
        return <DashboardContent stats={stats} loading={loading} todoItems={todoItems} onToggleTodo={toggleTodo} theme={theme} isDarkMode={isDarkMode} />;
    }
  };

  return (
    <div className={`min-h-screen ${theme.background} transition-all duration-700`}>
      {/* Sidebar */}
      <div className={`fixed left-0 top-0 h-full w-80 ${theme.sidebar} ${theme.shadow} z-50`}>
        <div className="flex flex-col h-full p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-12">
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <a className="flex items-center" href="/" data-discover="true">
                  <div className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center mr-3">
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 2L3 7v11a2 2 0 002 2h10a2 2 0 002-2V7l-7-5z" clipRule="evenodd"></path>
                    </svg>
                  </div>
                  <span className="text-xl font-bold text-gray-900">ShopEase</span>
                </a>
                isDarkMode ? 'right-0.5 bg-slate-800' : 'left-0.5 bg-white'
              } shadow-lg flex items-center justify-center`}>
                {isDarkMode ? '🌙' : '☀️'}
              </div>
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center space-x-4 px-6 py-4 rounded-2xl text-left transition-all duration-300 group relative overflow-hidden ${
                  activeTab === item.id
                    ? `bg-gradient-to-r ${theme.primary} text-white shadow-xl transform scale-105`
                    : `${theme.hover} ${theme.text} hover:scale-102`
                }`}
              >
                <div className={`w-12 h-12 rounded-xl ${item.color} flex items-center justify-center text-white shadow-sm text-lg`}>
                  {item.icon}
                </div>
                <div className="flex-1">
                  <div className="font-semibold">{item.label}</div>
                  <div className={`text-xs ${activeTab === item.id ? 'text-white/80' : theme.textSecondary}`}>
                    {item.description}
                  </div>
                </div>
                {activeTab === item.id && (
                  <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent animate-pulse"></div>
                )}
              </button>
            ))}
          </nav>

          {/* Footer */}
          <div className={`${theme.border} border-t pt-8`}>
            <button
              onClick={handleLogout}
              className={`w-full flex items-center space-x-4 px-6 py-4 rounded-2xl text-left transition-all duration-300 ${theme.hover} text-red-500 hover:scale-102`}
            >
              <div className="w-12 h-12 bg-red-500 rounded-xl flex items-center justify-center text-white shadow-sm">
                🚪
              </div>
              <span className="font-semibold">Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="ml-80 min-h-screen">
        <div className="p-10">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

// Dashboard Content Component
const DashboardContent = ({ stats, loading, todoItems, onToggleTodo, theme, isDarkMode }) => {
  const pendingTasks = todoItems.filter(item => !item.completed).length;
  const completedTasks = todoItems.filter(item => item.completed).length;

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className={`text-5xl font-bold ${theme.text} mb-3`}>Dashboard Overview</h2>
          <p className={`${theme.textSecondary} text-lg`}>Welcome back! Here's what's happening with your business today.</p>
        </div>
        <div className={`flex items-center space-x-6 p-6 ${theme.card} ${theme.border} rounded-3xl ${theme.shadow}`}>
          <div className="text-center">
            <div className={`text-3xl font-bold ${theme.text} mb-1`}>{pendingTasks}</div>
            <div className={`text-sm ${theme.textSecondary}`}>Pending Tasks</div>
          </div>
          <div className="w-px h-12 bg-slate-300"></div>
          <div className="text-center">
            <div className={`text-3xl font-bold ${theme.text} mb-1`}>{completedTasks}</div>
            <div className={`text-sm ${theme.textSecondary}`}>Completed</div>
          </div>
          <div className="w-px h-12 bg-slate-300"></div>
          <div className="text-center">
            <div className={`text-3xl font-bold ${theme.text} mb-1`}>{Math.round((completedTasks / todoItems.length) * 100)}%</div>
            <div className={`text-sm ${theme.textSecondary}`}>Progress</div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className={`${theme.card} ${theme.border} rounded-3xl p-8 animate-pulse`}>
              <div className="flex items-center justify-between">
                <div className="space-y-4">
                  <div className="h-5 bg-slate-300 rounded w-32"></div>
                  <div className="h-8 bg-slate-300 rounded w-20"></div>
                </div>
                <div className="w-20 h-20 bg-slate-300 rounded-2xl"></div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { title: 'Total Products', value: stats.totalProducts, icon: '📦', color: 'from-blue-500 to-blue-600', trend: '+12%' },
            { title: 'Total Users', value: stats.totalUsers, icon: '👥', color: 'from-green-500 to-green-600', trend: '+8%' },
            { title: 'Total Orders', value: stats.totalOrders, icon: '🛒', color: 'from-purple-500 to-purple-600', trend: '+15%' },
            { title: 'Revenue', value: `$${(stats.totalRevenue / 100).toFixed(2)}`, icon: '💰', color: 'from-yellow-500 to-orange-500', trend: '+22%' },
          ].map((stat, index) => (
            <div key={index} className={`${theme.card} ${theme.border} rounded-3xl p-8 hover:scale-105 transition-all duration-300 ${theme.shadow} group cursor-pointer`}>
              <div className="flex items-center justify-between">
                <div className="space-y-3">
                  <p className={`text-sm font-medium ${theme.textSecondary}`}>{stat.title}</p>
                  <p className={`text-4xl font-bold ${theme.text}`}>{stat.value}</p>
                  <div className={`flex items-center space-x-2 text-sm ${theme.textMuted}`}>
                    <span className="text-green-500">↗</span>
                    <span>{stat.trend}</span>
                    <span>vs last month</span>
                  </div>
                </div>
                <div className={`w-20 h-20 bg-gradient-to-br ${stat.color} rounded-2xl flex items-center justify-center text-3xl shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  {stat.icon}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Charts and Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Mini Chart */}
        <div className={`lg:col-span-2 ${theme.card} ${theme.border} rounded-3xl p-8 ${theme.shadow}`}>
          <h3 className={`text-xl font-semibold ${theme.text} mb-6`}>Revenue Trend</h3>
          <div className="h-64">
            <Line
              data={{
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                datasets: [{
                  data: [12000, 19000, 15000, 25000, 22000, 30000],
                  borderColor: 'rgba(59, 130, 246, 1)',
                  backgroundColor: 'rgba(59, 130, 246, 0.1)',
                  tension: 0.4,
                  fill: true,
                }]
              }}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                  x: { display: false },
                  y: { display: false },
                }
              }}
            />
          </div>
        </div>

        {/* Quick Actions */}
        <div className={`${theme.card} ${theme.border} rounded-3xl p-8 ${theme.shadow}`}>
          <h3 className={`text-xl font-semibold ${theme.text} mb-6`}>Quick Actions</h3>
          <div className="grid grid-cols-1 gap-4">
            {[
              { label: 'Add Product', icon: '➕', color: 'from-blue-500 to-blue-600' },
              { label: 'View Reports', icon: '📊', color: 'from-green-500 to-green-600' },
              { label: 'Manage Users', icon: '👥', color: 'from-purple-500 to-purple-600' },
              { label: 'Schedule Event', icon: '📅', color: 'from-orange-500 to-orange-600' },
            ].map((action, index) => (
              <button key={index} className={`p-6 bg-gradient-to-br ${action.color} text-white rounded-2xl hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl font-medium`}>
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{action.icon}</span>
                  <span>{action.label}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Tasks */}
      <div className={`${theme.card} ${theme.border} rounded-3xl p-8 ${theme.shadow}`}>
        <h3 className={`text-xl font-semibold ${theme.text} mb-6`}>Recent Tasks</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {todoItems.slice(0, 6).map((item) => (
            <div key={item.id} className={`flex items-center space-x-4 p-4 rounded-2xl ${theme.border} transition-all duration-200 ${
              item.completed ? 'bg-green-50/50 border-green-200' : 'hover:bg-slate-50/50'
            }`}>
              <input
                type="checkbox"
                checked={item.completed}
                onChange={() => onToggleTodo(item.id)}
                className="w-5 h-5 text-blue-600 rounded-lg focus:ring-blue-500 border-2 border-slate-300"
              />
              <span className={`flex-1 text-sm ${item.completed ? 'line-through text-slate-500' : theme.text}`}>
                {item.title}
              </span>
              <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                item.priority === 'high' ? 'bg-red-100 text-red-700' :
                item.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                'bg-green-100 text-green-700'
              }`}>
                {item.priority}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Analytics Content Component
const AnalyticsContent = ({ chartData, loading, theme }) => {
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          font: { family: 'Inter, sans-serif', size: 12 },
          color: theme.text,
          padding: 20,
        },
      },
    },
    scales: {
      x: {
        grid: { color: theme.textSecondary + '20' },
        ticks: { color: theme.textSecondary },
      },
      y: {
        grid: { color: theme.textSecondary + '20' },
        ticks: { color: theme.textSecondary },
      },
    },
  };

  if (loading || !chartData) {
    return (
      <div className="text-center py-20">
        <div className="animate-spin rounded-full h-20 w-20 border-b-2 border-blue-600 mx-auto mb-8"></div>
        <p className={`${theme.textSecondary} text-lg`}>Loading analytics...</p>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <h2 className={`text-5xl font-bold ${theme.text} mb-10`}>Analytics Dashboard</h2>

      {/* Revenue & Users Trend */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className={`${theme.card} ${theme.border} rounded-3xl p-8 ${theme.shadow}`}>
          <h3 className={`text-2xl font-semibold ${theme.text} mb-6`}>Revenue Trend</h3>
          <div className="h-80">
            <Line data={chartData.revenue} options={chartOptions} />
          </div>
        </div>

        <div className={`${theme.card} ${theme.border} rounded-3xl p-8 ${theme.shadow}`}>
          <h3 className={`text-2xl font-semibold ${theme.text} mb-6`}>User Growth</h3>
          <div className="h-80">
            <Line data={chartData.users} options={chartOptions} />
          </div>
        </div>
      </div>

      {/* Orders & Categories */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className={`${theme.card} ${theme.border} rounded-3xl p-8 ${theme.shadow}`}>
          <h3 className={`text-2xl font-semibold ${theme.text} mb-6`}>Weekly Orders</h3>
          <div className="h-80">
            <Bar data={chartData.orders} options={chartOptions} />
          </div>
        </div>

        <div className={`${theme.card} ${theme.border} rounded-3xl p-8 ${theme.shadow}`}>
          <h3 className={`text-2xl font-semibold ${theme.text} mb-6`}>Sales by Category</h3>
          <div className="h-80">
            <Doughnut data={chartData.categories} options={chartOptions} />
          </div>
        </div>
      </div>

      {/* Conversion Funnel */}
      <div className={`${theme.card} ${theme.border} rounded-3xl p-8 ${theme.shadow}`}>
        <h3 className={`text-2xl font-semibold ${theme.text} mb-6`}>Conversion Funnel</h3>
        <div className="h-80">
          <Doughnut data={chartData.conversion} options={chartOptions} />
        </div>
      </div>
    </div>
  );
};

// Calendar Content Component
const CalendarContent = ({ theme, isDarkMode }) => {
  const [events] = useState([
    {
      id: 1,
      title: 'Product Launch Meeting',
      start: new Date(2024, 11, 15, 10, 0),
      end: new Date(2024, 11, 15, 11, 0),
      type: 'meeting'
    },
    {
      id: 2,
      title: 'Marketing Campaign Review',
      start: new Date(2024, 11, 18, 14, 0),
      end: new Date(2024, 11, 18, 15, 30),
      type: 'review'
    },
    {
      id: 3,
      title: 'Inventory Check',
      start: new Date(2024, 11, 20, 9, 0),
      end: new Date(2024, 11, 20, 17, 0),
      type: 'task'
    },
  ]);

  const eventStyleGetter = (event) => {
    let backgroundColor = '#3B82F6';
    if (event.type === 'meeting') backgroundColor = '#EF4444';
    if (event.type === 'review') backgroundColor = '#10B981';
    if (event.type === 'task') backgroundColor = '#F59E0B';

    return {
      style: {
        backgroundColor,
        borderRadius: '12px',
        opacity: 0.9,
        color: 'white',
        border: '0px',
        display: 'block',
        fontSize: '12px',
        fontWeight: '600',
        padding: '6px 10px',
      }
    };
  };

  return (
    <div className="space-y-10">
      <h2 className={`text-5xl font-bold ${theme.text} mb-10`}>Calendar & Scheduling</h2>

      <div className={`${theme.card} ${theme.border} rounded-3xl p-8 ${theme.shadow}`}>
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 800 }}
          eventPropGetter={eventStyleGetter}
          views={['month', 'week', 'day', 'agenda']}
          defaultView="month"
          className={`rbc-calendar-modern ${isDarkMode ? 'rbc-dark' : ''}`}
        />
      </div>
    </div>
  );
};

// Tasks Content Component
const TasksContent = ({ todoItems, onToggleTodo, onAddTodo, theme, isDarkMode }) => {
  const [newTask, setNewTask] = useState('');
  const [priority, setPriority] = useState('medium');
  const [category, setCategory] = useState('general');

  const handleAddTask = (e) => {
    e.preventDefault();
    if (newTask.trim()) {
      onAddTodo(newTask.trim(), priority, category);
      setNewTask('');
      setPriority('medium');
      setCategory('general');
    }
  };

  const highPriorityTasks = todoItems.filter(item => item.priority === 'high' && !item.completed);
  const mediumPriorityTasks = todoItems.filter(item => item.priority === 'medium' && !item.completed);
  const lowPriorityTasks = todoItems.filter(item => item.priority === 'low' && !item.completed);
  const completedTasks = todoItems.filter(item => item.completed);

  return (
    <div className="space-y-10">
      <h2 className={`text-5xl font-bold ${theme.text} mb-10`}>Task Management</h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Add Task Form */}
        <div className="lg:col-span-2">
          <div className={`${theme.card} ${theme.border} rounded-3xl p-8 ${theme.shadow}`}>
            <h3 className={`text-2xl font-semibold ${theme.text} mb-8`}>Add New Task</h3>
            <form onSubmit={handleAddTask} className="space-y-6">
              <div>
                <input
                  type="text"
                  value={newTask}
                  onChange={(e) => setNewTask(e.target.value)}
                  placeholder="Enter task description..."
                  className={`w-full px-6 py-4 ${theme.input} ${theme.border} rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${theme.text} placeholder:${theme.textSecondary}`}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  className={`px-6 py-4 ${theme.input} ${theme.border} rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 ${theme.text}`}
                >
                  <option value="low">Low Priority</option>
                  <option value="medium">Medium Priority</option>
                  <option value="high">High Priority</option>
                </select>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className={`px-6 py-4 ${theme.input} ${theme.border} rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 ${theme.text}`}
                >
                  <option value="general">General</option>
                  <option value="product">Product</option>
                  <option value="support">Support</option>
                  <option value="inventory">Inventory</option>
                  <option value="analytics">Analytics</option>
                  <option value="marketing">Marketing</option>
                </select>
              </div>
              <button
                type="submit"
                className={`w-full py-4 bg-gradient-to-r ${theme.button} text-white rounded-2xl hover:scale-105 transition-all duration-200 shadow-lg font-semibold`}
              >
                Add Task
              </button>
            </form>
          </div>

          {/* Task Lists */}
          <div className="mt-8 space-y-6">
            {highPriorityTasks.length > 0 && (
              <div className={`${theme.card} ${theme.border} rounded-3xl p-8 ${theme.shadow}`}>
                <h3 className="text-2xl font-semibold text-red-600 mb-6 flex items-center">
                  <span className="mr-3">🔥</span> High Priority
                </h3>
                <div className="space-y-4">
                  {highPriorityTasks.map((item) => (
                    <div key={item.id} className={`flex items-center space-x-4 p-5 rounded-2xl ${theme.border} bg-red-50/30`}>
                      <input
                        type="checkbox"
                        checked={item.completed}
                        onChange={() => onToggleTodo(item.id)}
                        className="w-6 h-6 text-red-600 rounded-lg focus:ring-red-500 border-2 border-red-300"
                      />
                      <span className={`flex-1 text-base ${theme.text}`}>{item.title}</span>
                      <span className="px-3 py-1 bg-red-100 text-red-700 text-xs font-semibold rounded-full">
                        {item.category}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {mediumPriorityTasks.length > 0 && (
              <div className={`${theme.card} ${theme.border} rounded-3xl p-8 ${theme.shadow}`}>
                <h3 className="text-2xl font-semibold text-yellow-600 mb-6 flex items-center">
                  <span className="mr-3">⚡</span> Medium Priority
                </h3>
                <div className="space-y-4">
                  {mediumPriorityTasks.map((item) => (
                    <div key={item.id} className={`flex items-center space-x-4 p-5 rounded-2xl ${theme.border} bg-yellow-50/30`}>
                      <input
                        type="checkbox"
                        checked={item.completed}
                        onChange={() => onToggleTodo(item.id)}
                        className="w-6 h-6 text-yellow-600 rounded-lg focus:ring-yellow-500 border-2 border-yellow-300"
                      />
                      <span className={`flex-1 text-base ${theme.text}`}>{item.title}</span>
                      <span className="px-3 py-1 bg-yellow-100 text-yellow-700 text-xs font-semibold rounded-full">
                        {item.category}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {lowPriorityTasks.length > 0 && (
              <div className={`${theme.card} ${theme.border} rounded-3xl p-8 ${theme.shadow}`}>
                <h3 className="text-2xl font-semibold text-green-600 mb-6 flex items-center">
                  <span className="mr-3">✅</span> Low Priority
                </h3>
                <div className="space-y-4">
                  {lowPriorityTasks.map((item) => (
                    <div key={item.id} className={`flex items-center space-x-4 p-5 rounded-2xl ${theme.border} bg-green-50/30`}>
                      <input
                        type="checkbox"
                        checked={item.completed}
                        onChange={() => onToggleTodo(item.id)}
                        className="w-6 h-6 text-green-600 rounded-lg focus:ring-green-500 border-2 border-green-300"
                      />
                      <span className={`flex-1 text-base ${theme.text}`}>{item.title}</span>
                      <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                        {item.category}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Task Summary */}
        <div className="space-y-6">
          <div className={`${theme.card} ${theme.border} rounded-3xl p-8 ${theme.shadow}`}>
            <h3 className={`text-2xl font-semibold ${theme.text} mb-8`}>Task Summary</h3>
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <span className={`${theme.textSecondary}`}>Total Tasks</span>
                <span className={`text-2xl font-bold ${theme.text}`}>{todoItems.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className={`${theme.textSecondary}`}>Completed</span>
                <span className={`text-2xl font-bold text-green-600`}>{completedTasks.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className={`${theme.textSecondary}`}>Pending</span>
                <span className={`text-2xl font-bold text-red-600`}>{todoItems.length - completedTasks.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className={`${theme.textSecondary}`}>High Priority</span>
                <span className={`text-2xl font-bold text-red-600`}>{highPriorityTasks.length}</span>
              </div>
            </div>
          </div>

          {completedTasks.length > 0 && (
            <div className={`${theme.card} ${theme.border} rounded-3xl p-8 ${theme.shadow}`}>
              <h3 className="text-2xl font-semibold text-green-600 mb-6 flex items-center">
                <span className="mr-3">✅</span> Recently Completed
              </h3>
              <div className="space-y-3">
                {completedTasks.slice(0, 4).map((item) => (
                  <div key={item.id} className={`flex items-center space-x-3 text-sm ${theme.textSecondary}`}>
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="line-through">{item.title}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Products Content Component
const ProductsContent = ({ theme }) => {
  return (
    <div className="space-y-10">
      <h2 className={`text-5xl font-bold ${theme.text} mb-10`}>Product Management</h2>
      <div className={`${theme.card} ${theme.border} rounded-3xl p-8 ${theme.shadow}`}>
        <p className={`${theme.textSecondary} text-lg`}>Product management interface will be integrated here...</p>
      </div>
    </div>
  );
};

// Customers Content Component
const CustomersContent = ({ theme }) => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);

  // Fetch customers function
  const fetchCustomers = async (page = 1, search = '') => {
    try {
      setLoading(true);
      const response = await fetch(`/api/admin/users?page=${page}&limit=10${search ? `&search=${search}` : ''}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch customers');
      }

      const data = await response.json();
      setCustomers(data.users);
      setTotalPages(data.pagination.pages);
      setCurrentPage(page);
    } catch (error) {
      console.error('Error fetching customers:', error);
      if (error.response?.status === 401) {
        window.location.href = '/admin/login';
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers(currentPage, searchTerm);
  }, [currentPage, searchTerm]);

  // Handle search input
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  // Open modal for edit
  const openModal = (customer = null) => {
    if (customer) {
      setEditingCustomer(customer);
    } else {
      setEditingCustomer(null);
    }
    setShowModal(true);
  };

  // Close modal
  const closeModal = () => {
    setShowModal(false);
    setEditingCustomer(null);
  };

  // Handle customer deletion
  const handleDelete = async (customerId) => {
    if (!window.confirm('Are you sure you want to delete this customer?')) return;

    try {
      const response = await fetch(`/api/admin/users/${customerId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete customer');
      }

      fetchCustomers(currentPage, searchTerm);
    } catch (error) {
      console.error('Error deleting customer:', error);
      alert('Error deleting customer');
    }
  };

  return (
    <div className="space-y-10">
      <div className="flex justify-between items-center">
        <h2 className={`text-5xl font-bold ${theme.text} mb-10`}>Customer Management</h2>
      </div>

      {/* Controls */}
      <div className="mb-5 flex gap-6 items-center">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search customers..."
            value={searchTerm}
            onChange={handleSearch}
            className={`w-full px-6 py-4 ${theme.input} ${theme.border} rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${theme.text} placeholder:${theme.textSecondary}`}
          />
        </div>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="text-center py-20">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-8"></div>
          <div className={`${theme.textSecondary} text-lg`}>Loading customers...</div>
        </div>
      ) : (
        <>
          {/* Customers Table */}
          <div className={`${theme.card} ${theme.border} rounded-3xl ${theme.shadow} overflow-hidden`}>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50/50">
                  <tr>
                    <th className={`px-8 py-5 text-left text-sm font-semibold ${theme.textSecondary} uppercase tracking-wider`}>
                      Customer
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
                  {customers.map((customer) => (
                    <tr key={customer.id} className={`hover:bg-slate-50/30 transition-colors duration-200`}>
                      <td className="px-8 py-6 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-14 w-14">
                            <img
                              className="h-14 w-14 rounded-full object-cover border-2 border-slate-200"
                              src={customer.profilePicture || '/images/icons/user-placeholder.png'}
                              alt={`${customer.firstName} ${customer.lastName}`}
                              onError={(e) => {
                                e.target.src = '/images/icons/user-placeholder.png';
                              }}
                            />
                          </div>
                          <div className="ml-5">
                            <div className={`text-base font-semibold ${theme.text}`}>
                              {customer.firstName && customer.lastName
                                ? `${customer.firstName} ${customer.lastName}`
                                : 'N/A'
                              }
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className={`px-8 py-6 whitespace-nowrap text-base ${theme.text}`}>
                        {customer.email}
                      </td>
                      <td className={`px-8 py-6 whitespace-nowrap text-base ${theme.textSecondary}`}>
                        {customer.phoneNumber || 'N/A'}
                      </td>
                      <td className="px-8 py-6 whitespace-nowrap">
                        <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${
                          customer.isEmailVerified
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {customer.isEmailVerified ? 'Verified' : 'Unverified'}
                        </span>
                      </td>
                      <td className={`px-8 py-6 whitespace-nowrap text-base ${theme.textSecondary}`}>
                        {new Date(customer.createdAt).toLocaleDateString()}
                      </td>
                      <td className={`px-8 py-6 whitespace-nowrap text-right text-base font-medium`}>
                        <button
                          onClick={() => openModal(customer)}
                          className="text-blue-600 hover:text-blue-900 mr-5 transition-colors duration-200"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(customer.id)}
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

      {/* Edit Customer Modal */}
      {showModal && editingCustomer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-6">
          <div className={`${theme.card} ${theme.border} rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto ${theme.shadow}`}>
            <div className="p-10">
              <h2 className={`text-3xl font-bold ${theme.text} mb-8`}>Edit Customer</h2>

              <form>
                <div className="grid grid-cols-2 gap-8 mb-8">
                  <div>
                    <label className={`block text-base font-medium ${theme.textSecondary} mb-3`}>First Name:</label>
                    <input
                      type="text"
                      defaultValue={editingCustomer.firstName || ''}
                      className={`w-full px-5 py-4 ${theme.input} ${theme.border} rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${theme.text}`}
                      placeholder="First Name"
                    />
                  </div>
                  <div>
                    <label className={`block text-base font-medium ${theme.textSecondary} mb-3`}>Last Name:</label>
                    <input
                      type="text"
                      defaultValue={editingCustomer.lastName || ''}
                      className={`w-full px-5 py-4 ${theme.input} ${theme.border} rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${theme.text}`}
                      placeholder="Last Name"
                    />
                  </div>
                </div>

                <div className="mb-8">
                  <label className={`block text-base font-medium ${theme.textSecondary} mb-3`}>Email:</label>
                  <input
                    type="email"
                    defaultValue={editingCustomer.email}
                    className={`w-full px-5 py-4 ${theme.border} rounded-2xl bg-slate-50 ${theme.text}`}
                    readOnly
                  />
                  <p className={`text-sm ${theme.textSecondary} mt-2`}>Email cannot be changed</p>
                </div>

                <div className="mb-8">
                  <label className={`block text-base font-medium ${theme.textSecondary} mb-3`}>Phone Number:</label>
                  <input
                    type="tel"
                    defaultValue={editingCustomer.phoneNumber || ''}
                    className={`w-full px-5 py-4 ${theme.input} ${theme.border} rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${theme.text}`}
                    placeholder="Phone Number"
                  />
                </div>

                <div className="mb-8">
                  <label className={`block text-base font-medium ${theme.textSecondary} mb-3`}>Address Line 1:</label>
                  <input
                    type="text"
                    defaultValue={editingCustomer.addressLine1 || ''}
                    className={`w-full px-5 py-4 ${theme.input} ${theme.border} rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${theme.text}`}
                    placeholder="Address Line 1"
                  />
                </div>

                <div className="mb-8">
                  <label className={`block text-base font-medium ${theme.textSecondary} mb-3`}>Address Line 2:</label>
                  <input
                    type="text"
                    defaultValue={editingCustomer.addressLine2 || ''}
                    className={`w-full px-5 py-4 ${theme.input} ${theme.border} rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${theme.text}`}
                    placeholder="Address Line 2"
                  />
                </div>

                <div className="grid grid-cols-3 gap-8 mb-8">
                  <div>
                    <label className={`block text-base font-medium ${theme.textSecondary} mb-3`}>City:</label>
                    <input
                      type="text"
                      defaultValue={editingCustomer.city || ''}
                      className={`w-full px-5 py-4 ${theme.input} ${theme.border} rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${theme.text}`}
                      placeholder="City"
                    />
                  </div>
                  <div>
                    <label className={`block text-base font-medium ${theme.textSecondary} mb-3`}>State:</label>
                    <input
                      type="text"
                      defaultValue={editingCustomer.state || ''}
                      className={`w-full px-5 py-4 ${theme.input} ${theme.border} rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${theme.text}`}
                      placeholder="State"
                    />
                  </div>
                  <div>
                    <label className={`block text-base font-medium ${theme.textSecondary} mb-3`}>Postal Code:</label>
                    <input
                      type="text"
                      defaultValue={editingCustomer.postalCode || ''}
                      className={`w-full px-5 py-4 ${theme.input} ${theme.border} rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${theme.text}`}
                      placeholder="Postal Code"
                    />
                  </div>
                </div>

                <div className="mb-8">
                  <label className={`block text-base font-medium ${theme.textSecondary} mb-3`}>Country:</label>
                  <input
                    type="text"
                    defaultValue={editingCustomer.country || ''}
                    className={`w-full px-5 py-4 ${theme.input} ${theme.border} rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${theme.text}`}
                    placeholder="Country"
                  />
                </div>

                <div className="mb-10">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      defaultChecked={editingCustomer.isEmailVerified}
                      className="w-6 h-6 rounded-lg border-2 border-slate-300 text-blue-600 focus:ring-blue-500"
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
                    Update Customer
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

// Orders Content Component
const OrdersContent = ({ theme }) => {
  return (
    <div className="space-y-10">
      <h2 className={`text-5xl font-bold ${theme.text} mb-10`}>Order Management</h2>
      <div className={`${theme.card} ${theme.border} rounded-3xl p-8 ${theme.shadow}`}>
        <p className={`${theme.textSecondary} text-lg`}>Order management interface will be implemented here...</p>
      </div>
    </div>
  );
};

// Reports Content Component
const ReportsContent = ({ theme }) => {
  return (
    <div className="space-y-10">
      <h2 className={`text-5xl font-bold ${theme.text} mb-10`}>Business Reports</h2>
      <div className={`${theme.card} ${theme.border} rounded-3xl p-8 ${theme.shadow}`}>
        <p className={`${theme.textSecondary} text-lg`}>Advanced reporting interface will be implemented here...</p>
      </div>
    </div>
  );
};

export default AdminDashboard;
