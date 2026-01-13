import { useState, useEffect } from 'react';
import { availableBosses } from './availableBosses';
import { getDifficultyBanner } from './difficultyBanners';
import { addBossToCharacter, updateBossToCharacter, deleteBossToCharacter } from '../api/trackerService';

export default function BossManager({
	userId,
	characterId,
	weeklyBosses = [],
	onBossesUpdate,
	onCharacterRefetch }) {

	const [bossSlots, setBossSlots] = useState([]);
	const [showBossModal, setShowBossModal] = useState(false);
	const [currentSlot, setCurrentSlot] = useState(null);
	const [selectedBoss, setSelectedBoss] = useState(null);
	const [selectedDifficulty, setSelectedDifficulty] = useState('');
	const [selectedPartySize, setSelectedPartySize] = useState('');
	const [isEditing, setIsEditing] = useState(false);
	const [editingBoss, setEditingBoss] = useState(null);
	const [searchQuery, setSearchQuery] = useState('');

	// Initialize 14 slots when component mounts or weeklyBosses changes
	useEffect(() => {
		// Create 14 slots, fill with bosses sequentially
		const slots = Array.from({ length: 14 }, (_, index) => ({
			slotNumber: index + 1,
			boss: weeklyBosses[index] || null
		}));
		setBossSlots(slots);
	}, [weeklyBosses]);

	const bossImages = import.meta.glob(
		'/src/assets/boss_profiles/*.png',
		{ eager: true, import: 'default' }
	);

	const getBossImagePath = (bossName) => {
		const filename = bossName.toLowerCase().replace(/\s+/g, '_');
		return bossImages[`/src/assets/boss_profiles/${filename}.png`];
	};


	const changeToBackendName = (bossName, difficulty) => {
		const boss_name = bossName.toUpperCase().replace(/\s+/g, '_');
		const diffculty_ = difficulty.toUpperCase();
		let convertedBoss = diffculty_ + '_' + boss_name;
		return convertedBoss;
	};

	const getBossName = (backBossName) => {
		const { bossName } = parseBossFromBackend(backBossName);
		return bossName;
	};

	const getBossDifficulty = (backBossName) => {
		const { difficulty } = parseBossFromBackend(backBossName)
		return difficulty;
	};

	const parseBossFromBackend = (backendBossName) => {
		if (!backendBossName) return { difficulty: '', bossName: '' };

		const parts = backendBossName.split('_');

		const difficulty = parts[0].charAt(0).toUpperCase() + parts[0].slice(1).toLowerCase();

		const bossNameParts = parts.slice(1);
		const bossName = bossNameParts
			.map(part => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
			.join(' ');

		return { difficulty, bossName };
	};

	// Get list of already added boss names to prevent duplicates
	const addedBossNames = bossSlots
		.filter(slot => slot.boss !== null)
		.map(slot => getBossName(slot.boss.bossName));

	// Open modal to add/edit boss
	const handleSlotClick = (slotNumber, existingBoss = null) => {
		setCurrentSlot(slotNumber);

		if (existingBoss) {
			// Editing existing boss
			const name = getBossName(existingBoss.bossName);
			const diff = getBossDifficulty(existingBoss.bossName);
			setEditingBoss(existingBoss);
			setIsEditing(true);
			setSelectedBoss(name);
			setSelectedDifficulty(diff);
			setSelectedPartySize(existingBoss.partySize.toString());
		} else {
			// Adding new boss
			setEditingBoss(null);
			setIsEditing(false);
			setSelectedBoss(null);
			setSelectedDifficulty('');
			setSelectedPartySize('');
		}

		setShowBossModal(true);
	};

	// Handle boss selection
	const handleSelectBoss = (bossName) => {
		setSelectedBoss(bossName);
		setSelectedDifficulty('');
		setSelectedPartySize('');
	};


	// Save boss to slot
	const handleSaveBoss = async () => {
		if (!selectedBoss || !selectedDifficulty || !selectedPartySize) {
			alert('Please select boss, difficulty, and party size');
			return;
		}

		try {
			if (isEditing) {
				// Update existing boss
				const converted = changeToBackendName(selectedBoss, selectedDifficulty);
				const updatedBoss = await updateBossToCharacter(userId, characterId, editingBoss.id, { bossName: converted, partySize: selectedPartySize });
				// Update the slot with new data
				const newSlots = [...bossSlots];
				newSlots[currentSlot - 1] = { slotNumber: currentSlot, boss: updatedBoss };

				// Update parent with new array
				const newWeeklyBosses = newSlots.map(slot => slot.boss).filter(Boolean);
				onBossesUpdate(newWeeklyBosses);

				if (onCharacterRefetch) {
					await onCharacterRefetch();
				}

			} else {
				// Add new boss
				const converted = changeToBackendName(selectedBoss, selectedDifficulty);
				const addedBoss = await addBossToCharacter(userId, characterId, { bossName: converted, partySize: selectedPartySize });

				// Update the slot with new boss
				const newSlots = [...bossSlots];
				newSlots[currentSlot - 1] = { slotNumber: currentSlot, boss: addedBoss };

				// Update parent with new array
				const newWeeklyBosses = newSlots.map(slot => slot.boss).filter(Boolean);
				onBossesUpdate(newWeeklyBosses);

				if (onCharacterRefetch) {
					await onCharacterRefetch();
				}

			}

			// Reset and close
			closeModal();
			alert(isEditing ? 'Boss updated successfully!' : 'Boss added successfully!');
		} catch (err) {
			console.error('Error saving boss:', err);
			alert('Failed to save boss');
		}
	};

	// Handle deleting a boss
	const handleDeleteBoss = async () => {
		const boss = bossSlots[currentSlot - 1].boss;
		const name = getBossName(boss.bossName);
		const diff = getBossDifficulty(boss.bossName);
		const confirmed = window.confirm(
			`Are you sure you want to delete the boss ${name} (${diff})?`
		);

		if (!confirmed) return;

		try {
			const deletedBoss = await deleteBossToCharacter(userId, characterId, boss.id)

			// Clear the slot
			const newSlots = [...bossSlots];
			newSlots[currentSlot - 1] = { slotNumber: currentSlot, boss: null };

			// Update parent with new array
			const newWeeklyBosses = newSlots.map(slot => slot.boss).filter(Boolean);
			onBossesUpdate(newWeeklyBosses);

			if (onCharacterRefetch) {
				await onCharacterRefetch();
			}

			closeModal();
			alert('Boss removed successfully!');
		} catch (err) {
			console.error('Error deleting boss:', err);
			alert('Failed to delete boss');
		}
	};

	const closeModal = () => {
		setShowBossModal(false);
		setCurrentSlot(null);
		setSelectedBoss(null);
		setSelectedDifficulty('');
		setSelectedPartySize('');
		setIsEditing(false);
		setEditingBoss(null);
		setSearchQuery('');
	};

	const availablePartySizes = selectedBoss && selectedDifficulty
		? availableBosses[selectedBoss][selectedDifficulty]
		: [];

	const filledSlots = bossSlots.filter(slot => slot.boss !== null).length;

	const filteredBosses = Object.keys(availableBosses).filter(bossName =>
		bossName.toLowerCase().includes(searchQuery.toLowerCase())
	);

	return (
		<div className="w-full">
			{/* Header with Progress */}
			<div className="bg-orange-300 p-6 rounded-lg mb-4">
				<div className="flex justify-between items-center mb-4">
					<h3 className="text-xl font-bold text-gray-800">Weekly Bosses</h3>
					<span className="text-lg font-semibold text-black">
						{filledSlots} / 14 Cleared
					</span>
				</div>

				{/* 14 Boss Slots Grid */}
				<div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
					{bossSlots.map((slot) => (
						<button
							key={slot.slotNumber}
							onClick={() => handleSlotClick(slot.slotNumber, slot.boss)}
							className={`p-2 rounded-lg border-2 transition-all min-h-32 flex flex-col ${slot.boss
								? 'border-black bg-[{getBossImagePath(bossName)}] hover:bg-orange-150'
								: 'border-black border-dashed hover:border-black hover:bg-orange-200 bg-orange-100'
								}`}
						>
							{slot.boss ? (
								// Filled Slot

								<div className="flex flex-col h-full">
									<div className="relative w-full h-20 rounded overflow-hidden mb-2">
										<img
											src={getBossImagePath(getBossName(slot.boss.bossName))}
											alt={slot.boss.bossName}
											className="w-full h-full object-cover rounded"
											onError={(e) => {
												// Fallback if image doesn't exist
												e.target.src = '/images/bosses/default.png';
												// Or hide image and show text
												// e.target.style.display = 'none';
											}}
										/>
										{/* Difficulty Banner - Bottom Right Corner */}
										<img
											src={getDifficultyBanner(getBossDifficulty(slot.boss.bossName))}
											alt={"Normal"}
											className="absolute bottom-[0px] right-[0px] w-full object-contain drop-shadow-lg"
										/>
									</div>

									<div className="flex-1 flex flex-col justify-center">
										<p className="text-xs text-black">Party Size: {slot.boss.partySize}</p>
									</div>
								</div>
							) : (
								// Empty Slot
								<div className="flex flex-col items-center justify-center h-full">
									<div className="text-3xl text-black mb-2">+</div>
									<div className="text-xs text-black">Slot {slot.slotNumber}</div>
								</div>
							)}
						</button>
					))}
				</div>
			</div>

			{/* Boss Selection Modal */}
			{showBossModal && (
				<div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4">
					<div className="bg-orange-300 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
						<div className="p-6">
							<div className="flex justify-between items-center mb-6">
								<h2 className="text-2xl font-bold text-gray-800">
									{isEditing ? 'Edit Boss' : `Add Boss to Slot ${currentSlot}`}
								</h2>
								<button
									onClick={closeModal}
									className="text-gray-500 hover:text-gray-700 text-2xl"
								>
									×
								</button>
							</div>

							{/* Search Bar */}
							{!isEditing && (
								<div className="mb-6">
									<div className="relative">
										<input
											type="text"
											placeholder="Search for a boss..."
											value={searchQuery}
											onChange={(e) => setSearchQuery(e.target.value)}
											className="w-full px-4 py-3 pl-10 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
										/>
										<svg
											className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
											fill="none"
											stroke="currentColor"
											viewBox="0 0 24 24"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
											/>
										</svg>
										{searchQuery && (
											<button
												onClick={() => setSearchQuery('')}
												className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
											>
												×
											</button>
										)}
									</div>
									{searchQuery && (
										<p className="text-sm text-gray-600 mt-2">
											Found {filteredBosses.length} boss{filteredBosses.length !== 1 ? 'es' : ''}
										</p>
									)}
								</div>
							)}


							{/* Boss Selection Grid */}
							<div className="mb-6">
								<h3 className="text-lg font-semibold mb-3">Select Boss</h3>
								<div className="grid grid-cols-3 lg:grid-cols-4 gap-3">
									{filteredBosses.map((bossName) => {
										const isAlreadyAdded = addedBossNames.includes(bossName) &&
											(!isEditing || bossName !== selectedBoss);
										return (
											<button
												key={bossName}
												onClick={() => !isAlreadyAdded && handleSelectBoss(bossName)}
												disabled={isAlreadyAdded}
												className={`p-4 rounded-lg border-2 transition-all ${selectedBoss === bossName
													? 'border-orange-600 bg-orange-100'
													: isAlreadyAdded
														? 'border-gray-200 bg-gray-200 opacity-25 cursor-not-allowed'
														: 'border-gray-100 hover:border-gray-300'
													}`}
											>
												<div className="w-full h-30 bg-orange-300 rounded mb-2 flex items-center justify-center">
													<img
														src={getBossImagePath(bossName)}
														alt={bossName}
														className="w-full h-full object-cover rounded"
														onError={(e) => {
															// Fallback if image doesn't exist
															e.target.src = '/images/bosses/default.png';
															// Or hide image and show text
															// e.target.style.display = 'none';
														}}
													/>
												</div>
												<p className="font-semibold text-center text-sm">{bossName}</p>
											</button>
										);
									})}
								</div>
								{/* No results message */}
								{filteredBosses.length === 0 && (
									<div className="text-center py-8 text-gray-500">
										<p className="text-lg">No bosses found matching "{searchQuery}"</p>
										<button
											onClick={() => setSearchQuery('')}
											className="mt-2 text-orange-500 hover:text-orange-600 font-semibold"
										>
											Clear search
										</button>
									</div>
								)}
							</div>

							{/* Difficulty Selection */}
							{selectedBoss && (
								<div className="mb-6">
									<h3 className="text-lg font-semibold mb-3">Select Difficulty</h3>
									<div className="flex flex-wrap gap-2">
										{Object.keys(availableBosses[selectedBoss]).map((difficulty) => (
											<button
												key={difficulty}
												onClick={() => {
													setSelectedDifficulty(difficulty);
													setSelectedPartySize('');
												}}
												className={`px-4 py-2 rounded-lg font-semibold transition-colors ${selectedDifficulty === difficulty
													? 'bg-orange-500 text-white'
													: 'bg-gray-200 hover:bg-gray-300 text-gray-800'
													}`}
											>
												{difficulty}
											</button>
										))}
									</div>
								</div>
							)}

							{/* Party Size Selection */}
							{selectedDifficulty && (
								<div className="mb-6">
									<h3 className="text-lg font-semibold mb-3">Select Party Size</h3>
									<div className="flex flex-wrap gap-2">
										{availablePartySizes.map((size) => (
											<button
												key={size}
												onClick={() => setSelectedPartySize(size.toString())}
												className={`px-4 py-2 rounded-lg font-semibold transition-colors ${selectedPartySize === size.toString()
													? 'bg-orange-500 text-white'
													: 'bg-gray-200 hover:bg-gray-300 text-gray-800'
													}`}
											>
												{size}
											</button>
										))}
									</div>
								</div>
							)}

							{/* Action Buttons */}
							<div className="flex gap-3">
								<button
									onClick={handleSaveBoss}
									disabled={!selectedBoss || !selectedDifficulty || !selectedPartySize}
									className="flex-1 bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white font-semibold py-3 rounded-lg transition-colors"
								>
									{isEditing ? 'Save Changes' : 'Add Boss'}
								</button>
								{isEditing && (
									<button
										onClick={handleDeleteBoss}
										className="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold py-3 rounded-lg transition-colors"
									>
										Delete Boss
									</button>
								)}
								<button
									onClick={closeModal}
									className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-3 rounded-lg transition-colors"
								>
									Cancel
								</button>
							</div>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}