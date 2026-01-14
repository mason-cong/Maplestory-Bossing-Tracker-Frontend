import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerUser } from "../api/userService";

const Signup = () => {
    const [username, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false); 
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess(false); 

        try {
            await registerUser({ username, email, password });
            setSuccess(true); 
            setTimeout(() => navigate("/login"), 2000); 
        } catch (err) {
            setError(err);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96 border-t-4 border-orange-400">
                <h2 className="text-3xl font-bold text-center text-orange-400">Register</h2>
                
                
                {success && (
                    <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded mt-2 text-center">
                        Registration successful! Redirecting to login...
                    </div>
                )}

                
                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mt-2 text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="mt-4">
                    <div className="mb-4 ">
                        <label className="block text-gray-700">Username</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full px-4 py-2 mt-2 border rounded-md focus:ring-2 focus:ring-orange-400 outline-none"
                            placeholder="Enter your username"
                            required
                        />
                    </div>
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
                            placeholder="Create a password"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full text-white py-2 rounded-md bg-purple-500 hover:bg-purple-700 transition"
                    >
                        Register
                    </button>
                </form>
                <p className="mt-4 text-center text-gray-600">
                    Already have an account?
                    <Link to="/login" className="text-blue-600 hover:underline">
                        Login
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Signup;