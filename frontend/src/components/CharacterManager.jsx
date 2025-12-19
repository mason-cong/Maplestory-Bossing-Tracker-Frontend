import { useState } from 'react';
import defaultCharacter from '../assets/default-character.png';

export default function CharacterManager({ 
  userCharacters, 
  setUserCharacters,
  displayedCharacter,
  setDisplayedCharacter,
  displayedCharacterMeso,
  setDisplayedCharacterMeso
}) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newCharacter, setNewCharacter] = useState({
    name: '',
    class: '',
    level: ''
  });

  const handleCreateCharacter = () => {
    setShowCreateForm(true);
    setIsDropdownOpen(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewCharacter(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmitCharacter = async () => {
    // Validation
    if (!newCharacter.name || !newCharacter.class || !newCharacter.level) {
      alert('Please fill in all fields');
      return;
    }

    try {
      // Replace with your actual API endpoint
      const response = await fetch('/api/characters', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: newCharacter.name,
          class: newCharacter.class,
          level: parseInt(newCharacter.level),
          // Add userId from your auth context if needed
        })
      });

      if (!response.ok) throw new Error('Failed to create character');

      const createdCharacter = await response.json();

      // Update parent state via props
      setUserCharacters(prev => [...prev, createdCharacter]);
      setDisplayedCharacter(createdCharacter);

      // Reset form
      setNewCharacter({ name: '', class: '', level: '' });
      setShowCreateForm(false);

      alert('Character created successfully!');
    } catch (err) {
      console.error('Error creating character:', err);
      alert('Failed to create character');
    }
  };

  const handleCancelCreate = () => {
    setShowCreateForm(false);
    setNewCharacter({ name: '', class: '', level: '' });
  };

  const defaultChar = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect fill="%23ddd" width="100" height="100"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%23999"%3EChar%3C/text%3E%3C/svg%3E';

  return (
    <div className="w-full">
      {showCreateForm ? (
        // Character Creation Form
        <div className="bg-white p-8 border rounded-lg border-orange-200 shadow-lg max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-orange-800 mb-6">Create New Character</h2>
          
          <div className="space-y-6">
            {/* Character Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                Character Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={newCharacter.name}
                onChange={handleInputChange}
                placeholder="Enter character name"
                className="w-full px-4 py-2 border border-orange-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            {/* Character Class */}
            <div>
              <label htmlFor="class" className="block text-sm font-semibold text-gray-700 mb-2">
                Class
              </label>
              <select
                id="class"
                name="class"
                value={newCharacter.class}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-orange-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="">Select a class</option>
                <option value="Warrior">Warrior</option>
                <option value="Mage">Mage</option>
                <option value="Archer">Archer</option>
                <option value="Thief">Thief</option>
                <option value="Pirate">Pirate</option>
              </select>
            </div>

            {/* Character Level */}
            <div>
              <label htmlFor="level" className="block text-sm font-semibold text-gray-700 mb-2">
                Level
              </label>
              <input
                type="number"
                id="level"
                name="level"
                value={newCharacter.level}
                onChange={handleInputChange}
                placeholder="Enter level (1-300)"
                min="1"
                max="300"
                className="w-full px-4 py-2 border border-orange-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            {/* Buttons */}
            <div className="flex gap-3 pt-4">
              <button
                onClick={handleSubmitCharacter}
                className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                Create Character
              </button>
              <button
                onClick={handleCancelCreate}
                className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      ) : (
        // Character Display Card
        <div className="flex flex-row p-5 border rounded-lg border-orange-100 bg-orange-300 w-full max-w-[500px] md:max-w-[600px] lg:max-w-[700px] mx-auto">
          <div className="min-h-20 w-1/3 lg:min-w-28 flex items-center justify-center">
            <img src={defaultCharacter} className="h-auto w-full max-w-32" alt="Character" />
          </div>
          <div className="p-3 flex flex-col items-center w-full">
            <div className="my-3 flex flex-row justify-between w-full items-center text-lg">
              {/* Character Name Dropdown */}
              <div className="relative flex-1 mr-3">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-2 hover:text-orange-700 transition-colors"
                >
                  <span className="font-semibold">
                    {displayedCharacter?.name || 'Select Character'}
                  </span>
                  <svg
                    className={`w-4 h-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Dropdown Menu */}
                {isDropdownOpen && (
                  <div className="absolute left-0 mt-2 w-64 bg-white rounded-lg shadow-xl z-10 max-h-80 overflow-y-auto border border-orange-200">
                    {/* Add New Character Option */}
                    <button
                      onClick={handleCreateCharacter}
                      className="w-full text-left px-4 py-3 text-green-600 hover:bg-orange-50 transition-colors font-semibold border-b border-orange-200 flex items-center gap-2"
                    >
                      <span className="text-xl">+</span>
                      Create New Character
                    </button>

                    {/* Character List */}
                    {userCharacters && userCharacters.length > 0 ? (
                        userCharacters.map((character) => (
                            <button
                                key={character.id}
                                onClick={() => {
                                    setDisplayedCharacter(character);
                                    setDisplayedCharacterMeso(character.meso);
                                    setIsDropdownOpen(false);
                                }}
                                className={`w-full text-left px-4 py-3 hover:bg-orange-50 transition-colors ${
                                    displayedCharacter?.id === character.id ? 'bg-orange-100' : ''
                                }`}
                            >
                                <p className="font-semibold text-gray-800">{character.characterName}</p>
                            </button>
                        ))
                    ) : (
                        <div className="px-4 py-3 text-gray-500 text-sm">No characters found</div>
                    )}
                  </div>
                )}
              </div>

              <button className="bg-black text-white px-3 py-1 rounded hover:bg-gray-800 transition-colors">
                Edit
              </button>
            </div>
            <div className="flex flex-col w-full gap-3">
                <div className="flex flex-row items-center justify-between w-full">
                   <strong className="text-sm">Class:</strong>
                   <p>{displayedCharacter?.characterClass || 'N/A'}</p>
                </div>
                <div className="flex flex-row items-center justify-between w-full">
                    <strong className="text-sm">Weekly Mesos:</strong>
                    <p>{
                        displayedCharacterMeso.toLocaleString() // Formats number with commas
                    }</p>
                </div>
                <div className="flex flex-row items-center justify-between w-full">
                    <strong className="text-sm">Level:</strong>
                    <p>{displayedCharacter?.characterLevel || 0}</p>
                </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}