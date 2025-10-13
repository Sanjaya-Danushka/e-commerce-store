import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, Filler } from 'chart.js';

// Register the Filler plugin
ChartJS.register(Filler);

const DashboardContent = ({ stats, loading, todoItems, onToggleTodo, theme }) => {
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

export default DashboardContent;
