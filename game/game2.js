const slotNavBody = document.querySelector("#slotNavBody");

let characterList = [];

fetch("/data/resonators.json")
    .then(response => response.json())
    .then(data => {

        characterList = data;

        characterList.sort((a, b) =>
            b.tier - a.tier
        ||  b.id - a.id
        );
        
        characterList.forEach(character => {
            const characterButton = document.createElement("button");

            characterButton.classList.add("character-choice");
            characterButton.dataset.id = character.id;

            characterButton.innerHTML = `
                ${character.icon
                    ? `<img class="character-icon" src="${character.icon}" alt="">`
                    : `<img class="character-icon">`
                }

                <span class="character-info">
                    <span class="character-name">${character.name}</span>
                    <span class="character-description">${character.attribute}</span>
                </span>
            `;

            characterButton.addEventListener("click", () => {
               selectCharacter(character); 
            });

            slotNavBody.appendChild(characterButton);
        });

    });


const undo = document.querySelector(".undo-turn");

undo.addEventListener("click", () => {

    // TURN 2 → Undo behaves like Reset All
    if (currentTurn === 2) {
        resetAllTeam.click();
        return;
    }

    // Nothing to undo
    if (currentTurn <= 1) return;


    // The action we are undoing happened on the previous turn
    const targetTurn = currentTurn - 1;
    const rule = turnRules[targetTurn];

    if (!rule) return;


    // Find the slot belonging to that turn
    const slotKey =
        `${rule.player}-${rule.slot}`;


    // Find the actual slot element
    const targetSlot =
        document.querySelector(
            `.player[data-player="${rule.player}"] ` +
            `.character-slot[data-slot="${rule.slot}"]`
        );

    if (!targetSlot) return;


    // Find the character assigned to that slot
    const characterId =
        slotSelections.get(slotKey);


    if (characterId === undefined) {

        // Previous turn was skipped because of timeout
        currentTurn--;

        updateTurn();
        updateSlotAvailability();
        updateSlotNav();

        closeSlotNav();

        return;
    }


    // Remove from both mappings
    slotSelections.delete(slotKey);
    characterSelections.delete(characterId);


    // Find the visual wrapper inside that slot
    const imageWrapper =
        targetSlot.querySelector(".slot-img-wrapper");

    if (!imageWrapper) return;

    currentTurn--;

    if (currentTurn <= 18) {
        startTurnTimer();
    }

    if (currentTurn < 2) {
        stopTimer();
        timer.textContent = 0;
    }

    updateTurn();
    updateSlotAvailability();
    updateSlotNav();

    const label = targetSlot.querySelector(".slot-label");

    if (label) {
        label.textContent = "";
        label.classList.remove("visible");
    }

    // Play your existing removal animation
    imageWrapper.classList.add("removing");


    imageWrapper.addEventListener("animationend", () => {

        imageWrapper.remove();

        closeSlotNav();

    }, { once: true });

});

function addSlotImage(targetSlot, character) {

    const imageWrapper = document.createElement("div");
    imageWrapper.classList.add("slot-img-wrapper");

    imageWrapper.dataset.characterId = character.id;

    const image = document.createElement("img");
    image.classList.add("slot-img");

    image.src = character["slot-img"];
    image.alt = character.name;

    imageWrapper.appendChild(image);
    targetSlot.appendChild(imageWrapper);
}


function selectedCharacter(character) {
    if (!selectedSlot) return;

    const targetSlot = selectedSlot;

    const oldWrapper =
        targetSlot.querySelector(".slot-img-wrapper");

    closeSlotNav();

    if (oldWrapper && oldWrapper.dataset.characterId === String(character.id)) {
        return;
    }

    if (!oldWrapper) {
        addSlotImage(targetSlot, character);
        return;
    }

    oldWrapper.classList.add("removing");

    oldWrapper.addEventListener("animationend", () => {
        oldWrapper.remove();
        addSlotImage(targetSlot, character);
    }, { once: true });
}


// Resets each team. Currently deprecated because the button isn't there.
/*
const resetTeam = document.querySelector(".reset-team");

resetTeam.addEventListener("click", () => {
    if (!selectedSlot) return;

    const player = selectedSlot.closest(".player");;

    const normalWrappers =
    player.querySelectorAll(".normal-slots .slot-img-wrapper");

    const specialWrappers =
    player.querySelectorAll(".special-slots .slot-img-wrapper");

    const normalWrappersR = [...normalWrappers].reverse();

    normalWrappersR.forEach((wrapper, index) => {
        setTimeout(() => {
            wrapper.classList.add("removing");

            wrapper.addEventListener("animationend", () => {
                wrapper.remove();
            }, { once: true });

        }, index * 180);
    });

    specialWrappers.forEach((wrapper, index) => {
        setTimeout(() => {
            wrapper.classList.add("removing");

            wrapper.addEventListener("animationend", () => {
                wrapper.remove();
            }, { once: true });

        }, index * 270);
    });

    closeSlotNav();
});
*/


// Resets ALL teams
const resetAllTeam = document.querySelector(".reset-all-team");

resetAllTeam.addEventListener("click", () => {
    slotSelections.clear();
    characterSelections.clear();

    currentTurn = 1;

    stopTimer();
    timer.textContent = 0;

    updateTurn();
    updateSlotAvailability();
    updateSlotNav();

    const labels = document.querySelectorAll(".slot-label");

    labels.forEach(label => {
        label.textContent = "";
        label.classList.remove("visible");
    });
    
    const players = document.querySelectorAll(".player");

    players.forEach(player => {
        const normalWrappers =
        player.querySelectorAll(".normal-slots .slot-img-wrapper");

        const specialWrappers =
        player.querySelectorAll(".special-slots .slot-img-wrapper");

        const normalWrappersR = [...normalWrappers].reverse();

        normalWrappersR.forEach((wrapper, index) => {
            setTimeout(() => {
                wrapper.classList.add("removing");

                wrapper.addEventListener("animationend", () => {
                    wrapper.remove();
                }, { once: true });

            }, index * 180);
        });

        specialWrappers.forEach((wrapper, index) => {
            setTimeout(() => {
                wrapper.classList.add("removing");

                wrapper.addEventListener("animationend", () => {
                    wrapper.remove();
                }, { once: true });

            }, index * 270);
        });
    });
});