// Get API URL from environment variable, fallback to localhost for development
export const getApiUrl = (): string => {
  const envUrl = import.meta.env.VITE_API_URL;
  
  // Debug logging (only in development or if URL seems wrong)
  if (!envUrl || typeof envUrl !== 'string' || (!envUrl.startsWith('http://') && !envUrl.startsWith('https://'))) {
    console.error('⚠️ VITE_API_URL Configuration Issue!');
    console.error('Current value:', envUrl);
    console.error('Expected format: https://desirable-heart-production.up.railway.app/api');
    console.error('All env vars:', Object.keys(import.meta.env).filter(k => k.startsWith('VITE_')));
  }
  
  // If VITE_API_URL is set, use it (should include /api)
  if (envUrl && typeof envUrl === 'string') {
    // Trim whitespace and remove leading/trailing slashes that might cause issues
    let trimmedUrl = String(envUrl).trim();
    
    // Remove leading slash if present (would make it relative)
    if (trimmedUrl.startsWith('/')) {
      console.warn('⚠️ VITE_API_URL starts with /, removing it to prevent relative path issues');
      trimmedUrl = trimmedUrl.substring(1);
    }
    
    // Ensure it starts with http:// or https://
    if (!trimmedUrl.startsWith('http://') && !trimmedUrl.startsWith('https://')) {
      console.error('❌ VITE_API_URL is missing protocol!');
      console.error('Current value:', trimmedUrl);
      console.error('Auto-fixing by adding https://');
      trimmedUrl = `https://${trimmedUrl}`;
    }
    
    // Ensure it ends with /api
    if (!trimmedUrl.endsWith('/api')) {
      console.warn('⚠️ VITE_API_URL should end with /api. Auto-fixing...');
      trimmedUrl = trimmedUrl.endsWith('/') ? `${trimmedUrl}api` : `${trimmedUrl}/api`;
    }
    
    console.log('✅ Using API URL:', trimmedUrl);
    return trimmedUrl;
  }
  
  // Fallback to localhost for development
  if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
    console.error('❌ VITE_API_URL is not set in production! Using localhost fallback (this will fail)');
  } else {
    console.log('ℹ️ VITE_API_URL not set, using localhost fallback for development');
  }
  return 'http://localhost:8080/api';
};

// Get base API URL without /api suffix for direct fetch calls
export const getBaseApiUrl = (): string => {
  const apiUrl = getApiUrl();
  // Remove /api suffix if present
  return apiUrl.replace(/\/api$/, '');
};

