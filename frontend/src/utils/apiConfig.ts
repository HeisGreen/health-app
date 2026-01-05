// Get API URL from environment variable, fallback to localhost for development
export const getApiUrl = (): string => {
  const envUrl = import.meta.env.VITE_API_URL;
  
  // If VITE_API_URL is set, use it (should include /api)
  if (envUrl) {
    // Ensure it starts with http:// or https://
    if (!envUrl.startsWith('http://') && !envUrl.startsWith('https://')) {
      console.warn('VITE_API_URL should include protocol (http:// or https://)');
      return `https://${envUrl}`;
    }
    return envUrl;
  }
  
  // Fallback to localhost for development
  return 'http://localhost:8080/api';
};

// Get base API URL without /api suffix for direct fetch calls
export const getBaseApiUrl = (): string => {
  const apiUrl = getApiUrl();
  // Remove /api suffix if present
  return apiUrl.replace(/\/api$/, '');
};

