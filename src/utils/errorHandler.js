/**
 * Global error handler for API requests
 * @param {Error} error - The error object
 * @param {Object} options - Options for error handling
 * @param {boolean} options.logToConsole - Whether to log the error to the console
 * @param {function} options.showToUser - Function to show error to user (e.g., setMessage)
 * @param {string} options.userMessage - Custom message to show to the user
 * @returns {Object} Standardized error object
 */
export const handleApiError = (error, options = {}) => {
  const {
    logToConsole = process.env.NODE_ENV !== 'production',
    showToUser = null,
    userMessage = 'An error occurred. Please try again later.'
  } = options;

  // Create a standardized error object
  const errorObj = {
    message: error.message || 'Unknown error',
    status: error.response?.status || 500,
    data: error.response?.data || {},
    timestamp: new Date().toISOString(),
  };

  // Log error in development and staging environments
  if (logToConsole) {
    console.error('API Error:', {
      ...errorObj,
      stack: error.stack,
    });
  }

  // Show error to user if a function is provided
  if (showToUser && typeof showToUser === 'function') {
    showToUser(userMessage);
  }

  return errorObj;
};

/**
 * Format validation errors for display
 * @param {Object} validationErrors - Validation error object
 * @returns {Array} Array of error messages
 */
export const formatValidationErrors = (validationErrors) => {
  if (!validationErrors) return [];

  // Handle different validation error formats
  if (Array.isArray(validationErrors)) {
    return validationErrors.map(err => err.message || String(err));
  }
  
  if (typeof validationErrors === 'object') {
    return Object.entries(validationErrors).map(
      ([field, message]) => `${field}: ${message}`
    );
  }
  
  return [String(validationErrors)];
};