import { useState } from 'react';
import defaultCharacter from '../assets/default-character.png';
import { createNewUserCharacters, updateUserCharacter, deleteUserCharacter } from '../api/trackerService';
import { CHARACTER_CLASSES_BY_TYPE } from '../assets/characterClasses';

export default function CharacterManager({
    userId,
    userCharacters,
    setUserCharacters,
    displayedCharacter,
    setDisplayedCharacter
}) {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [newCharacter, setNewCharacter] = useState({
        characterName: '',
        characterClass: '',
        characterLevel: ''
    });

    const [showEditForm, setShowEditForm] = useState(false);
    const [editCharacter, setEditCharacter] = useState({
        characterName: '',
        characterClass: '',
        characterLevel: ''
    });

    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

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
        if (!newCharacter.characterName || !newCharacter.characterClass || !newCharacter.characterLevel) {
            alert('Please fill in all fields');
            return;
        }

        try {
            const createdCharacter = await createNewUserCharacters(userId, newCharacter);

            // Update parent state via props
            setUserCharacters(prev => [...prev, createdCharacter]);
            setDisplayedCharacter(createdCharacter);

            // Reset form
            setNewCharacter({ characterName: '', characterClass: '', characterLevel: '' });
            setShowCreateForm(false);

            alert('Character created successfully!');
        } catch (err) {
            console.error('Error creating character:', err);
            alert('Failed to create character');
        }
    };

    const handleCancelCreate = () => {
        setShowCreateForm(false);
        setNewCharacter({ characterName: '', characterClass: '', characterLevel: '' });
    };


    const handleEditCharacter = () => {
        if (!displayedCharacter) {
            alert('No character selected to edit');
            return;
        }
        // Pre-fill edit form with current character data
        setEditCharacter({
            characterName: displayedCharacter.characterName,
            characterClass: displayedCharacter.characterClass,
            characterLevel: displayedCharacter.characterLevel
        });
        setShowEditForm(true);
    };

    const handleEditInputChange = (e) => {
        const { name, value } = e.target;
        setEditCharacter(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmitEdit = async () => {
        if (!editCharacter.characterName || !editCharacter.characterClass || !editCharacter.characterLevel) {
            alert('Please fill in all fields');
            return;
        }

        try {
            const updatedCharacter = await updateUserCharacter(userId, displayedCharacter.id, editCharacter)

            // Update parent state
            setUserCharacters(prev =>
                prev.map(char => char.id === displayedCharacter.id ? updatedCharacter : char)
            );
            setDisplayedCharacter(updatedCharacter);

            setEditCharacter({ characterName: '', characterClass: '', characterLevel: '' });
            setShowEditForm(false);
            alert('Character updated successfully!');
        } catch (err) {
            console.error('Error updating character:', err);
            alert('Failed to update character');
        }
    };

    const handleCancelEdit = () => {
        setShowEditForm(false);
        setEditCharacter({ characterName: '', characterClass: '', characterLevel: '' });
    };

    const handleDeleteCharacter = () => {
        if (!displayedCharacter) {
            alert('No character selected to delete');
            return;
        }
        setShowDeleteConfirm(true);
    };

    const confirmDelete = async () => {
        try {
            const deletedCharacter = await deleteUserCharacter(userId, displayedCharacter.id);

            const updatedCharacters = userCharacters.filter(
                char => char.id !== displayedCharacter.id
            );
            setUserCharacters(updatedCharacters);

            if (updatedCharacters.length > 0) {
                setDisplayedCharacter(updatedCharacters[0]);
            } else {
                setDisplayedCharacter(null);
            }

            setShowDeleteConfirm(false);
            alert('Character deleted successfully!');
        } catch (err) {
            console.error('Error deleting character:', err);
            alert('Failed to delete character');
        }
    };

    const cancelDelete = () => {
        setShowDeleteConfirm(false);
    };

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
                                name="characterName"
                                value={newCharacter.characterName}
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
                                name="characterClass"
                                value={newCharacter.characterClass}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2 border border-orange-300 rounded-lg"
                            >
                                <option value="">Select a class</option>
                                {Object.entries(CHARACTER_CLASSES_BY_TYPE).map(([type, classes]) => (
                                    <optgroup key={type} label={type}>
                                        {classes.map(className => (
                                            <option key={className} value={className}>
                                                {className}
                                            </option>
                                        ))}
                                    </optgroup>
                                ))}
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
                                name="characterLevel"
                                value={newCharacter.characterLevel}
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
            ) : showEditForm ? (
                // Character Edit Form
                <div className="bg-white p-8 border rounded-lg border-orange-200 shadow-lg max-w-2xl mx-auto">
                    <h2 className="text-2xl font-bold text-orange-800 mb-6">Edit Character</h2>

                    <div className="space-y-6">
                        {/* Character Name */}
                        <div>
                            <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                                Character Name
                            </label>
                            <input
                                type="text"
                                id="name"
                                name="characterName"
                                value={editCharacter.characterName}
                                onChange={handleEditInputChange}
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
                                name="characterClass"
                                value={editCharacter.characterClass}
                                onChange={handleEditInputChange}
                                className="w-full px-4 py-2 border border-orange-300 rounded-lg"
                            >
                                <option value="">Select a class</option>
                                {Object.entries(CHARACTER_CLASSES_BY_TYPE).map(([type, classes]) => (
                                    <optgroup key={type} label={type}>
                                        {classes.map(className => (
                                            <option key={className} value={className}>
                                                {className}
                                            </option>
                                        ))}
                                    </optgroup>
                                ))}
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
                                name="characterLevel"
                                value={editCharacter.characterLevel}
                                onChange={handleEditInputChange}
                                placeholder="Enter level (1-300)"
                                min="1"
                                max="300"
                                className="w-full px-4 py-2 border border-orange-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                            />
                        </div>

                        {/* Buttons */}
                        <div className="flex gap-3 pt-4">
                            <button
                                onClick={handleSubmitEdit}
                                className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                            >
                                Edit Character
                            </button>
                            <button
                                onClick={handleCancelEdit}
                                className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-3 px-6 rounded-lg transition-colors"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            ) : (

                // Character Display Card
                <div className="flex flex-row p-5 border rounded-lg border-orange-300 bg-orange-300 w-full max-w-[500px] md:max-w-[600px] lg:max-w-[700px] mx-auto">
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
                                        {displayedCharacter?.characterName || 'Select Character'}
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
                                                        setIsDropdownOpen(false);
                                                    }}
                                                    className={`w-full text-left px-4 py-3 hover:bg-orange-50 transition-colors ${displayedCharacter?.id === character.id ? 'bg-orange-100' : ''
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
                            <div className="flex gap-2">
                                <button
                                    className="bg-orange-100 text-black px-3 rounded hover:bg-orange-200 transition-colors"
                                    onClick={handleEditCharacter}>
                                    Edit
                                </button>
                                <button
                                    className="bg-red-200 text-black px-3 rounded hover:bg-red-400 transition-colors"
                                    onClick={handleDeleteCharacter}>
                                    Delete
                                </button>
                            </div>

                        </div>
                        <div className="flex flex-col w-full gap-3">
                            <div className="flex flex-row items-center justify-between w-full">
                                <strong className="text-sm">Class:</strong>
                                <p>{displayedCharacter?.characterClass || 'N/A'}</p>
                            </div>
                            <div className="flex flex-row items-center justify-between w-full">
                                <strong className="text-sm">Weekly Mesos:</strong>
                                <p>{displayedCharacter.characterMeso || 0}</p>
                            </div>
                            <div className="flex flex-row items-center justify-between w-full">
                                <strong className="text-sm">Level:</strong>
                                <p>{displayedCharacter?.characterLevel || 0}</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/*Character delete confirmation*/}
            {showDeleteConfirm && (
                <div className="fixed inset-0 bg-opacity-0 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-xl max-w-md">
                        <h3 className="text-xl font-bold text-gray-800 mb-4">Delete Character?</h3>
                        <p className="text-gray-600 mb-6">
                            Are you sure you want to delete <strong>{displayedCharacter?.characterName}</strong>
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={confirmDelete}
                                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                            >
                                Delete
                            </button>
                            <button
                                onClick={cancelDelete}
                                className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded-lg transition-colors"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>)}

        </div>
    );
}