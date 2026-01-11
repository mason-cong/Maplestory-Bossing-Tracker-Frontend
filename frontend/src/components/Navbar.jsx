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
       <nav className="bg-orange-400 text-white p-1 shadow-md ">
            <div className="flex items-center gap-2 w-full justify-center">
                
                <img src={crystal} className='w-15'/>
                <div>
                    <Link to="/" className="text-lg font-bold">
                        Weekly Bossing Meso Tracker
                    </Link>
                    
                </div>

                <div className="flex gap-6 text-lg font-semibold ms-5">
                    <Link to={user ? "/tracker" : "/login"} className="hover:underline">
                        Tracker
                    </Link>
                </div>

               
                <div className="flex justify-end ml-auto mr-[1rem]">
                    {user ? (
                        <button 
                            onClick={handleLogout} 
                            className="bg-white text-red-500 px-4 py-2 rounded-md hover:bg-gray-200"
                        >
                            Logout
                        </button>
                    ) : (
                        <Link 
                            to="/login" 
                            className="bg-white text-red-500 px-4 py-2 rounded-md hover:bg-gray-200"
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