import axios from 'axios';

// Define the type for the user registration data
interface UserRegistrationData {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    gender: string;
    department: string;
    address: string;
    phoneNumber: string;
}

// Function to handle user registration
export const registerUser = async (userData) => {
    try {
        const response = await axios.post('http://localhost:8080/api/user/signup', userData);
        return response.data;
    } catch (error) {
        console.error('Error during registration:', error);
        throw error;
    }
};