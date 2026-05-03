/**
 * Input sanitization utilities for security.
 * Prevents XSS attacks and ensures safe user input handling.
 * @module utils/sanitize
 */

/**
 * Sanitizes a string by escaping HTML special characters.
 * Prevents XSS injection when rendering user-provided content.
 * @param {string} str - The raw input string to sanitize.
 * @returns {string} The sanitized string with HTML entities escaped.
 */
export const sanitizeInput = (str) => {
  if (typeof str !== 'string') return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
};

/**
 * Validates that an email address matches a standard format.
 * @param {string} email - The email string to validate.
 * @returns {boolean} True if valid, false otherwise.
 */
export const validateEmail = (email) => {
  if (typeof email !== 'string') return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Rate limiter factory. Creates a function that enforces a
 * minimum interval between successive calls.
 * @param {number} minInterval - Minimum milliseconds between calls.
 * @returns {{ canProceed: () => boolean, reset: () => void }}
 */
export const createRateLimiter = (minInterval = 1000) => {
  let lastCall = 0;
  return {
    canProceed: () => {
      const now = Date.now();
      if (now - lastCall < minInterval) return false;
      lastCall = now;
      return true;
    },
    reset: () => { lastCall = 0; }
  };
};

/**
 * Debounce utility. Delays invoking a function until after
 * `delay` milliseconds have elapsed since the last invocation.
 * @param {Function} fn - The function to debounce.
 * @param {number} delay - Delay in milliseconds.
 * @returns {Function} The debounced function.
 */
export const debounce = (fn, delay = 300) => {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
};

/**
 * Truncates a string to a maximum length and appends an ellipsis.
 * @param {string} str - The string to truncate.
 * @param {number} maxLen - Maximum character length.
 * @returns {string} The truncated string.
 */
export const truncate = (str, maxLen = 100) => {
  if (typeof str !== 'string') return '';
  if (str.length <= maxLen) return str;
  return str.substring(0, maxLen) + '...';
};
