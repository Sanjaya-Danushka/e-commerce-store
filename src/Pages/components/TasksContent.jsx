import React, { useState } from 'react';

const TasksContent = ({ todoItems, onToggleTodo, onAddTodo, onDeleteTodo, theme }) => {
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
                      <button
                        onClick={() => onDeleteTodo(item.id)}
                        className="w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center transition-colors duration-200"
                        title="Delete task"
                      >
                        🗑️
                      </button>
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
                      <button
                        onClick={() => onDeleteTodo(item.id)}
                        className="w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center transition-colors duration-200"
                        title="Delete task"
                      >
                        🗑️
                      </button>
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
                      <button
                        onClick={() => onDeleteTodo(item.id)}
                        className="w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center transition-colors duration-200"
                        title="Delete task"
                      >
                        🗑️
                      </button>
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
                  <div key={item.id} className={`flex items-center justify-between text-sm ${theme.textSecondary}`}>
                    <div className="flex items-center space-x-3 flex-1">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="line-through flex-1">{item.title}</span>
                    </div>
                    <button
                      onClick={() => onDeleteTodo(item.id)}
                      className="w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center transition-colors duration-200 opacity-60 hover:opacity-100"
                      title="Delete completed task"
                    >
                      ×
                    </button>
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

export default TasksContent;
