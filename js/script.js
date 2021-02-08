window.onload = main;

function main() {
    var freePeoples = new Faction();
    var shadow = new Faction();

    freePeoples.unitInputs = document.querySelector("#battle-app #free-peoples.faction .armySettings .unitInputs");
    freePeoples.statOutput = document.querySelector("#battle-app #free-peoples.faction .statWindow p");

    shadow.unitInputs = document.querySelector("#battle-app #shadow.faction .armySettings .unitInputs");
    shadow.statOutput = document.querySelector("#battle-app #shadow.faction .statWindow p");

    var submitButton = document.querySelector("#battle-app #submit-button");
    submitButton.addEventListener("click", function() {
        freePeoples.display();
        shadow.display();
    })
}

function Faction() {
    this.regulars = 0;
    this.elites = 0;
    this.leaders = 0;

    this.availableDice = 0;

    this.unitInputs = null;
    this.statOutput = null;

    this.update = function() {
        this.regulars = parseInt(this.unitInputs.querySelector(".regulars").value);
        this.elites = parseInt(this.unitInputs.querySelector(".elites").value);
        this.leaders = parseInt(this.unitInputs.querySelector(".leaders").value);

        this.availableDice = Math.min(this.regulars + this.elites, 5);
    }

    this.display = function() {
        this.update();

        var dist = hitDistribution(this.availableDice, this.leaders, 2 / 6);
        var mean = meanHits(dist);

        var output = "";
        dist.forEach((hitChance, hitValue) => {
            var hitPercentage = hitChance * 100;
            output += hitValue + " Hits: " + hitPercentage.toFixed(2) + "%\n";
        })
        output += "\n" + "Average Hits: " + mean.toFixed(2) + "\n";

        this.statOutput.innerHTML = output;
    }
}

// Returns the mean for a discrete probability distribution array
function meanHits(distribution) {
    var weightedTotal = 0;
    distribution.forEach((value, index) => {
        weightedTotal += value * index;
    })
    return weightedTotal;
}

// Creates a probability distribution of all possible hit values for a given number of dice, with rerolls.
function hitDistribution(dice, rerolls, success) {
    var distribution = [];
    for(var i = 0; i <= dice; i++) {
        distribution[i] = hitProbability(i, dice, rerolls, success);
    }
    return distribution;
}

// Finds the probability of rolling a specific number of hits from a given dice pool, with rerolls.
function hitProbability(hits, dice, rerolls, success) {
    // Set success chance for first roll of dice pool
    var baseHitChance = success;

    // Calculate success chance for a die given an allowed reroll on a miss
    var rerollHitChance = baseHitChance + ((1 - baseHitChance) * baseHitChance);

    // Cap available rerolls to total number of available dice
    if(rerolls > dice)
        rerolls = dice;

    // Calculate total average hit chance for all dice
    var totalHitChance = (baseHitChance * (dice - rerolls) + rerollHitChance * rerolls) / dice;

    return binomialProbability(hits, dice, totalHitChance);
}

// Returns a random number between 1 and sides. Simulates rolling an n-sided die.
function rollDie(sides) {
    return Math.ceil(Math.random() * sides);
}