let selectedSlot = null;

/*Create slots*/
function createCharacterSlots(container, amount, special) {
    const normalSlots = document.createElement("div");
    normalSlots.classList.add("normal-slots");

    const specialSlots = document.createElement("div");
    specialSlots.classList.add("special-slots");


    for (let i = 0; i < amount; i++) {
        const slot = document.createElement("button");

        slot.classList.add("character-slot");
        slot.classList.add(`slot-${i + 1}`);

        slot.dataset.slot = i + 1;

        const label = document.createElement("span");

        label.classList.add("slot-label");

        slot.appendChild(label);

        slot.addEventListener("click", () => {
            openSlotNav(slot);
        });

        normalSlots.appendChild(slot);
    }

    for (let i = 0; i < special; i++) {
        const specialSlot = document.createElement("button");

        specialSlot.classList.add("character-slot");
        specialSlot.classList.add(`special-slot-${special - i}`);

        specialSlot.dataset.slot = 100 + (special - i);

        const label = document.createElement("span");

        label.classList.add("slot-label");

        specialSlot.appendChild(label);

        specialSlot.addEventListener("click", () => {
            openSlotNav(specialSlot);
        });

        specialSlots.appendChild(specialSlot);
    }

    container.appendChild(normalSlots);
    container.appendChild(specialSlots);
}

const player2 = document.querySelector(".player.player2");
const player1 = document.querySelector(".player.player1");

const exitSlotNavButton = document.querySelector(".exit-slot-nav");

exitSlotNavButton.addEventListener("click", closeSlotNav);


function openSlotNav(slot) {
    const rule = turnRules[currentTurn];

    if (!rule) return;

    const player =
        slot.closest(".player").dataset.player;

    const slotNumber =
        slot.dataset.slot;

    const slotKey =
        `${player}-${slotNumber}`;

    const allowedSlot =
        `${rule.player}-${rule.slot}`;

    // Reject illegal slot
    if (slotKey !== allowedSlot) {
        return;
    }

    const slotNav = document.querySelector(".slot-nav");
    const previousSlot = document.querySelector(".character-slot.selected");

    if (previousSlot && previousSlot !== slot) {
        previousSlot.classList.remove("selected");
    }

    selectedSlot = slot;

    slot.classList.add("selected");
    slotNav.classList.add("open");
}

function closeSlotNav() {
    const slotNav = document.querySelector(".slot-nav");

    slotNav.classList.remove("open");

    if (selectedSlot) {
        selectedSlot.classList.remove("selected");
        selectedSlot = null;
    }
}

document.addEventListener("click", (event) => {
    const slotNav = document.getElementById("slotNav");
    const characterSlot = event.target.closest(".character-slot");

    if (
        !slotNav.contains(event.target) &&
        !characterSlot
    ) {
        closeSlotNav();
        closeFilterSlotNav();
    }
});