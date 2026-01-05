// Get API URL from environment variable, fallback to localhost for development
export const getApiUrl = (): string => {
  return import.meta.env.VITE_API_URL || 'http://localhost:8080/api';
};

// Get base API URL without /api suffix for direct fetch calls
export const getBaseApiUrl = (): string => {
  const apiUrl = getApiUrl();
  // Remove /api suffix if present
  return apiUrl.replace(/\/api$/, '');
};

