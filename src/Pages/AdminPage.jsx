import React, { useState, useEffect, useCallback } from 'react';
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
// import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
// import { format, parse, startOfWeek, getDay } from 'date-fns';
// import enUS from 'date-fns/locale/en-US';
// import 'react-big-calendar/lib/css/react-big-calendar.css';

// Chart.js registration
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
// const localizer = dateFnsLocalizer({
//   format,
//   parse,
//   startOfWeek,
//   getDay,
//   locales: {
//     'en-US': enUS,
//   },
// });

// Import content components
import DashboardContent from './components/DashboardContent';
import AnalyticsContent from './components/AnalyticsContent';
import CalendarContent from './components/CalendarContent';
import TasksContent from './components/TasksContent';
import ProductsContent from './components/ProductsContent';
import CustomersContent from './components/CustomersContent';
import OrdersContent from './components/OrdersContent';
import ReportsContent from './components/ReportsContent';

const AdminDashboard = () => {
  // State management
  const [activeTab, setActiveTab] = useState(() => {
    // Load saved tab from localStorage or default to dashboard
    const savedTab = localStorage.getItem('adminActiveTab');
    return savedTab || 'dashboard';
  });
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
  const [todoItems, setTodoItems] = useState(() => {
    // Load tasks from localStorage or use default tasks
    const savedTasks = localStorage.getItem('adminTasks');
    if (savedTasks) {
      try {
        return JSON.parse(savedTasks);
      } catch (error) {
        console.error('Error parsing saved tasks:', error);
        return [
          { id: 1, title: 'Review new product submissions', completed: false, priority: 'high', category: 'product' },
          { id: 2, title: 'Check customer support tickets', completed: false, priority: 'medium', category: 'support' },
          { id: 3, title: 'Update inventory levels', completed: true, priority: 'low', category: 'inventory' },
          { id: 4, title: 'Generate monthly sales report', completed: false, priority: 'high', category: 'analytics' },
          { id: 5, title: 'Schedule social media posts', completed: false, priority: 'medium', category: 'marketing' },
        ];
      }
    }
    return [
      { id: 1, title: 'Review new product submissions', completed: false, priority: 'high', category: 'product' },
      { id: 2, title: 'Check customer support tickets', completed: false, priority: 'medium', category: 'support' },
      { id: 3, title: 'Update inventory levels', completed: true, priority: 'low', category: 'inventory' },
      { id: 4, title: 'Generate monthly sales report', completed: false, priority: 'high', category: 'analytics' },
      { id: 5, title: 'Schedule social media posts', completed: false, priority: 'medium', category: 'marketing' },
    ];
  });

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
  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);
      console.log('Fetching stats...');
      const response = await adminAPI.getStats();
      console.log('Stats response:', response);
      console.log('Stats response data:', response.data);
      setStats(prev => ({
        ...prev,
        totalProducts: response.data.totalProducts || 0,
        totalUsers: response.data.totalUsers || 0,
        totalOrders: response.data.totalOrders || 0,
        totalRevenue: response.data.totalRevenue || 0,
        recentProducts: response.data.recentProducts || 0
      }));
      console.log('Stats updated:', {
        totalProducts: response.data.totalProducts || 0,
        totalUsers: response.data.totalUsers || 0,
        totalOrders: response.data.totalOrders || 0,
        totalRevenue: response.data.totalRevenue || 0
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
      console.error('Error response:', error.response?.data);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');

    if (!token) {
      console.log('AdminPage: No token found, attempting auto-login...');
      const loginAdmin = async () => {
        try {
          const response = await adminAPI.login({
            username: 'admin',
            password: 'admin123'
          });
          localStorage.setItem('adminToken', response.data.token);
          fetchStats();
        } catch (error) {
          console.error('AdminPage: Auto-login failed:', error);
          window.location.href = '/admin/login';
        }
      };
      loginAdmin();
      return;
    }
    fetchStats();
  }, [fetchStats]);

  // Logout handler
  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminDarkMode');
    localStorage.removeItem('adminTasks'); // Clear tasks on logout
    localStorage.removeItem('adminActiveTab'); // Clear active tab on logout
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
    setTodoItems(items => [...items, newTodo]);
  };

  const deleteTodo = (id) => {
    setTodoItems(items => items.filter(item => item.id !== id));
  };

  const clearAllTasks = () => {
    setTodoItems([]);
  };

  // Save tasks to localStorage whenever they change
  React.useEffect(() => {
    localStorage.setItem('adminTasks', JSON.stringify(todoItems));
  }, [todoItems]);

  // Save active tab to localStorage whenever it changes
  React.useEffect(() => {
    localStorage.setItem('adminActiveTab', activeTab);
  }, [activeTab]);

  // Render content based on active tab
  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardContent stats={stats} loading={loading} todoItems={todoItems} onToggleTodo={toggleTodo} theme={theme} onAddProduct={() => setActiveTab('products')} onNavigate={setActiveTab} />;
      case 'analytics':
        return <div className={`p-8 ${theme.card} rounded-3xl ${theme.shadow}`}>
          <h3 className={`text-xl font-semibold ${theme.text} mb-4`}>Analytics</h3>
          <p className={`${theme.textSecondary}`}>Analytics content coming soon...</p>
        </div>;
      case 'calendar':
        return <CalendarContent theme={theme} isDarkMode={isDarkMode} />;
      case 'tasks':
        return <TasksContent todoItems={todoItems} onToggleTodo={toggleTodo} onAddTodo={addTodo} onDeleteTodo={deleteTodo} onClearAllTasks={clearAllTasks} theme={theme} />;
      case 'products':
        return <ProductsContent theme={theme} />;
      case 'customers':
        return <CustomersContent theme={theme} />;
      case 'orders':
        return <OrdersContent theme={theme} />;
      case 'reports':
        return <ReportsContent theme={theme} />;
      default:
        return <DashboardContent stats={stats} loading={loading} todoItems={todoItems} onToggleTodo={toggleTodo} theme={theme} />;
    }
  };

  return (
    <div className={`min-h-screen ${theme.background} transition-all duration-700`}>
      {/* Sidebar */}
      <div className={`fixed left-0 top-0 h-full w-80 ${theme.sidebar} ${theme.shadow} z-50`}>
        <div className="flex flex-col h-full p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-12">
            <div className="flex items-center">
              <a className="flex items-center" href="/" data-discover="true">
                <div className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center mr-3 shadow-lg">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 2L3 7v11a2 2 0 002 2h10a2 2 0 002-2V7l-7-5z" clipRule="evenodd"></path>
                  </svg>
                </div>
                <span className={`text-xl font-bold ${theme.text}`}>ShopEase</span>
              </a>
            </div>

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className={`w-14 h-7 rounded-full relative transition-all duration-300 ${
                isDarkMode ? 'bg-slate-600' : 'bg-slate-300'
              }`}
            >
              <div className={`w-6 h-6 rounded-full absolute top-0.5 transition-all duration-300 ${
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

export default AdminDashboard;
