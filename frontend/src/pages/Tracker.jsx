import defaultChar from '../assets/default-character.png';
import React, { useState, useContext, useEffect } from "react";
import { AuthContext } from "../AuthContext";
import '../index.css';
import InputMenu from '../components/addBosses';
import getUserCharacters from '../api/trackerService';
import getUserMeso from '../api/trackerService';
import mesoChart from '../components/mesoChart';
const Tracker = () => {
    const {user, userId} = useContext(AuthContext);
    const [displayedMeso, setDisplayedMeso] = useState([]);
    //handles bg change
    useEffect(() => {
        // Add a class to the body when the component mounts
        document.body.className = 'tracker-class';

        // Clean up: remove the class when the component unmounts
        return () => {
        document.body.classList.remove('tracker-class');
        };
    }, []); // Empty dependency array ensures this runs only once on mount and unmount

    //handles tracker screen updates
    useEffect(() => {

    }, []);

    //pie chart updates
    useEffect(() => {
        const userCharacters = async () => await getUserCharacters(userId);
        userCharacters?.forEach((charId) => {
            const characterMeso = async () => await getUserMeso(charId);
            setDisplayedMeso((displayedMeso) => [...displayedMeso, characterMeso]);
        });
    }, []);

    return (
        <div className="flex-grow flex flex-wrap gap-3 p-4 mt-10 justify-center w-full">
            <div className="flex flex-col gap-2 lg:w-[40rem]">
                <div className="flex flex-row p-5 border rounded-lg border-orange-100 bg-orange-300 w-full max-w-[500px] md:max-w-[600px] lg:max-w-[700px] mx-auto">
                    <div className="min-h-20 w-1/3 lg:min-w-28 flex items-center justify-center">
                        <img src={defaultChar} className='h-auto w-full max-w-32'/>
                    </div>

                    <div className="p-3 flex flex-col items-center w-full">
                        <div className="my-3 flex flex-row justify-between w-full items-center text-lg">
                            charName
                            <button className='bg-black'>
                                edit button
                            </button>
                        </div>

                        <div className="flex flex-col w-full gap-3">
                            <div className="flex flex-row items-center justify-between w-full">
                                <strong className="text-sm">Class:</strong>
                                <p>N/A</p>
                            </div>
                            <div className="flex flex-row items-center justify-between w-full">
                                <strong className="text-sm">Weekly Mesos:</strong>
                                <p>0</p>
                            </div>
                            <div className="flex flex-row items-center justify-between w-full">
                                <strong className="text-sm">Level:</strong>
                                <p>0</p>
                            </div>
                        </div>   
                    </div>
                </div>
            </div>
            
            <div className='flex flex-wrap flex-col gap-4 items-center justify-center'>
                <div className="lg:w-[46rem]"> 
                    <div className="flex flex-wrap lg:flex-col gap-2 items-center justify-center lg:justify-start">
                        <div className="flex flex-col p-5 border rounded-lg border-orange-100 bg-orange-300 items-center w-full max-w-[500px] md:max-w-[600px] lg:max-w-[700px] mx-auto">
                                <div className="min-h-20 flex-col items-center justify-center">
                                    Total Weekly Meso Income
                                </div>
                                <div className="p-3 flex flex-col md:flex-row items-center w-full">
                                    <div className="w-full lg:w-1/2">
                                        <div>
                                            <mesoChart chartData = {displayedMeso}> </mesoChart>
                                        </div>
                                    </div>
                                <div className="flex flex-col w-full gap-3">
                                    <div className="flex flex-row items-center justify-between w-full">
                                        <strong className="text-sm">Class:</strong>
                                        <p>N/A</p>
                                    </div>
                                    <div className="flex flex-row items-center justify-between w-full">
                                        <strong className="text-sm">Weekly Mesos:</strong>
                                        <p>0</p>
                                    </div>
                                    <div className="flex flex-row items-center justify-between w-full">
                                        <strong className="text-sm">Level:</strong>
                                        <p>0</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className='lg:w-[46rem]'>
                    <div className="flex flex-wrap lg:flex-col gap-2 items-center justify-center lg:justify-start">
                        <div className="flex flex-col p-5 border rounded-lg border-orange-100 bg-orange-300 items-center w-full max-w-[500px] md:max-w-[600px] lg:max-w-[700px] mx-auto">
                                <div className="min-h-20 flex-col items-center justify-center">
                                    Weekly Bosses
                                </div>
                                <div className='grid grid-cols-7 gap-4'>
                                    <div className='text-center select-none'>

                                    </div>
                                </div>
                        </div>
                    </div>
                </div>

                <InputMenu></InputMenu>
            </div>

        </div>
    );

};

export default Tracker;