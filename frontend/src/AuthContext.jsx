import React, { createContext, useState, useEffect } from "react";
import { getUserId, loginUser } from "./api/userService";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [userId, setUserId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const fetchUser = async () => {
            const token = localStorage.getItem("token");
            const username = localStorage.getItem("username");
            if (!token) {
                setUser(null);
                setUserId(null);
                setLoading(false);
                return;
            }

            try {
                setUser(username);
                const data = await getUserId(username);
                console.log("Changing userid");
                    setUserId(data);
                    
            } catch (err) {
                console.error("Error fetching user:", err);
                setUser(null); 
                setUserId(null);
            } finally {
                setLoading(false);
            }
        };
        fetchUser();
    }, []);

    const login = async (username, password) => {
        setLoading(true);
        try { 
            //login user first
            const loginResponse = await loginUser({username, password});
                localStorage.setItem("token", loginResponse.token);
                localStorage.setItem("username", username);
                setUser(username); 

            //get userid
            const data = await getUserId({username});
                setUserId(data);
                setIsAuthenticated(true);
            return { success: true };
        } catch (error) {
            console.error('Login error:', error);
            return { success: false, error: error.message };
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        console.log("🔴 Logging out from AuthContext...");
        localStorage.removeItem("token");
        localStorage.removeItem("username");
        setUser(null);
        setUserId(null);
    };

    return (
        <AuthContext.Provider value={{ user, setUser, userId, setUserId,
            isAuthenticated, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
