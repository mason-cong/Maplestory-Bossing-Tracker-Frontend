import '../index.css';
import defaultChar from '../assets/default-character.png';
import React, { useState, useContext, useEffect } from "react";
import { AuthContext } from "../AuthContext";
import InputMenu from '../components/addBosses';
import CharacterManager from '../components/CharacterManager';
import MesoChart from '../components/mesoChart';
import { getUserCharacters, getUserMeso } from '../api/trackerService';

const Tracker = () => {
    const {user, userId, loading} = useContext(AuthContext);
    const [displayedMeso, setDisplayedMeso] = useState([]);
    const [displayedCharacter, setDisplayedCharacter] = useState([]);
    const [displayedCharacterMeso, setDisplayedCharacterMeso] = useState(0);
    const [userCharacters, setUserCharacters] = useState([]);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [loadingMesos, setLoadingMesos] = useState(false);

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
    //we need to set another useeffect to get the usercharacters and wait to load site
    useEffect(() => {
        if (!userId) return;

            const loadData = async() => {
                try {
                    const charactersResponse = await getUserCharacters(userId);
                    setUserCharacters(charactersResponse);

                    charactersResponse?.forEach((character) => {
                        try {
                            const characterMeso = async () => await getUserMeso(userId, character.id);
                            setDisplayedMeso((displayedMeso) => [...displayedMeso, characterMeso]);
                        } catch (error) {
                            console.error(error);
                        }
                    });
                } catch (error) {
                    console.error(error);
                } 
            };
            loadData();

    }, [loading, userId]);

    {/*useEffect(() => {
    if (!displayedCharacter) return;

    const fetchWeeklyMesos = async () => {
        setLoadingMesos(true);
        try {
            // Replace with your actual API endpoint
            const characterMeso = await getUserMeso(userId, displayedCharacter.id);
            setDisplayedCharacterMeso(characterMeso);
        } catch (err) {
            console.error('Error fetching weekly mesos:', err);
            setDisplayedCharacterMeso(0);
        // Fallback to 0 on error
        } finally {
            setLoadingMesos(false);
        }
    };

    fetchWeeklyMesos();
    }, [displayedCharacter]); // Re-run whenever displayedCharacter changes */}



    if (loading) {
        return <div>Loading authentication</div>;
    }

    return (
        <div className="flex-grow flex flex-wrap gap-3 p-4 mt-10 justify-center w-full">
            <div className="flex flex-col gap-2 lg:w-[40rem]">
                <div className="flex flex-row p-5 border rounded-lg border-orange-100 bg-orange-300 w-full max-w-[500px] md:max-w-[600px] lg:max-w-[700px] mx-auto">
                    <CharacterManager 
                        userId = {userId}
                        userCharacters={userCharacters}
                        setUserCharacters={setUserCharacters}
                        displayedCharacter={displayedCharacter}
                        setDisplayedCharacter={setDisplayedCharacter}
                    />
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
            </div>
        </div>
    );

};

export default Tracker;