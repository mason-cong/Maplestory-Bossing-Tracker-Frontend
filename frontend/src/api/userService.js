import axios from "axios";

const API_URL = "http://localhost:8080/signup";
const API2_URL = "http://localhost:8080/login";

const getAuthHeaders = () => {
    const storedDataString = localStorage.getItem("userData");
    const retrievedJsonObject = JSON.parse(storedDataString);
    const combinedString = retrievedJsonObject.username + ";" + retrievedJsonObject.password;
    const encodedString = btoa(combinedString);
    return { Authorization: `Basic ${encodedString}` };
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