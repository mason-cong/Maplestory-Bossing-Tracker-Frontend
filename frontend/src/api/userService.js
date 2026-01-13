import axios from "axios";

const BASE_URL = "https://maplestory-weekly-bossing-tracker.onrender.com/"
const SIGNUP_URL = BASE_URL + "signup";
const LOGIN_URL = BASE_URL + "login";
const USERINFO_URL = BASE_URL + "userInfo";
const FORGOT_PASSWORD_URL = BASE_URL + "auth/forgot-password";

const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return token ? { Authorization: `Bearer ${token}` } : {};
};

export const registerUser = async (userData) => {
    try {
        const response = await axios.post(`${SIGNUP_URL}`, userData);
        return response.data;
    } catch (error) {
        throw error.response?.data?.msg || "Registration failed";
    }
};

export const loginUser = async (userData) => {
    try {
        const response = await axios.post(`${LOGIN_URL}`, userData);
        return response.data;
    } catch (error) {
        throw error.response?.data?.msg || "Login failed";
    }
};

export const getUserId = async (userData) => {
    try {
        const response = await axios.post(`${USERINFO_URL}`, userData, {
            headers: getAuthHeaders(),
        });
        return response.data;
    } catch (error) {
        throw error.response?.data?.msg || "Login failed";
    }
}

export const forgotPassword = async (userData) => {
    try {
        const response = await axios.post(`${FORGOT_PASSWORD_URL}`, userData, {
            headers: getAuthHeaders(),
        });
        return response.data;
    } catch (error) {
        throw error.response?.data?.msg || "Failed to reset password";
    }
}

export const resetPassword = async (userData) => {
    try {
        const response = await axios.post(`${FORGOT_PASSWORD_URL}`, userData, {
            headers: getAuthHeaders(),
        });
        return response.data;
    } catch (error) {
        throw error.response?.data?.msg || "Failed to reset password";
    }
}


