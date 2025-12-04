import axios from "axios";

const API_URL = "http://localhost:8080/signup";
const API2_URL = "http://localhost:8080/login";
const API3_URL = "http://localhost:8080/userInfo";


const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return token ? { Authorization: `Bearer ${token}` } : {};
};

export const registerUser = async (userData) => {
    try {
        const response = await axios.post(`${API_URL}`, userData);
        return response.data;
    } catch (error) {
        throw error.response?.data?.msg || "Registration failed";
    }
};

export const loginUser = async (userData) => {
    try {
        const response = await axios.post(`${API2_URL}`, userData);
        return response.data;
    } catch (error) {
        throw error.response?.data?.msg || "Login failed";
    }
};

export const getUserId = async (userData) => {
    try {
        const response = await axios.post(`${API3_URL}`, userData, {
            headers: getAuthHeaders(),
        });
        return response.data;
    } catch (error) {
        throw error.response?.data?.msg || "Login failed";
    }
}