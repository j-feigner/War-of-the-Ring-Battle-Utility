window.onload = main;

function main() {
    var test = hitProbability(0, 5, 5);
    var stopper = 0;
}

function hitProbability(hits, dice, rerolls) {
    var totalProbability = 0;

    for(var i = 0; i <= hits; i++) {
        var baseHit = binomialProbability(i, dice, 2 / 6);
        var rerollHit = binomialProbability(hits - i, rerolls, 2 / 6);

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