window.onload = main;

function main() {
    var dieRollerDisplay = document.querySelector(".dieRollerDisplay");
    var dieRollerButton = document.querySelector(".dieRoller input");
    dieRollerButton.addEventListener("click", () => {
        dieRollerDisplay.innerHTML = attack(5);
    })
}

function attack(hitThreshold) {
    var rolls = [];
    var hits = 0;

    // Roll five six sided dice
    for(var i = 0; i < 5; i++) {
        var result = rollDie(6);
        rolls.push(result);
    }

    // Determine hits in die results
    rolls.forEach((value) => {
        if(value >= hitThreshold) {
            hits++;
        }
    }) 
    
    return hits;
}

function rollDie(sides) {
    return Math.ceil(Math.random() * sides);
}