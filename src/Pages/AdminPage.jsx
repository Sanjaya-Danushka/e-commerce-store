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
import { Line, Bar, Pie } from 'react-chartjs-2';
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
  // State variables
  const [activeTab, setActiveTab] = useState('dashboard');
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
    { id: 1, title: 'Review new product submissions', completed: false, priority: 'high' },
    { id: 2, title: 'Check customer support tickets', completed: false, priority: 'medium' },
    { id: 3, title: 'Update inventory levels', completed: true, priority: 'low' },
    { id: 4, title: 'Generate monthly sales report', completed: false, priority: 'high' },
    { id: 5, title: 'Schedule social media posts', completed: false, priority: 'medium' },
  ]);

  // Navigation items
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'analytics', label: 'Analytics', icon: '📈' },
    { id: 'calendar', label: 'Calendar', icon: '📅' },
    { id: 'tasks', label: 'Tasks', icon: '✅' },
    { id: 'products', label: 'Products', icon: '📦' },
    { id: 'customers', label: 'Customers', icon: '👥' },
  ];

  // Fetch dashboard stats
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

      // Generate sample chart data
      setChartData({
        sales: {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
          datasets: [{
            label: 'Sales ($)',
            data: [12000, 19000, 15000, 25000, 22000, 30000],
            borderColor: 'rgb(59, 130, 246)',
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            tension: 0.4,
          }]
        },
        users: {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
          datasets: [{
            label: 'New Users',
            data: [120, 150, 180, 200, 240, 280],
            borderColor: 'rgb(16, 185, 129)',
            backgroundColor: 'rgba(16, 185, 129, 0.1)',
            tension: 0.4,
          }]
        },
        orders: {
          labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
          datasets: [{
            label: 'Orders',
            data: [45, 52, 38, 67, 49, 23, 31],
            backgroundColor: 'rgba(168, 85, 247, 0.8)',
          }]
        },
        categories: {
          labels: ['Electronics', 'Fashion', 'Home', 'Sports', 'Books'],
          datasets: [{
            data: [35, 25, 20, 15, 5],
            backgroundColor: [
              'rgba(59, 130, 246, 0.8)',
              'rgba(16, 185, 129, 0.8)',
              'rgba(245, 158, 11, 0.8)',
              'rgba(239, 68, 68, 0.8)',
              'rgba(139, 92, 246, 0.8)',
            ],
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
  }, []);

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    window.location.href = '/admin/login';
  };

  // Handle todo item toggle
  const toggleTodo = (id) => {
    setTodoItems(items =>
      items.map(item =>
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    );
  };

  // Add new todo item
  const addTodo = (title, priority = 'medium') => {
    const newTodo = {
      id: Date.now(),
      title,
      completed: false,
      priority
    };
    setTodoItems([...todoItems, newTodo]);
  };

  // Render content based on active tab
  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardContent stats={stats} loading={loading} todoItems={todoItems} onToggleTodo={toggleTodo} />;
      case 'analytics':
        return <AnalyticsContent chartData={chartData} loading={loading} />;
      case 'calendar':
        return <CalendarContent />;
      case 'tasks':
        return <TasksContent todoItems={todoItems} onToggleTodo={toggleTodo} onAddTodo={addTodo} />;
      case 'products':
        return <ProductsContent />;
      case 'customers':
        return <CustomersContent />;
      default:
        return <DashboardContent stats={stats} loading={loading} todoItems={todoItems} onToggleTodo={toggleTodo} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-72 bg-white shadow-xl border-r border-gray-200">
        <div className="p-6">
          <div className="flex items-center space-x-3 mb-8">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">A</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800">Admin Panel</h1>
              <p className="text-sm text-gray-500">Management Dashboard</p>
            </div>
          </div>

          <nav className="space-y-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left transition-all duration-200 ${
                  activeTab === item.id
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg transform scale-105'
                    : 'text-gray-700 hover:bg-gray-100 hover:scale-102'
                }`}
              >
                <span className="text-xl">{item.icon}</span>
                <span className="font-medium">{item.label}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="absolute bottom-0 w-72 p-6 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left text-red-600 hover:bg-red-50 transition-all duration-200"
          >
            <span className="text-xl">🚪</span>
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

// Dashboard Content Component
const DashboardContent = ({ stats, loading, todoItems, onToggleTodo }) => {
  const pendingTasks = todoItems.filter(item => !item.completed).length;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">Dashboard Overview</h2>
          <p className="text-gray-600 mt-1">Welcome back! Here's what's happening today.</p>
        </div>
        <div className="flex space-x-4">
          <div className="bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-200">
            <span className="text-sm text-gray-500">Pending Tasks</span>
            <div className="text-2xl font-bold text-blue-600">{pendingTasks}</div>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard data...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Products</p>
                <p className="text-3xl font-bold text-gray-800">{stats.totalProducts}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-2xl">📦</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-3xl font-bold text-gray-800">{stats.totalUsers}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-2xl">👥</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Orders</p>
                <p className="text-3xl font-bold text-gray-800">{stats.totalOrders}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <span className="text-2xl">🛒</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Revenue</p>
                <p className="text-3xl font-bold text-gray-800">${(stats.totalRevenue / 100).toFixed(2)}</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                <span className="text-2xl">💰</span>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Tasks</h3>
          <div className="space-y-3">
            {todoItems.slice(0, 5).map((item) => (
              <div key={item.id} className={`flex items-center space-x-3 p-3 rounded-lg border ${
                item.completed ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'
              }`}>
                <input
                  type="checkbox"
                  checked={item.completed}
                  onChange={() => onToggleTodo(item.id)}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <span className={`flex-1 text-sm ${item.completed ? 'line-through text-gray-500' : 'text-gray-700'}`}>
                  {item.title}
                </span>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  item.priority === 'high' ? 'bg-red-100 text-red-800' :
                  item.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {item.priority}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-3">
            <button className="p-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all transform hover:scale-105">
              <span className="block text-lg mb-1">➕</span>
              <span className="text-sm font-medium">Add Product</span>
            </button>
            <button className="p-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all transform hover:scale-105">
              <span className="block text-lg mb-1">📊</span>
              <span className="text-sm font-medium">View Reports</span>
            </button>
            <button className="p-4 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg hover:from-purple-600 hover:to-purple-700 transition-all transform hover:scale-105">
              <span className="block text-lg mb-1">👥</span>
              <span className="text-sm font-medium">Manage Users</span>
            </button>
            <button className="p-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all transform hover:scale-105">
              <span className="block text-lg mb-1">📅</span>
              <span className="text-sm font-medium">Schedule</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Analytics Content Component
const AnalyticsContent = ({ chartData, loading }) => {
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
    },
  };

  if (loading || !chartData) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading analytics...</p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-800 mb-8">Analytics Dashboard</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Sales Trend</h3>
          <Line data={chartData.sales} options={chartOptions} />
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">User Growth</h3>
          <Line data={chartData.users} options={chartOptions} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Weekly Orders</h3>
          <Bar data={chartData.orders} options={chartOptions} />
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Sales by Category</h3>
          <Pie data={chartData.categories} options={chartOptions} />
        </div>
      </div>
    </div>
  );
};

// Calendar Content Component
const CalendarContent = () => {
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
        borderRadius: '8px',
        opacity: 0.8,
        color: 'white',
        border: '0px',
        display: 'block'
      }
    };
  };

  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-800 mb-8">Calendar & Scheduling</h2>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 600 }}
          eventPropGetter={eventStyleGetter}
          views={['month', 'week', 'day']}
          defaultView="month"
          className="rbc-calendar-modern"
        />
      </div>
    </div>
  );
};

// Tasks Content Component
const TasksContent = ({ todoItems, onToggleTodo, onAddTodo }) => {
  const [newTask, setNewTask] = useState('');
  const [priority, setPriority] = useState('medium');

  const handleAddTask = (e) => {
    e.preventDefault();
    if (newTask.trim()) {
      onAddTodo(newTask.trim(), priority);
      setNewTask('');
      setPriority('medium');
    }
  };

  const highPriorityTasks = todoItems.filter(item => item.priority === 'high' && !item.completed);
  const mediumPriorityTasks = todoItems.filter(item => item.priority === 'medium' && !item.completed);
  const lowPriorityTasks = todoItems.filter(item => item.priority === 'low' && !item.completed);
  const completedTasks = todoItems.filter(item => item.completed);

  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-800 mb-8">Task Management</h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Add New Task</h3>
            <form onSubmit={handleAddTask} className="space-y-4">
              <div>
                <input
                  type="text"
                  value={newTask}
                  onChange={(e) => setNewTask(e.target.value)}
                  placeholder="Enter task description..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="flex space-x-4">
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="low">Low Priority</option>
                  <option value="medium">Medium Priority</option>
                  <option value="high">High Priority</option>
                </select>
                <button
                  type="submit"
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Add Task
                </button>
              </div>
            </form>
          </div>

          <div className="mt-8 space-y-6">
            {highPriorityTasks.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-red-600 mb-4">🔥 High Priority</h3>
                <div className="space-y-3">
                  {highPriorityTasks.map((item) => (
                    <div key={item.id} className="flex items-center space-x-3 p-3 rounded-lg bg-red-50 border border-red-200">
                      <input
                        type="checkbox"
                        checked={item.completed}
                        onChange={() => onToggleTodo(item.id)}
                        className="w-4 h-4 text-red-600 rounded focus:ring-red-500"
                      />
                      <span className="flex-1 text-sm text-gray-700">{item.title}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {mediumPriorityTasks.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-yellow-600 mb-4">⚡ Medium Priority</h3>
                <div className="space-y-3">
                  {mediumPriorityTasks.map((item) => (
                    <div key={item.id} className="flex items-center space-x-3 p-3 rounded-lg bg-yellow-50 border border-yellow-200">
                      <input
                        type="checkbox"
                        checked={item.completed}
                        onChange={() => onToggleTodo(item.id)}
                        className="w-4 h-4 text-yellow-600 rounded focus:ring-yellow-500"
                      />
                      <span className="flex-1 text-sm text-gray-700">{item.title}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {lowPriorityTasks.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-green-600 mb-4">✅ Low Priority</h3>
                <div className="space-y-3">
                  {lowPriorityTasks.map((item) => (
                    <div key={item.id} className="flex items-center space-x-3 p-3 rounded-lg bg-green-50 border border-green-200">
                      <input
                        type="checkbox"
                        checked={item.completed}
                        onChange={() => onToggleTodo(item.id)}
                        className="w-4 h-4 text-green-600 rounded focus:ring-green-500"
                      />
                      <span className="flex-1 text-sm text-gray-700">{item.title}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Task Summary</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Total Tasks</span>
                <span className="text-lg font-bold text-gray-800">{todoItems.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Completed</span>
                <span className="text-lg font-bold text-green-600">{completedTasks.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Pending</span>
                <span className="text-lg font-bold text-red-600">{todoItems.length - completedTasks.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">High Priority</span>
                <span className="text-lg font-bold text-red-600">{highPriorityTasks.length}</span>
              </div>
            </div>
          </div>

          {completedTasks.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-green-600 mb-4">✅ Recently Completed</h3>
              <div className="space-y-2">
                {completedTasks.slice(0, 3).map((item) => (
                  <div key={item.id} className="flex items-center space-x-2 text-sm text-gray-600">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
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
const ProductsContent = () => {
  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-800 mb-8">Product Management</h2>
      <p className="text-gray-600">Product management interface will be integrated here...</p>
    </div>
  );
};

// Customers Content Component
const CustomersContent = () => {
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
    <div>
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800">Customer Management</h2>
      </div>

      {/* Controls */}
      <div className="mb-5 flex gap-4 items-center">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search customers..."
            value={searchTerm}
            onChange={handleSearch}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="text-center py-10">
          <div className="text-lg text-gray-600">Loading customers...</div>
        </div>
      ) : (
        <>
          {/* Customers Table */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Phone
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Joined
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {customers.map((customer) => (
                    <tr key={customer.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <img
                              className="h-10 w-10 rounded-full"
                              src={customer.profilePicture || '/images/icons/user-placeholder.png'}
                              alt={`${customer.firstName} ${customer.lastName}`}
                              onError={(e) => {
                                e.target.src = '/images/icons/user-placeholder.png';
                              }}
                            />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {customer.firstName && customer.lastName
                                ? `${customer.firstName} ${customer.lastName}`
                                : 'N/A'
                              }
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {customer.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {customer.phoneNumber || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          customer.isEmailVerified
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {customer.isEmailVerified ? 'Verified' : 'Unverified'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(customer.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => openModal(customer)}
                          className="text-blue-600 hover:text-blue-900 mr-3"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(customer.id)}
                          className="text-red-600 hover:text-red-900"
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
          <div className="flex justify-center gap-2 mt-6">
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

      {/* Edit Customer Modal */}
      {showModal && editingCustomer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Edit Customer</h2>

              <form>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">First Name:</label>
                    <input
                      type="text"
                      defaultValue={editingCustomer.firstName || ''}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="First Name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Last Name:</label>
                    <input
                      type="text"
                      defaultValue={editingCustomer.lastName || ''}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Last Name"
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email:</label>
                  <input
                    type="email"
                    defaultValue={editingCustomer.email}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                    readOnly
                  />
                  <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number:</label>
                  <input
                    type="tel"
                    defaultValue={editingCustomer.phoneNumber || ''}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Phone Number"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Address Line 1:</label>
                  <input
                    type="text"
                    defaultValue={editingCustomer.addressLine1 || ''}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Address Line 1"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Address Line 2:</label>
                  <input
                    type="text"
                    defaultValue={editingCustomer.addressLine2 || ''}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Address Line 2"
                  />
                </div>

                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">City:</label>
                    <input
                      type="text"
                      defaultValue={editingCustomer.city || ''}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="City"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">State:</label>
                    <input
                      type="text"
                      defaultValue={editingCustomer.state || ''}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="State"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Postal Code:</label>
                    <input
                      type="text"
                      defaultValue={editingCustomer.postalCode || ''}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Postal Code"
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Country:</label>
                  <input
                    type="text"
                    defaultValue={editingCustomer.country || ''}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Country"
                  />
                </div>

                <div className="mb-6">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      defaultChecked={editingCustomer.isEmailVerified}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm font-medium text-gray-700">Email Verified</span>
                  </label>
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
                    type="button"
                    className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md font-medium"
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
const OrdersContent = () => {
  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-800 mb-8">Order Management</h2>
      <p className="text-gray-600">Order management interface will be implemented here...</p>
    </div>
  );
};

export default AdminDashboard;
