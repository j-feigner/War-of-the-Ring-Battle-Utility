window.onload = main;

function main() {
    var diceMaxNum = 5;

    var freePeoples = new Faction();
    var shadow = new Faction();

    freePeoples.unitInputs = document.querySelector("#battle-app #free-peoples.faction .armySettings .unitInputs");
    shadow.unitInputs = document.querySelector("#battle-app #shadow.faction .armySettings .unitInputs");

    var submitButton = document.querySelector("#battle-app #submit-button");
    submitButton.addEventListener("click", function() {
        freePeoples.update();
        shadow.update();

        var freePeopleStats = "";
        var shadowStats = "";

        var freePeopleDist = hitDistribution(freePeoples.availableDice, freePeoples.leaders, 2 / 6);
        var freePeopleMean = meanHits(freePeopleDist);
        freePeopleDist.forEach((hitChance, hitValue) => {
            var hitPercentage = hitChance * 100;
            freePeopleStats += hitValue + " Hits: " + hitPercentage.toFixed(2) + "%\n";
        })
        freePeopleStats += "\n" + "Average Hits: " + freePeopleMean.toFixed(2) + "\n";

        var shadowDist = hitDistribution(shadow.availableDice, shadow.leaders, 2 / 6);
        var shadowMean = meanHits(shadowDist);
        shadowDist.forEach((hitChance, hitValue) => {
            var hitPercentage = hitChance * 100;
            shadowStats += hitValue + " Hits: " + hitPercentage.toFixed(2) + "%\n";
        })
        shadowStats += "\n" + "Average Hits: " + shadowMean.toFixed(2) + "\n";

        var freePeopleStatWindow = document.querySelector("#battle-app #free-peoples.faction .statWindow p");
        var shadowStatWindow = document.querySelector("#battle-app #shadow.faction .statWindow p");

        freePeopleStatWindow.innerHTML = freePeopleStats;
        shadowStatWindow.innerHTML = shadowStats;
    })
}

function Faction() {
    this.regulars = 0;
    this.elites = 0;
    this.leaders = 0;

    this.unitInputs = null;

    this.availableDice = 0;

    this.update = function() {
        this.regulars = parseInt(this.unitInputs.querySelector(".regulars").value);
        this.elites = parseInt(this.unitInputs.querySelector(".elites").value);
        this.leaders = parseInt(this.unitInputs.querySelector(".leaders").value);

        this.availableDice = Math.min(this.regulars + this.elites, 5);
    }
}

function meanHits(distribution) {
    var weightedTotal = 0;
    distribution.forEach((value, index) => {
        weightedTotal += value * index;
    })
    return weightedTotal;
}

function hitDistribution(dice, rerolls, success) {
    var distribution = [];
    for(var i = 0; i <= dice; i++) {
        distribution[i] = hitProbability(i, dice, rerolls, success);
    }
    return distribution;
}

function hitProbability(hits, dice, rerolls, success) {
    var baseHitChance = success;
    var rerollHitChance = baseHitChance + ((1 - baseHitChance) * baseHitChance);

    if(rerolls > dice) {
        rerolls = dice;
    }

    var totalHitChance = (baseHitChance * (dice - rerolls) + rerollHitChance * rerolls) / dice;

    return binomialProbability(hits, dice, totalHitChance);
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