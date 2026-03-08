import React, { useContext } from "react";
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from "../AuthContext.jsx";
import crystal from '../assets/boss crystal.png';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const handleLogout = () => {
        logout();
        navigate("/login");
    };
    return (
       <nav className="bg-orange-400 text-white p-1 shadow-md">
            <div className="flex items-center gap-2 w-full">
                <img src={crystal} className='w-10 md:w-15 flex-shrink-0'/>
                <div className="min-w-0">
                    <Link to="/" className="text-sm md:text-lg font-bold truncate block">
                        <span className="hidden sm:inline">Weekly Bossing Meso Tracker</span>
                        <span className="sm:hidden">Boss Tracker</span>
                    </Link>
                </div>

                <div className="flex gap-4 text-sm md:text-lg font-semibold ml-2 md:ml-5">
                    <Link to={user ? "/tracker" : "/login"} className="hover:underline whitespace-nowrap">
                        Tracker
                    </Link>
                </div>

                <div className="flex justify-end ml-auto mr-2 md:mr-4">
                    {user ? (
                        <button
                            onClick={handleLogout}
                            className="bg-white text-red-500 px-2 md:px-4 py-1 md:py-2 text-sm md:text-base rounded-md hover:bg-gray-200 whitespace-nowrap"
                        >
                            Logout
                        </button>
                    ) : (
                        <Link
                            to="/login"
                            className="bg-white text-red-500 px-2 md:px-4 py-1 md:py-2 text-sm md:text-base rounded-md hover:bg-gray-200 whitespace-nowrap"
                        >
                            Login
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;