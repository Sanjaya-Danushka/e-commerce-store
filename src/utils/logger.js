// Utility function for conditional logging (only in development)
export const logger = {
  log: (...args) => {
    if (import.meta.env?.DEV !== false) {
      console.log(...args);
    }
  },
  error: (...args) => {
    if (import.meta.env?.DEV !== false) {
      console.error(...args);
    }
  },
  warn: (...args) => {
    if (import.meta.env?.DEV !== false) {
      console.warn(...args);
    }
  },
  info: (...args) => {
    if (import.meta.env?.DEV !== false) {
      console.info(...args);
    }
  }
};
