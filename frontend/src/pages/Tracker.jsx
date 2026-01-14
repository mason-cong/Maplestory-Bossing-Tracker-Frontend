import '../index.css';
import React, { useState, useContext, useEffect } from "react";
import { AuthContext } from "../AuthContext";
import CharacterManager from '../components/CharacterManager.jsx';
import BossManager from '../components/BossManager.jsx';
import MesoChart from '../components/MesoChart.jsx';
import { getUserCharacters, getUserCharacter } from '../api/trackerService';
import { Toaster } from 'react-hot-toast';

const Tracker = () => {
    const { user, userId, loading } = useContext(AuthContext);
    const [displayedCharacter, setDisplayedCharacter] = useState([]);
    const [userCharacters, setUserCharacters] = useState([]);

    //handles bg change
    useEffect(() => {
        // Add a class to the body when the component mounts
        document.body.className = 'tracker-class';

        // Clean up: remove the class when the component unmounts
        return () => {
            document.body.classList.remove('tracker-class');
        };
    }, []); // Empty dependency array ensures this runs only once on mount and unmount

    //we need to set another useeffect to get the usercharacters and wait to load site
    useEffect(() => {
        if (!userId) return;

        const loadData = async () => {
            try {
                const charactersResponse = await getUserCharacters(userId);
                setUserCharacters(charactersResponse);
            } catch (error) {
                console.error(error);
            }
        };
        loadData();

    }, [loading, userId]);

    if (loading) {
        return <div>Loading authentication</div>;
    }

    const handleBossesUpdate = (updatedBosses) => {
        setDisplayedCharacter(prev => ({
            ...prev,
            weeklyBosses: updatedBosses
        }));
    };

    const refetchCharacter = async () => {
        if (!displayedCharacter?.id) return;

        try {
            const refreshedCharacter = await getUserCharacter(userId, displayedCharacter.id);
            setDisplayedCharacter(refreshedCharacter);

            setUserCharacters(prev =>
                prev.map(char => char.id === refreshedCharacter.id ? refreshedCharacter : char)
            );
        } catch (err) {
            console.error("Error fetching character", err)
        }
    };


    return (
        <div className="flex-grow flex flex-wrap gap-1 p-4 mt-10 justify-center w-full">
            <Toaster />
            <div className="flex flex-col gap-2 lg:w-[46rem]">
                <div className="flex flex-row p-5 border rounded-lg border-orange-100 bg-orange-300 w-full max-w-[500px] md:max-w-[600px] lg:max-w-[700px] mx-auto shadow-md">
                    <CharacterManager
                        userId={userId}
                        userCharacters={userCharacters}
                        setUserCharacters={setUserCharacters}
                        displayedCharacter={displayedCharacter}
                        setDisplayedCharacter={setDisplayedCharacter}
                    />
                </div>
  
                    <div className="flex flex-wrap lg:flex-col gap-2 items-center justify-center lg:justify-start">
                        <div className="flex flex-col p-5 border rounded-lg border-orange-100 bg-orange-300 items-center w-full max-w-[500px] md:max-w-[600px] lg:max-w-[700px] mx-auto shadow-md">
                            <BossManager
                                userId={userId}
                                characterId={displayedCharacter?.id}
                                weeklyBosses={displayedCharacter?.weeklyBosses || []}
                                onBossesUpdate={handleBossesUpdate}
                                onCharacterRefetch={refetchCharacter}
                            />
                        </div>
                    </div>

            </div>

            <div className='flex flex-wrap flex-col gap-4 items-center'>
                <div className="lg:w-[46rem]">
                    <div className="flex flex-wrap lg:flex-col gap-2 items-center justify-center lg:justify-start">
                        <div className="flex flex-col p-5 border rounded-lg border-orange-100 bg-orange-300 items-center w-full max-w-[500px] md:max-w-[600px] lg:max-w-[700px] mx-auto shadow-md">
                            <MesoChart userCharacters={userCharacters}></MesoChart>
                        </div>
                    </div>
                </div>

                
            </div>
        </div>
    );

};

export default Tracker;