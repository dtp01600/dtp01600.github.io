function saveGame() {
    const gameState = {
        currentTurn: currentTurn,
        timerSeconds: timerSeconds,
        slotSelections: [...slotSelections.entries()],
        characterSelections: [...characterSelections.entries()]
    };

    localStorage.setItem(
        "kudogGameState",
        JSON.stringify(gameState)
    );
}

function loadGame() {
    const saved =
        localStorage.getItem("kudogGameState");

    if (!saved) return;

    const gameState =
        JSON.parse(saved);

    currentTurn =
        gameState.currentTurn ?? 1;

    timerSeconds =
        gameState.timerSeconds ?? 60;

    slotSelections.clear();
    characterSelections.clear();

    for (const [slotKey, characterId]
        of gameState.slotSelections ?? []) {
        slotSelections.set(slotKey, characterId);
    }

    for (const [characterId, slotKey]
        of gameState.characterSelections ?? []) {
        characterSelections.set(characterId, slotKey);
    }
}

function restoreSelectedSlots() {
    for (const [slotKey, characterId] of slotSelections) {
        const [player, slotNumber] = slotKey.split("-");

        const slot = document.querySelector(
            `.player[data-player="${player}"] .character-slot[data-slot="${slotNumber}"]`
        );

        const character = characterList.find(
            character => character.id === characterId
        );

        if (!slot || !character) continue;

        selectedSlot = slot;

        selectedCharacter(character);

        const label = slot.querySelector(".slot-label");

        if (label) {
            label.textContent = character.name;
            label.classList.add("visible");
        }
    }

    selectedSlot = null;
}