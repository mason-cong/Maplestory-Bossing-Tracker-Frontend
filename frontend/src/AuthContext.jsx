import React, { createContext, useState, useEffect } from "react";
import { getUserId } from "./api/userService";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [userId, setUserId] = useState(null);
    const [loading, setLoading] = useState(true);

    /*useEffect(() => {
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
    }, []);*/

    useEffect(() => {
    const fetchUser = async () => {
        const token = localStorage.getItem("token");
        const username = localStorage.getItem("username");
        
        console.log("=== AUTH CONTEXT DEBUG ===");
        console.log("1. Token exists:", !!token);
        console.log("2. Username:", username);
        
        if (!token || !username) {
            console.log("3. No token/username - exiting early");
            setUser(null);
            setUserId(null);
            setLoading(false);
            return;
        }
        
        try {
            console.log("4. Setting user to:", username);
            setUser(username);
            const data = await getUserId({username});
            console.log("6. getUserId returned:", data);
            console.log("7. Type of data:", typeof data);
            
            setUserId(data);
            console.log("8. Called setUserId with:", data);
        } catch (err) {
            console.log("9. ERROR occurred:", err);
            console.error("Error fetching user:", err);
            setUser(null);
            setUserId(null);
        } finally {
            setLoading(false);
            console.log("10. Loading set to false");
        }
    };
    fetchUser();
}, []);

// Separate useEffect to monitor userId changes
useEffect(() => {
    console.log("🔵 userId state changed to:", userId);
}, [userId]);

    const logout = () => {
        console.log("🔴 Logging out from AuthContext...");
        localStorage.removeItem("token");
        localStorage.removeItem("username");
        setUser(null);
        setUserId(null);
    };

    return (
        <AuthContext.Provider value={{ user, setUser, userId, setUserId, loading, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
