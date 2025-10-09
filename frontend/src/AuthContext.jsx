import React, { createContext, useState, useEffect } from "react";
import { getUserId } from "./api/userService";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [userId, setUserId] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            const token = localStorage.getItem("token");
            if (!token) {
                setUser(null); 
                setLoading(false);
                return;
            }
            try {
                const data = await getUserId(token);
                    setUserId(data);
            } catch (err) {
                console.error("Error fetching user:", err);
                setUser(null); 
            } 
        };
        fetchUser();
    }, []);

    
    const logout = () => {
        console.log("🔴 Logging out from AuthContext...");
        localStorage.removeItem("token");
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, setUser, userId, setUserId, loading, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
