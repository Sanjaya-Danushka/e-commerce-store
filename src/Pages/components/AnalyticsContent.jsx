import React from 'react';
import { Line, Bar, Doughnut } from 'react-chartjs-2';

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

export default AnalyticsContent;
