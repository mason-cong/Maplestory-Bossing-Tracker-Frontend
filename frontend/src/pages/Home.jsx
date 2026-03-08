import mesochair from '../assets/home-img.png';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from "../AuthContext";
import { useContext } from 'react';


const Home = () => {
    const { user } = useContext(AuthContext);

    return (
        <div className="flex flex-col md:flex-row items-center text-center">
            <div className="inline-block mt-[3rem] p-5 mx-auto">
                <p className="text-3xl md:text-5xl relative p-5 rounded-lg mb-[2rem]">
                    A tool to keep count of your weekly mesos.
                </p>
                {user ?
                    (
                        <button type="button">
                            <Link
                                to="/tracker"
                                className="text-2xl p-3 rounded-lg bg-purple-500 hover:bg-purple-700 text-white"
                            >
                                Head to tracker
                            </Link>
                        </button>
                    ) : (
                        <button type="button">
                            <Link
                                to="/login"
                                className="text-2xl p-3 rounded-lg bg-purple-500 hover:bg-purple-700 text-white"
                            >
                                Login Now
                            </Link>
                        </button>
                    )}
            </div>
            <div className="flex justify-center w-full md:w-auto">
                <img className="w-full max-w-sm md:max-w-none md:w-[50rem] object-contain" src={mesochair} />
            </div>

        </div>
    );

};

export default Home;