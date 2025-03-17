import axios from 'axios';

// Create an Axios instance with a base URL
const axiosInstance = axios.create({
  baseURL: 'http://localhost:8080/api', // Replace with your backend API URL
});

// Add a response interceptor
axiosInstance.interceptors.response.use(
  (response) => response, // Return the response if it's successful
  (error) => {
    if (error.response?.status === 403) {
      // Token is expired or invalid
      localStorage.removeItem('token'); // Remove token from localStorage
      localStorage.removeItem('firstName'); // Remove first name
      localStorage.removeItem('lastName'); // Remove last name
      window.location.href = '/login'; // Redirect to login page
    }
    return Promise.reject(error); // Reject the error
  }
);

export default axiosInstance;