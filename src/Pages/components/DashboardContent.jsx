import React, { useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, Filler } from 'chart.js';

// Register the Filler plugin
ChartJS.register(Filler);

const DashboardContent = ({ stats, loading, todoItems, onToggleTodo, theme, onAddProduct }) => {
  const pendingTasks = todoItems.filter(item => !item.completed).length;
  const completedTasks = todoItems.filter(item => item.completed).length;

  // State for expanded cards
  const [expandedCards, setExpandedCards] = useState({});

  const toggleCardExpansion = (cardId) => {
    setExpandedCards(prev => ({
      ...prev,
      [cardId]: !prev[cardId]
    }));
  };

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

      {/* Enhanced Stats Cards */}
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
            {
              id: 'products',
              title: 'Total Products',
              value: stats.totalProducts || 0,
              icon: '📦',
              color: 'from-blue-500 to-blue-600',
              trend: '+12%',
              details: {
                active: Math.floor((stats.totalProducts || 0) * 0.85),
                outOfStock: Math.floor((stats.totalProducts || 0) * 0.05),
                categories: 8,
                lowStock: Math.floor((stats.totalProducts || 0) * 0.1)
              }
            },
            {
              id: 'users',
              title: 'Total Users',
              value: stats.totalUsers || 0,
              icon: '👥',
              color: 'from-green-500 to-green-600',
              trend: '+8%',
              details: {
                active: Math.floor((stats.totalUsers || 0) * 0.75),
                newThisMonth: Math.floor((stats.totalUsers || 0) * 0.15),
                premium: Math.floor((stats.totalUsers || 0) * 0.1),
                inactive: Math.floor((stats.totalUsers || 0) * 0.1)
              }
            },
            {
              id: 'orders',
              title: 'Total Orders',
              value: stats.totalOrders || 0,
              icon: '🛒',
              color: 'from-purple-500 to-purple-600',
              trend: '+15%',
              details: {
                pending: Math.floor((stats.totalOrders || 0) * 0.2),
                processing: Math.floor((stats.totalOrders || 0) * 0.3),
                completed: Math.floor((stats.totalOrders || 0) * 0.45),
                cancelled: Math.floor((stats.totalOrders || 0) * 0.05)
              }
            },
            {
              id: 'revenue',
              title: 'Revenue',
              value: `$${(stats.totalRevenue / 100 || 0).toFixed(2)}`,
              icon: '💰',
              color: 'from-yellow-500 to-orange-500',
              trend: '+22%',
              details: {
                thisMonth: Math.floor((stats.totalRevenue || 0) * 0.7 / 100),
                averageOrder: Math.floor((stats.totalRevenue || 0) / Math.max(stats.totalOrders || 1, 1) / 100),
                topCategory: 'Electronics',
                growth: 22
              }
            },
          ].map((stat, index) => (
            <div key={index} className={`${theme.card} ${theme.border} rounded-3xl p-8 hover:scale-105 transition-all duration-300 ${theme.shadow} group cursor-pointer`}>
              <div className="flex items-center justify-between mb-4">
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

              {/* Expandable Details */}
              <div className={`transition-all duration-300 ${expandedCards[stat.id] ? 'max-h-96 opacity-100 mt-4' : 'max-h-0 opacity-0 overflow-hidden'}`}>
                <div className={`border-t ${theme.border} pt-4`}>
                  {stat.id === 'products' && (
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className={`text-sm ${theme.textSecondary}`}>Active Products</span>
                        <span className={`text-sm font-medium ${theme.text}`}>{stat.details.active}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className={`text-sm ${theme.textSecondary}`}>Out of Stock</span>
                        <span className={`text-sm font-medium text-red-500`}>{stat.details.outOfStock}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className={`text-sm ${theme.textSecondary}`}>Categories</span>
                        <span className={`text-sm font-medium ${theme.text}`}>{stat.details.categories}</span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-2">
                        <div className="bg-green-500 h-2 rounded-full" style={{ width: `${(stat.details.active / stat.value) * 100}%` }}></div>
                      </div>
                    </div>
                  )}

                  {stat.id === 'users' && (
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className={`text-sm ${theme.textSecondary}`}>Active Users</span>
                        <span className={`text-sm font-medium ${theme.text}`}>{stat.details.active}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className={`text-sm ${theme.textSecondary}`}>New This Month</span>
                        <span className={`text-sm font-medium text-blue-500`}>{stat.details.newThisMonth}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className={`text-sm ${theme.textSecondary}`}>Premium Users</span>
                        <span className={`text-sm font-medium text-purple-500`}>{stat.details.premium}</span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-2">
                        <div className="bg-green-500 h-2 rounded-full" style={{ width: `${(stat.details.active / stat.value) * 100}%` }}></div>
                      </div>
                    </div>
                  )}

                  {stat.id === 'orders' && (
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className={`text-sm ${theme.textSecondary}`}>Pending</span>
                        <span className={`text-sm font-medium text-orange-500`}>{stat.details.pending}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className={`text-sm ${theme.textSecondary}`}>Processing</span>
                        <span className={`text-sm font-medium text-blue-500`}>{stat.details.processing}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className={`text-sm ${theme.textSecondary}`}>Completed</span>
                        <span className={`text-sm font-medium text-green-500`}>{stat.details.completed}</span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-2">
                        <div className="bg-green-500 h-2 rounded-full" style={{ width: `${(stat.details.completed / stat.value) * 100}%` }}></div>
                      </div>
                    </div>
                  )}

                  {stat.id === 'revenue' && (
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className={`text-sm ${theme.textSecondary}`}>This Month</span>
                        <span className={`text-sm font-medium ${theme.text}`}>${stat.details.thisMonth}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className={`text-sm ${theme.textSecondary}`}>Avg Order Value</span>
                        <span className={`text-sm font-medium ${theme.text}`}>${stat.details.averageOrder}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className={`text-sm ${theme.textSecondary}`}>Top Category</span>
                        <span className={`text-sm font-medium ${theme.text}`}>{stat.details.topCategory}</span>
                      </div>
                      <div className="flex items-center space-x-2 mt-2">
                        <div className="flex-1 bg-slate-200 rounded-full h-2">
                          <div className="bg-green-500 h-2 rounded-full" style={{ width: `${stat.details.growth}%` }}></div>
                        </div>
                        <span className={`text-xs ${theme.textSecondary}`}>+{stat.details.growth}%</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Expand/Collapse Button */}
              <button
                onClick={() => toggleCardExpansion(stat.id)}
                className={`mt-4 w-full text-sm ${theme.textSecondary} hover:${theme.text} transition-colors flex items-center justify-center space-x-2`}
              >
                <span>{expandedCards[stat.id] ? 'Show Less' : 'Show Details'}</span>
                <span className={`transition-transform duration-200 ${expandedCards[stat.id] ? 'rotate-180' : ''}`}>
                  ⌄
                </span>
              </button>
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
              <button
                key={index}
                onClick={() => {
                  if (action.label === 'Add Product' && onAddProduct) {
                    onAddProduct();
                  }
                }}
                className={`p-6 bg-gradient-to-br ${action.color} text-white rounded-2xl hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl font-medium`}
              >
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

export default DashboardContent;
