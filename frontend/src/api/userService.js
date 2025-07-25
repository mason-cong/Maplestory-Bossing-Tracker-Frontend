import axios from "axios";

const API_URL = "http://localhost:8080/signup";

/*const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return token ? { Authorization: `Bearer ${token}` } : {};
};*/

export const registerUser = async (userData) => {
    try {
        const response = await axios.post(`${API_URL}`, userData);
        return response.data;
    } catch (error) {
        throw error.response?.data?.msg || "Registration failed";
    }
};