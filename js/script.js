window.onload = main;

function main() {
    var dieRollerDisplay = document.querySelector(".dieRollerDisplay");
    var dieRollerButton = document.querySelector(".dieRoller input");
    dieRollerButton.addEventListener("click", () => {
        dieRollerDisplay.innerHTML = rollDie(6);
    })
}

function rollDie(sides) {
    return Math.ceil(Math.random() * sides);
}