
const menuButton = document.getElementById("menuButton");
const mainMenu = document.getElementById("mainMenu");
const exitMenu = document.getElementById("exitMenu");
const returnButton = document.querySelector(".return-button")


function openMenu() {
    mainMenu.classList.toggle("open");
}

function closeMenu() {
    mainMenu.classList.remove("open");
}

function goBack() {
    window.location.href = "/"
}