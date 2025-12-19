import axios from "axios";

const API_URL = "http://localhost:8080/weekly-characters";
const API2_URL = "http://localhost:8080/login";

const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return token ? { Authorization: `Bearer ${token}` } : {};
};

export const getUserCharacters = async (userID) => {
    try {
        const response = await axios.get(`${API_URL}/${userID}`, {
            headers: getAuthHeaders(),
        });
        return response.data;
    } catch (error) {
        throw error.response?.data?.msg || "Failed to get user characters";
    }
};

export const createNewUserCharacters = async (userID, charData) => {
    try {
        const response = await axios.post(`${API_URL}/${userID}`, charData, {
            headers: getAuthHeaders(),
        });
        return response.data;
    } catch (error) {
        throw error.response?.data?.msg || "Failed to create new character";
    }
};

export const getBossesFromCharacter = async (userID, charID) => {
    try {
        const response = await axios.get(`${API_URL}/${userID}/${charID}/bosses`, {
            headers: getAuthHeaders(),
        });
        return response.data;
    } catch (error) {
        throw error.response?.data?.msg || "Failed to create new boss";
    }
};


export const addBossesToCharacter = async (userID, charID) => {
    try {
        const response = await axios.post(`${API_URL}/${userID}/${charID}/bosses`, {
            headers: getAuthHeaders(),
        });
        return response.data;
    } catch (error) {
        throw error.response?.data?.msg || "Failed to create new boss";
    }
};

export const getUserMeso = async (userID, charID) => {
    try {
        const response = await axios.get(`${API_URL}/${userID}/${charID}/meso`, {
            headers: getAuthHeaders(),
        });
        return response.data;
    } catch (error) {
        throw error.response?.data?.msg || "Failed to get user character meso";
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