import { useState } from 'react';
import defaultCharacter from '../assets/default-character.png';
import { createNewUserCharacters, updateUserCharacter, deleteUserCharacter, copyBossesToCharacter } from '../api/trackerService';
import { CHARACTER_CLASSES_BY_TYPE } from '../assets/characterClasses';
import toast from 'react-hot-toast'

export default function CharacterManager({
    userId,
    userCharacters,
    setUserCharacters,
    displayedCharacter,
    setDisplayedCharacter,
    onCharacterRefetch
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

    const [showDuplicateModal, setShowDuplicateModal] = useState(false);
    const [sourceCharacter, setSourceCharacter] = useState(null);

    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isDuplicating, setIsDuplicating] = useState(false);

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
            toast.error('Please fill in all fields');
            return;
        }

        if (newCharacter.characterLevel > 300 || newCharacter.characterLevel <= 0) {
            toast.error('Please enter a valid character level');
            return;
        }

        if (isSubmitting) {
            return;
        }
        setIsSubmitting(true);

        const loadingToast = toast.loading('Creating character...');

        try {
            const createdCharacter = await createNewUserCharacters(userId, newCharacter);

            // Update parent state via props
            setUserCharacters(prev => [...prev, createdCharacter]);
            setDisplayedCharacter(createdCharacter);

            // Reset form
            setNewCharacter({ characterName: '', characterClass: '', characterLevel: '' });
            setShowCreateForm(false);

            toast.success('Character created successfully!', {
                id: loadingToast
            });
        } catch (err) {
            console.error('Error creating character:', err);
            toast.error('Failed to create character', {
                id: loadingToast
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCancelCreate = () => {
        setShowCreateForm(false);
        setNewCharacter({ characterName: '', characterClass: '', characterLevel: '' });
    };

    const handleEditCharacter = () => {
        if (!displayedCharacter) {
            toast.error('No character selected to edit');
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
            toast.error('Please fill in all fields');
            return;
        }

        if (editCharacter.characterLevel > 300 || editCharacter.characterLevel <= 0) {
            toast.error('Please enter a valid character level');
            return;
        }

        const loadingToast = toast.loading("Updating character...")
        if (isEditing) {
			return;
		}
		setIsEditing(true);
        try {
            const updatedCharacter = await updateUserCharacter(userId, displayedCharacter.id, editCharacter)

            // Update parent state
            setUserCharacters(prev =>
                prev.map(char => char.id === displayedCharacter.id ? updatedCharacter : char)
            );
            setDisplayedCharacter(updatedCharacter);

            setEditCharacter({ characterName: '', characterClass: '', characterLevel: '' });
            setShowEditForm(false);
            toast.success('Character updated successfully!', {
                id: loadingToast
            });
        } catch (err) {
            console.error('Error updating character:', err);
            toast.error('Failed to update character', {
                id: loadingToast
            });
        } finally {
			setIsEditing(false);
		}
    };

    const handleCancelEdit = () => {
        setShowEditForm(false);
        setEditCharacter({ characterName: '', characterClass: '', characterLevel: '' });
    };

    const handleDeleteCharacter = () => {
        if (!displayedCharacter) {
            toast.error('No character selected to delete');
            return;
        }
        setShowDeleteConfirm(true);
    };

    const confirmDelete = async () => {
        const loadingToast = toast.loading('Deleting character...')
        if (isDeleting) {
            return;
        }
        setIsDeleting(true);

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
            toast.success('Character deleted successfully!', {
                id: loadingToast
            });
        } catch (err) {
            console.error('Error deleting character:', err);
            toast.error('Failed to delete character', {
                id: loadingToast
            });
        } finally {
            setIsDeleting(false);
        }
    };

    const cancelDelete = () => {
        setShowDeleteConfirm(false);
    };

    const handleDuplicateBosses = () => {
        setSourceCharacter(displayedCharacter);
        setShowDuplicateModal(true);
    };

    const handleCopyBosses = async (targetCharacter) => {
        const loadingToast = toast.loading(`Copying bosses to ${targetCharacter.characterName}...`);

        if (isDuplicating) {
			return;
		}
		setIsDuplicating(true);
        try {
            // Get source character's bosses
            const bossesToCopy = sourceCharacter.weeklyBosses;

            if (!bossesToCopy || bossesToCopy.length === 0) {
                toast.error('No bosses to copy', { id: loadingToast });
                return;
            }

            const response = await copyBossesToCharacter(userId, targetCharacter.id,
                {
                    weeklyCharacterId: sourceCharacter.id,
                    replace: true
                });

            // Refetch the target character to get latest bosses
            if (onCharacterRefetch) {
                await onCharacterRefetch();
            }

            setUserCharacters(prev =>
                prev.map(char =>
                    char.id === targetCharacter.id
                        ? { ...char, ...response }
                        : char
                )
            );

            setDisplayedCharacter(response);

            toast.success(`${bossesToCopy.length} bosses copied to ${targetCharacter.characterName}!`, {
                id: loadingToast
            });

            setShowDuplicateModal(false);
            setSourceCharacter(null);

        } catch (err) {
            console.error('Error copying bosses:', err);
            toast.error('Failed to copy bosses', { id: loadingToast });
        } finally {
			setIsDuplicating(false);
		}
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
                                disabled={isSubmitting}
                                className="flex-1 bg-green-500 hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg transition-colors"
                            >
                                {isSubmitting ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Creating character...
                                    </span>
                                ) : (
                                    'Create Character'
                                )}
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
                                disabled={isEditing}
                                className="flex-1 bg-green-500 hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg transition-colors"
                            >
                                {isEditing ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Editing character...
                                    </span>
                                ) : (
                                    'Edit Character'
                                )}
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
                <div className="flex flex-row p-3 border rounded-lg border-orange-300 bg-orange-300 w-full max-w-[500px] md:max-w-[600px] lg:max-w-[700px] mx-auto">
                    <div className="min-h-20 w-1/3 lg:min-w-28 flex items-center justify-center">
                        <img src={defaultCharacter} className="h-auto w-full max-w-32" alt="Character" />
                    </div>
                    <div className="p-3 flex flex-col items-center w-full">
                        <div className="my-3 flex flex-row justify-between w-full items-center text-lg">
                            {/* Character Name Dropdown */}
                            <div className="relative flex w-full">
                                <button
                                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                    className="flex flex-grow items-center gap-2 hover:text-orange-700 transition-colors"
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
                                <div className="flex mb-2 gap-3 justify-end">
                                    {/*Character editing buttons*/}
                                    {displayedCharacter && displayedCharacter.weeklyBosses?.length > 0 && (
                                        <button
                                            onClick={() => {
                                                handleDuplicateBosses();
                                                setIsDropdownOpen(false);
                                            }}
                                            className="text-left px-3 py-1 text-black rounded bg-white hover:bg-orange-50 transition-colors flex items-center gap-2"
                                        >
                                            <span className="text-xl">📋</span>
                                            Duplicate Bosses
                                        </button>
                                    )}
                                    <button
                                        className="bg-green-500 text-white px-3 rounded hover:bg-green-600 transition-colors shadow-lg"
                                        onClick={handleEditCharacter}>
                                        Edit
                                    </button>
                                    <button
                                        className="bg-red-400 text-white px-3 rounded hover:bg-red-600 transition-colors shadow-lg"
                                        onClick={handleDeleteCharacter}>
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col w-full gap-3">
                            <div className="flex flex-row text-lg items-center justify-between w-full">
                                <strong>Class:</strong>
                                <p>{displayedCharacter?.characterClass || 'N/A'}</p>
                            </div>
                            <div className="flex flex-row text-lg items-center justify-between w-full">
                                <strong>Weekly Mesos:</strong>
                                <p>{(displayedCharacter?.characterMeso || 0).toLocaleString()}</p>
                            </div>
                            <div className="flex flex-row text-lg items-center justify-between w-full">
                                <strong>Level:</strong>
                                <p>{displayedCharacter?.characterLevel || 0}</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Duplicate Modal */}
            {showDuplicateModal && (
                <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-6">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">
                            Duplicate Boss List
                        </h2>
                        <div className="mb-6">
                            <p className="text-gray-600 mb-2">
                                Copy bosses from <strong>{sourceCharacter?.characterName}</strong> to:
                            </p>
                            <p className="text-sm text-gray-500">
                                ({sourceCharacter?.weeklyBosses?.length || 0} bosses will be copied)
                            </p>
                        </div>

                        {/* Target Character Selection */}
                        <div className="space-y-2 max-h-96 overflow-y-auto mb-6">
                            {userCharacters
                                .filter(char => char.id !== sourceCharacter?.id)
                                .map((character) => (
                                    <button
                                        key={character.id}
                                        onClick={() => handleCopyBosses(character)}
                                        disabled={isDuplicating}
                                        className="w-full p-4 border-2 border-gray-200 rounded-lg hover:border-orange-500 hover:bg-orange-50 transition-all text-left"
                                    >
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="font-semibold text-gray-800">{character.characterName}</p>
                                                <p className="text-sm text-gray-600">
                                                    Level {character.characterLevel} • {character.characterClass}
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    Current bosses: {character.weeklyBosses?.length || 0}
                                                </p>
                                            </div>
                                            <span className="text-2xl">→</span>
                                        </div>
                                    </button>
                                ))}
                        </div>

                        {/* Cancel Button */}
                        <button
                            onClick={() => {
                                setShowDuplicateModal(false);
                                setSourceCharacter(null);
                            }}
                            className="w-full bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-3 rounded-lg transition-colors"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}

            {/*Character delete confirmation*/}
            {showDeleteConfirm && (
                <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-xl max-w-md">
                        <h3 className="text-xl font-bold text-gray-800 mb-4">Delete Character?</h3>
                        <p className="text-gray-600 mb-6">
                            Are you sure you want to delete <strong>{displayedCharacter?.characterName}</strong>
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={confirmDelete}
                                disabled={isDeleting}
                                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                            >
                                {isDeleting ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Deleting boss...
                                    </span>
                                ) : (
                                    'Delete'
                                )}
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