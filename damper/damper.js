function summonFapsu() {

    outputFapsu = document.querySelector(".outputFapsu")
    imageTrieuhoi = document.querySelector(".imageTrieuhoi")


    // Shows output for hitting the Damper button.
    outputFapsu.textContent = "Damper đã triệu hồi Mornye RC 1!";
    outputFapsu.style.display = "block";
    imageTrieuhoi.style.display = "block";
    setTimeout(() => {
        outputFapsu.style.display = "none";
        imageTrieuhoi.style.display = "none";
    }, 1000);


}