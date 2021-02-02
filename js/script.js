window.onload = main;

function main() {
    var diceMaxNum = 5;

    var freePeoplesUnits = document.querySelector("#battle-app #free-peoples.faction .armySettings .unitInputs");
    var shadowUnits = document.querySelector("#battle-app #shadow.faction .armySettings .unitInputs");

    var submitButton = document.querySelector("#battle-app #submit-button");
    submitButton.addEventListener("click", function() {
        var freePeopleRegulars = freePeoplesUnits.querySelector(".regulars").value;
        var freePoepleElites = freePeoplesUnits.querySelector(".elites").value;
        var freePeopleLeaders = freePeoplesUnits.querySelector(".leaders").value;
    
        var shadowRegulars = shadowUnits.querySelector(".regulars").value;
        var shadowElites = shadowUnits.querySelector(".elites").value;
        var shadowLeaders = shadowUnits.querySelector(".leaders").value;

        var freePeopleDice = Math.min(freePeopleRegulars + freePoepleElites, diceMaxNum);
        var shadowDice = Math.min(shadowRegulars + shadowElites, diceMaxNum);

        var freePeopleStats = "";
        var shadowStats = "";

        for(var i = 0; i <= diceMaxNum; i++) {
            var freePeoplesProbability = hitProbability(i, freePeopleDice, freePeopleLeaders);
            var shadowProbability = hitProbability(i, shadowDice, shadowLeaders);

            freePeopleStats += i + " hits: " + freePeoplesProbability + "\n";
            shadowStats += i + " hits: " + shadowProbability + "\n";
        }

        var freePeopleStatWindow = document.querySelector("#battle-app #free-peoples.faction .statWindow p");
        var shadowStatWindow = document.querySelector("#battle-app #shadow.faction .statWindow p");

        freePeopleStatWindow.innerHTML = freePeopleStats;
        shadowStatWindow.innerHTML = shadowStats;
    })
}

function hitProbability(hits, dice, rerolls) {
    var totalProbability = 0;

    for(var i = 0; i <= hits; i++) {
        var baseHit = binomialProbability(i, dice, 2 / 6);
        var rerollHit = binomialProbability(hits - i, rerolls - i, 2 / 6);

        totalProbability += baseHit * rerollHit;
    }
    return totalProbability;
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