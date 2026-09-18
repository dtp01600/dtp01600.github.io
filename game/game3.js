
console.log("game3 sees characterList:", characterList);


const filterButtons = document.querySelectorAll(".filter-button");
const advancedFilterButton =
    document.querySelector(".advanced-filter-button");

advancedFilterButton.addEventListener("click", openFilterSlotNav);


filterButtons.forEach (filterButton => {
    filterButton.addEventListener("click", () => {
        const wasActive = filterButton.classList.contains("active");

        filterButtons.forEach(button => {
            button.classList.remove("active");
        });

        if (!wasActive) {
            filterButton.classList.add("active");
        }
    }); 
});


const activeFilters = {
    attribute: null,
    tier: null,
    role: null,
    weapon: null,
    tag: []
};

function setFilter(type, value) {
    if (activeFilters[type] === value) {
        activeFilters[type] = null;
    } else {
        activeFilters[type] = value;
    }

    updateFilterButtons();
    updateSlotNav();
}

function setTagFilter(tag) {
    if (activeFilters.tag.includes(tag)) {
        activeFilters.tag =
            activeFilters.tag.filter(
                activeTag => activeTag !== tag
            );
    } else {
        activeFilters.tag.push(tag);
    }

    updateFilterButtons();
    updateSlotNav();
}


function updateFilterButtons() {
    filterButtons.forEach(button => {

        const type = button.dataset.filterType;
        const value = button.dataset.filterValue;

        let selected = false;

        if (type === "tag") {
            selected = activeFilters.tag.includes(value);
        } else {
            selected = activeFilters[type] === value;
        }

        button.classList.toggle("active", selected);
    });
}


filterButtons.forEach(button => {
    button.addEventListener("click", () => {

        const type = button.dataset.filterType;
        const value = button.dataset.filterValue;

        if (type === "tag") {
            setTagFilter(value);
        } else {
            setFilter(type, value);
        }
    });
});


function updateSlotNav() {
    console.log("updateSlotNav characterList:", characterList);
    console.log("length:", characterList.length);

    const choices =
    document.querySelectorAll(".character-choice");

    choices.forEach(choice => {

        const character = characterList.find(
            character =>
                String(character.id) === choice.dataset.id
        );

        if (!character) return;

        const characterAvailable =
            !characterSelections.has(character.id);

        const attributeMatch =
            activeFilters.attribute === null ||
            character.attribute === activeFilters.attribute;

        const tierMatch =
            activeFilters.tier === null ||
            String(character.tier) === activeFilters.tier;

        const roleMatch =
            activeFilters.role === null ||
            character.style.role.includes(activeFilters.role);

        const weaponMatch =
            activeFilters.weapon === null ||
            character.weapon === activeFilters.weapon;

        const tagMatch =
            activeFilters.tag.length === 0 ||
            activeFilters.tag.every(
                tag => character.style.tag.includes(tag)
            );


        choice.style.display =
            attributeMatch &&
            tierMatch &&
            roleMatch &&
            weaponMatch &&
            tagMatch &&
            characterAvailable
                ? ""
                : "none";
    });
}



function openFilterSlotNav() {
    const filterSlotNav = document.querySelector(".filter-slot-nav");

    filterSlotNav.classList.add("open");
}

const exitFilterSlotNavButton = document.querySelector(".exit-filter-slot-nav");

exitFilterSlotNavButton.addEventListener("click", closeFilterSlotNav);

function closeFilterSlotNav() {
    const filterSlotNav = document.querySelector(".filter-slot-nav");

    filterSlotNav.classList.remove("open");
}


/* Search UI later...
    <button class="search-button" id="searchButton">Search  
    </button>

    <div class="search-ui" id="searchUI">
        <input
            type="text"
            id="searchBar"
            placeholder="Search a resonator..."
        >
    </div>

.search-ui{
    position: absolute;

    height: 36px;
    left: 24px;
    right: 40px;

    display: flex;
    align-items: center;
    gap: 8px;

    border: 2px solid rgba(100, 130, 155, 0.45);
    border-radius: 7.2px;

    background-color: rgba(2, 7, 12, 0.7);
}
*/

const slotSelections = new Map();
const characterSelections = new Map();

function selectCharacter(character) {

    if (!selectedSlot) return;

    const rule = turnRules[currentTurn];

    if (!rule) return;

    const player =
        selectedSlot.closest(".player").dataset.player;

    const slot =
        selectedSlot.dataset.slot;

    const slotKey =
        `${player}-${slot}`;

    if (character.map !== rule.map) {
        return;
    }

    const characterId = character.id;

    // Is this character already being used?
    const existingSlot =
        characterSelections.get(characterId);

    if (existingSlot && existingSlot !== slotKey) {
        return;
    }

    // What character was previously in this slot?
    const oldCharacter =
        slotSelections.get(slotKey);

    if (oldCharacter === undefined) {
        currentTurn++;
        updateTurn();
        updateSlotAvailability();
        updateSlotNav();
    }

    if (oldCharacter !== undefined) {
        characterSelections.delete(oldCharacter);
    }

    // Assign the new character
    slotSelections.set(slotKey, characterId);
    characterSelections.set(characterId, slotKey);

    console.log("slotSelections:", [...slotSelections]);
    console.log("characterSelections:", [...characterSelections]);

    // Your existing visual selection code
    selectedCharacter(character);

    updateSlotNav();
}