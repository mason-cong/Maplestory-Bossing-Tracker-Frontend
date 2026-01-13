import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { AuthContext } from "../AuthContext";

const Login = () => {
    const { login } = useContext(AuthContext);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        const result = await login(username, password);

        if (result.success) {
            // Navigate only after auth context is fully loaded
            navigate('/tracker');
        } else {
            setError(result.error || 'Login failed');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96 border-t-4 border-orange-400">
                <h2 className="text-3xl font-bold text-center text-orange-400">Login</h2>
                {error && <p className="text-red-600 text-center">{error}</p>}
                <form onSubmit={handleSubmit} className="mt-4">
                    <div className="mb-4">
                        <label className="block text-gray-700">Username</label>
                        <input
                            type="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full px-4 py-2 mt-2 border rounded-md focus:ring-2 focus:ring-orange-400 outline-none"
                            placeholder="Enter your username"
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
                        className="w-full text-white py-2 rounded-md bg-purple-500 hover:bg-purple-700 transition"
                    >
                        Login
                    </button>
                </form>
                <p className="mt-4 text-center text-gray-600">
                    <Link to="/signup" className="text-blue-600 hover:underline">
                        Don't have an account?
                    </Link>
                </p>
                <p className="mt-2 text-sm text-center text-gray-600">
                    Forgot your password?{" "}
                    <Link to="/forgot-password" className="text-blue-600 hover:underline">
                        Reset here
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Login;