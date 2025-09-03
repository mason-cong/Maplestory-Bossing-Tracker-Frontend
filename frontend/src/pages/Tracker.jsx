import defaultChar from '../assets/default-character.png';
import React, { useState, useContext, useEffect } from "react";
import '../index.css';
const Tracker = () => {

    useEffect(() => {
        // Add a class to the body when the component mounts
        document.body.className = 'tracker-class';

        // Clean up: remove the class when the component unmounts
        return () => {
        document.body.classList.remove('tracker-class');
        };
    }, []); // Empty dependency array ensures this runs only once on mount and unmount

    return (
        <div className="flex-grow overflow-y-auto flex flex-col justify-between">
            <div>
                <div className="flex flex-row lg:max-w-[800px] p-5 border rounded-lg border-orange-100 bg-orange-300 items-center mx-auto">
                    <div className="min-h-20 flex items-center justify-center">
                        <img src={defaultChar} className='h-auto'/>
                    </div>
                    <div className="p-3 flex flex-col items-center w-full">
                        <div className="flex flex-row justify-between w-full items-center text-lg">
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

            <div className="flex flex-row lg:max-w-[800px] p-5 border rounded-lg border-orange-100 bg-orange-300 items-center mx-auto">
                    <div className="min-h-20 flex-col items-center justify-center">
                        Total Weekly Meso Income
                    </div>
                    <div className="p-3 flex flex-col md:flex-row items-center w-full">
                        <div className="flex flex-row justify-between w-full items-center text-lg">
                            charName
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
    );

};

export default Tracker;