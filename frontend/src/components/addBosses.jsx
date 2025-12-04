import React, { useState, useEffect } from 'react';

const availableBosses = {
  "Zakum": {
    "Chaos": [1,2,3,4,5,6]
  },
  "Hilla": {
    "Hard": [1,2,3,4,5,6]
  },
  "Cygnus": {
    "Easy": [1,2,3,4,5,6],
    "Normal": [1,2,3,4,5,6]
  },
  "Pink Bean": {
    "Chaos": [1,2,3,4,5,6]
  },
  "Pierre": {
    "Chaos": [1,2,3,4,5,6]
  },
  "Von Bon": {
    "Chaos": [1,2,3,4,5,6]
  },
  "Crimson Queen": {
    "Chaos": [1,2,3,4,5,6]
  },
  "Vellum": {
    "Chaos": [1,2,3,4,5,6]
  },
  "Papulatus": {
    "Chaos": [1,2,3,4,5,6]
  },
  "Magnus": {
    "Hard": [1,2,3,4,5,6]
  },
  "Akechi Mitsuhide": {
    "Normal": [1,2,3,4,5,6]
  },
  "Lotus": {
    "Normal": [1,2,3,4,5,6],
    "Hard": [1,2,3,4,5,6],
    "Extreme": [1,2]
  },
  "Damien": {
    "Normal": [1,2,3,4,5,6],
    "Hard": [1,2,3,4,5,6]
  },
  "Slime Guardian": {
    "Normal": [1,2,3,4,5,6],
    "Chaos": [1,2,3,4,5,6]
  },
  "Lucid": {
    "Easy": [1,2,3,4,5,6],
    "Normal": [1,2,3,4,5,6],
    "Hard": [1,2,3,4,5,6]
  },
  "Will": {
    "Easy": [1,2,3,4,5,6],
    "Normal": [1,2,3,4,5,6],
    "Hard": [1,2,3,4,5,6]
  },
  "Gloom": {
    "Normal": [1,2,3,4,5,6],
    "Chaos": [1,2,3,4,5,6]
  },
  "Darknell": {
    "Normal": [1,2,3,4,5,6],
    "Hard": [1,2,3,4,5,6]
  },
  "Verus Hilla": {
    "Normal": [1,2,3,4,5,6],
    "Hard": [1,2,3,4,5,6]
  },
  "Seren": {
    "Normal": [1,2,3,4,5,6],
    "Hard": [1,2,3,4,5,6],
    "Extreme": [1,2,3,4,5,6]
  },
  "Kalos": {
    "Easy": [1,2,3,4,5,6],
    "Normal": [1,2,3,4,5,6],
    "Chaos": [1,2,3,4,5,6],
    "Extreme": [1,2,3,4,5,6]
  },
  "Kaling": {
    "Easy": [1,2,3,4,5,6],
    "Normal": [1,2,3,4,5,6],
    "Hard": [1,2,3,4,5,6],
    "Extreme": [1,2,3,4,5,6]
  },
  "Limbo": {
    "Normal": [1,2,3],
    "Hard": [1,2,3]
  },
}

const addBosses = ({ bosses }) => {

    const [selectedBoss, setSelectedBoss] = useState("");
    const [selectedDifficulty, setSelectedDifficulty] = useState("");
    const [selectedPartySize, setSelectedPartySize] = useState("");

    const [currentBoss, setCurrentBoss] = useState("");
    const [currentDifficulty, setCurrentDifficulty] = useState({});
    const [currentPartySize, setCurrentPartySize] = useState([]);

    useEffect(() => { //restore from users boss list
      if (selectedBoss) {
        setCurrentDifficulty(availableBosses[selectedBoss])
        console.log(availableBosses[selectedBoss]);
        setSelectedDifficulty("");
        setSelectedPartySize({});
      } else { //set to some default value
        setCurrentDifficulty("");
        setCurrentPartySize("");
      }
    },[selectedBoss]);

     useEffect(() => { //restore from users boss list
      if (selectedDifficulty) {
        setCurrentPartySize(availableBosses[selectedBoss][selectedDifficulty]);
        console.log(currentPartySize);
      } else { //set to some default value
        setCurrentPartySize([]);
      }
    },[selectedDifficulty]);

    const handleBossChange = (e) => {
        setSelectedBoss(e.target.value);
    } 

    const handleDifficultyChange = (e) => {
        setSelectedDifficulty(e.target.value);
    }



    return (
      <div className="w-[20rem] ml-[2rem] p-3">
        <div className='grid grid-cols-7 gap-4'>
            <div className='text-center flex items-center w-full'>
                <img className="w-10 h-10 mx-auto rounded object-contain" alt="Zakum" src={null}/>
            </div>
            <p>Bosses:</p>
            <select className="" name="bosses" value={selectedBoss} onChange={handleBossChange}>
              <option>Select Boss</option>
              {Object.keys(availableBosses).map((bossNames, index) => (
                <option key={index}>{bossNames}</option>
              ))}

            </select>
            <p>Difficulty:</p>
            <select className="" name="difficulty" value={selectedDifficulty} onChange={handleDifficultyChange}>
              <option>Select Difficulty</option>
              {Object.keys(currentDifficulty).map((difficulties, index) => (
                <option key={index}>{difficulties}</option>
              ))}
            </select>
            <p>Party Size:</p>
            <select className="" name="partySize" value={selectedPartySize} >
              <option>Select Party Size</option>
              {currentPartySize.map((size, index) => (
                <option key={index}>{size}</option>
              ))}
            </select>
        </div>

      </div>
    );
  };

export default addBosses;