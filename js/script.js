window.onload = main;

function main() {
    var freePeoples = new Faction();
    var shadow = new Faction();

    freePeoples.unitInputs = document.querySelector("#battle-app #free-peoples.faction .armySettings .unitInputs");
    freePeoples.hitInputs = document.querySelector("#battle-app #free-peoples.faction .hitSettings");
    freePeoples.statOutput = document.querySelector("#battle-app #free-peoples.faction .statWindow");

    shadow.unitInputs = document.querySelector("#battle-app #shadow.faction .armySettings .unitInputs");
    shadow.hitInputs = document.querySelector("#battle-app #shadow.faction .hitSettings");
    shadow.statOutput = document.querySelector("#battle-app #shadow.faction .statWindow");

    var inputs = document.querySelectorAll("#battle-app .faction input");
    inputs.forEach((input) => {
        input.addEventListener("change", function() {
            freePeoples.display();
            shadow.display();
        })
    })

    freePeoples.display();
    shadow.display();
}

function Faction() {
    this.regulars = 0;
    this.elites = 0;
    this.leaders = 0;

    this.availableDice = 0;

    this.baseHitChance = 0;
    this.rerollHitChance = 0;

    this.unitInputs = null;
    this.hitInputs = null;
    this.statOutput = null;

    this.update = function() {
        this.regulars = parseInt(this.unitInputs.querySelector(".regulars").value);
        this.elites = parseInt(this.unitInputs.querySelector(".elites").value);
        this.leaders = parseInt(this.unitInputs.querySelector(".leaders").value);

        this.availableDice = Math.min(this.regulars + this.elites, 5);

        this.baseHitChance = (6 - parseInt(this.hitInputs.querySelector(".baseroll").value) + 1) / 6;
        this.rerollHitChance = (6 - parseInt(this.hitInputs.querySelector(".reroll").value) + 1) / 6;
    }

    this.display = function() {
        this.update();

        var dist = hitDistribution(this.availableDice, this.leaders, this.baseHitChance, this.rerollHitChance);
        var mean = meanHits(dist);

        var histDistOutput = "";
        dist.forEach((hitChance, hitValue) => {
            var hitPercentage = hitChance * 100;
            histDistOutput += hitValue + " Hits: " + hitPercentage.toFixed(2) + "%\n";
        })

        this.statOutput.querySelector(".hitDist").innerHTML = histDistOutput;
        this.statOutput.querySelector(".hitAvg").innerHTML = "Average Hits: " + mean.toFixed(2);
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
function hitDistribution(dice, rerolls, baseSuccess, rerollSuccess) {
    var distribution = [];
    for(var i = 0; i <= dice; i++) {
        distribution[i] = hitProbability(i, dice, rerolls, baseSuccess, rerollSuccess);
    }
    return distribution;
}

// Finds the probability of rolling a specific number of hits from a given dice pool, with rerolls.
function hitProbability(hits, dice, rerolls, baseSuccess, rerollSuccess) {
    // If there are no rerolls available, take base probability
    if(rerolls == 0) {
        return binomialProbability(hits, dice, baseSuccess);
    } else {
        var total = 0;

        // Iterate for each possible hit value in the base roll
        for(var i = 0; i <= hits; i++) {
            // Chance of rolling i hits on base roll (0, 1, 2, ..., desired hits)
            var baseRoll = binomialProbability(i, dice, baseSuccess);

            // Find dice remaining from rolling i hits
            var diceRemaining = dice - i;

            // Determine how many dice can be allocated to the reroll
            var rerollDice = Math.min(diceRemaining, rerolls);

            // Chance of rolling remaining hits with allocated reroll dice
            var reroll = binomialProbability(hits - i, rerollDice, rerollSuccess);

            // Add current hit combination probability to total
            total += baseRoll * reroll;
        }

        return total;
    }
}