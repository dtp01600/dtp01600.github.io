createCharacterSlots(player2, 6, 3);
createCharacterSlots(player1, 6, 3);

let currentTurn = 1;

const turnContainer = document.querySelector(".turn-container");
const turnNumber = document.querySelector(".turn-number");

const doneContainer = document.querySelector(".turn-finished");

function updateTurn() {
    if (!turnNumber) return;

    if (currentTurn >= 2 && currentTurn <= 18) {
        startTurnTimer();
    } else {
        clearInterval(timerInterval);
        timerInterval = null;

        timer.textContent = 0;
    }

        

    if (currentTurn > 18) {
        doneContainer.style.display = "flex";
        turnContainer.style.display = "none";
    } else {
        doneContainer.style.display = "none";
        turnContainer.style.display = "flex";
    }
}

const turnRules = {
    1: { player: "P1", slot: "101"},
    2: { player: "P2", slot: "101"},
    3: { player: "P1", slot: "102"},
    4: { player: "P2", slot: "102"},
    5: { player: "P1", slot: "1"},
    6: { player: "P2", slot: "1"},
    7: { player: "P2", slot: "2"},
    8: { player: "P1", slot: "2"},
    9: { player: "P1", slot: "3"},
    10: { player: "P2", slot: "3"},
    11: { player: "P2", slot: "103"},
    12: { player: "P1", slot: "103"},
    13: { player: "P2", slot: "4"},
    14: { player: "P1", slot: "4"},
    15: { player: "P1", slot: "5"},
    16: { player: "P2", slot: "5"},
    17: { player: "P2", slot: "6"},
    18: { player: "P1", slot: "6"},
    19: { player: "P0", slot: "0"}
};

const rule = turnRules[currentTurn];


function updateSlotAvailability() {

    const rule = turnRules[currentTurn];

    if (!rule) return;

    const allowedSlot =
        `${rule.player}-${rule.slot}`;

    const slots =
        document.querySelectorAll(".character-slot");

    slots.forEach(slot => {

        const player =
            slot.closest(".player").dataset.player;

        const slotNumber =
            slot.dataset.slot;

        const slotKey =
            `${player}-${slotNumber}`;

        slot.disabled =
            slotKey !== allowedSlot;
    });
}

let timerSeconds = 60;
let timerInterval = null;

function resetTimer() {
    clearInterval(timerInterval);
    timerInterval = null;
    turnContainer.classList.remove("timer-warning");

    timerSeconds = 60;
    timer.textContent = timerSeconds;
}

function startTimer() {
    if (timerInterval) return;

    timerInterval = setInterval(() => {
        timerSeconds--;

        timer.textContent = timerSeconds;

        saveGame();

        if (timerSeconds <= 10 && timerSeconds > 0) {
            turnContainer.classList.add("timer-warning");
        } else {
            turnContainer.classList.remove("timer-warning");
        }
``
        if (timerSeconds <= 0) {
            currentTurn++;
            updateTurn();
            updateSlotAvailability();
            updateSlotNav();
            startTurnTimer();
        }
    }, 1000);
}

function startTurnTimer() {
    resetTimer();
    startTimer();
}

function stopTimer() {
    clearInterval(timerInterval);
    timerInterval = null;
    turnContainer.classList.remove("timer-warning");
}

loadGame();

updateTurn();
updateSlotAvailability();
updateSlotNav();
restoreSelectedSlots();