import axios from 'axios';

// Create an Axios instance with a base URL
const axiosInstance = axios.create({
  baseURL: 'http://localhost:8080/api', // Replace with your backend API URL
});

// Add a request interceptor to automatically add token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor
axiosInstance.interceptors.response.use(
  (response) => response, // Return the response if it's successful
  (error) => {
    // Only handle 403 (forbidden) - 401 is handled in components
    if (error.response?.status === 403) {
      // Token is expired or invalid
      localStorage.removeItem('token');
      localStorage.removeItem('firstName');
      localStorage.removeItem('lastName');
      window.location.href = '/login';
    }
    return Promise.reject(error); // Reject the error
  }
);

export default axiosInstance;