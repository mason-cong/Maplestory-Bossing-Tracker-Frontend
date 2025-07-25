import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const data = await loginUser({ email, password });
            localStorage.setItem("token", data.token);
            setUser(data.user); 
            navigate("/dashboard");
        } catch (err) {
            setError(err.message || "Login failed. Please try again.");

        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96 border-t-4 border-orange-400">
                <h2 className="text-3xl font-bold text-center text-orange-400">Login</h2>
                {error && <p className="text-red-600 text-center">{error}</p>}
                <form onSubmit={handleSubmit} className="mt-4">
                    <div className="mb-4">
                        <label className="block text-gray-700">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-2 mt-2 border rounded-md focus:ring-2 focus:ring-orange-400 outline-none"
                            placeholder="Enter your email"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-2 mt-2 border rounded-md focus:ring-2 focus:ring-orange-400 outline-none"
                            placeholder="Enter your password"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-orange-400 text-white py-2 rounded-md hover:bg-orange-400 transition"
                    >
                        Login
                    </button>
                </form>
                <p className="mt-4 text-center text-gray-600">
                    Don't have an account? <a href="/register" className="text-orange-400">Register</a>
                </p>
                <p className="mt-2 text-sm text-center text-gray-600">
                        Forgot your password?{" "}
                        <Link to="/forgot-password" className="text-orange-400 hover:underline">
                            Reset here
                        </Link>
                </p>
            </div>
        </div>
    );
};

export default Login;