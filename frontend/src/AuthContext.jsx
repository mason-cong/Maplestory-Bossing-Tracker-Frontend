import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [userId, setUserId] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            const storedDataString = localStorage.getItem("userData");
            if (!storedDataString) {
                setUser(null); 
                setLoading(false);
                return;
            }
            try {
                const retrievedJsonObject = JSON.parse(storedDataString);
                setUser(retrievedJsonObject.username);
                setUserId(retrievedJsonObject.id);
            } catch (err) {
                console.error("Error fetching user:", err);
                setUser(null); 
            } 
        };
        fetchUser();
    }, []);

    
    const logout = () => {
        console.log("🔴 Logging out from AuthContext...");
        localStorage.removeItem("userData");
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, setUser, userId, setUserId, loading, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
