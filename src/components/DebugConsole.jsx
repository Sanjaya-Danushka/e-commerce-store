import React, { useState, useEffect } from 'react';

const DebugConsole = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [logs, setLogs] = useState([]);
  const [errors, setErrors] = useState([]);

  // Add log entry
  const addLog = (message, type = 'log', data = null) => {
    const logEntry = {
      id: Date.now() + Math.random(),
      timestamp: new Date().toISOString(),
      type,
      message,
      data
    };

    setLogs(prev => [logEntry, ...prev.slice(0, 99)]); // Keep last 100 entries

    if (type === 'error') {
      setErrors(prev => [logEntry, ...prev.slice(0, 49)]); // Keep last 50 errors
    }
  };

  // Global error handler
  useEffect(() => {
    const handleError = (event) => {
      addLog(`Global Error: ${event.message}`, 'error', {
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        error: event.error
      });
    };

    const handleUnhandledRejection = (event) => {
      addLog(`Unhandled Promise Rejection: ${event.reason}`, 'error', event.reason);
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, []);

  // Intercept axios errors
  useEffect(() => {
    // Store original console methods
    const originalError = console.error;
    const originalWarn = console.warn;
    const originalLog = console.log;

    // Override console methods
    console.error = (...args) => {
      addLog(args.join(' '), 'error');
      originalError.apply(console, args);
    };

    console.warn = (...args) => {
      addLog(args.join(' '), 'warning');
      originalWarn.apply(console, args);
    };

    console.log = (...args) => {
      addLog(args.join(' '), 'log');
      originalLog.apply(console, args);
    };

    return () => {
      console.error = originalError;
      console.warn = originalWarn;
      console.log = originalLog;
    };
  }, []);

  const clearLogs = () => {
    setLogs([]);
    setErrors([]);
  };

  const exportLogs = () => {
    const dataStr = JSON.stringify({ logs, errors }, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);

    const exportFileDefaultName = `debug-logs-${new Date().toISOString().split('T')[0]}.json`;

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  if (!isVisible) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <button
          onClick={() => setIsVisible(true)}
          className="bg-red-600 hover:bg-red-700 text-white p-3 rounded-full shadow-lg transition-colors"
          title="Open Debug Console"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {errors.length > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {errors.length}
            </span>
          )}
        </button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 w-96 h-96 bg-black text-green-400 font-mono text-sm z-50 rounded-lg shadow-2xl border border-gray-600">
      <div className="flex items-center justify-between p-3 bg-gray-800 rounded-t-lg">
        <h3 className="text-white font-semibold">Debug Console</h3>
        <div className="flex space-x-2">
          <button
            onClick={exportLogs}
            className="text-gray-400 hover:text-white transition-colors"
            title="Export Logs"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l4-4m-4 4l-4-4m8 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </button>
          <button
            onClick={clearLogs}
            className="text-gray-400 hover:text-white transition-colors"
            title="Clear Logs"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
          <button
            onClick={() => setIsVisible(false)}
            className="text-gray-400 hover:text-white transition-colors"
            title="Close"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      <div className="p-3 h-80 overflow-y-auto">
        {logs.length === 0 ? (
          <div className="text-gray-500 text-center py-8">No logs yet...</div>
        ) : (
          <div className="space-y-1">
            {logs.map((log) => (
              <div key={log.id} className={`p-2 rounded text-xs ${
                log.type === 'error' ? 'bg-red-900/20 text-red-400 border-l-2 border-red-500' :
                log.type === 'warning' ? 'bg-yellow-900/20 text-yellow-400 border-l-2 border-yellow-500' :
                'bg-gray-900/20 text-gray-300'
              }`}>
                <div className="flex justify-between items-start mb-1">
                  <span className={`font-semibold ${
                    log.type === 'error' ? 'text-red-400' :
                    log.type === 'warning' ? 'text-yellow-400' :
                    'text-blue-400'
                  }`}>
                    [{log.timestamp.split('T')[1].split('.')[0]}]
                  </span>
                  <span className={`text-xs px-2 py-1 rounded ${
                    log.type === 'error' ? 'bg-red-800 text-red-200' :
                    log.type === 'warning' ? 'bg-yellow-800 text-yellow-200' :
                    'bg-blue-800 text-blue-200'
                  }`}>
                    {log.type.toUpperCase()}
                  </span>
                </div>
                <div className="break-words">{log.message}</div>
                {log.data && (
                  <details className="mt-2">
                    <summary className="cursor-pointer text-gray-400 hover:text-gray-300">Details</summary>
                    <pre className="mt-1 text-xs bg-gray-800 p-2 rounded overflow-x-auto">
                      {JSON.stringify(log.data, null, 2)}
                    </pre>
                  </details>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DebugConsole;
