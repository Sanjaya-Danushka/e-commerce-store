// Utility function for conditional logging (only show errors and warnings in production)
export const logger = {
  log: (...args) => {
    // Only show logs in development mode for debugging
    if (import.meta.env?.DEV !== false) {
      console.log(...args);
    }
  },
  error: (...args) => {
    // Always show errors (both development and production)
    console.error(...args);
  },
  warn: (...args) => {
    // Always show warnings (both development and production)
    console.warn(...args);
  },
  info: (...args) => {
    // Only show info logs in development mode
    if (import.meta.env?.DEV !== false) {
      console.info(...args);
    }
  }
};
