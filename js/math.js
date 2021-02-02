// Returns the product of all positive integers less than or equal to an integer n
function factorial(n) {
    return n <= 0 ? 1 : n * factorial(n - 1);
}

// Returns number of combinations of r items that can be made from a collection of n items.
// Note: order does not matter when calculating combinations
function combination(n, r) {
    return factorial(n) / factorial(r) / factorial(n - r);
}

// Returns probability of getting exactly x successes on n trials given the probability of x
// being successful (px)
function binomialProbability(x, n, px) {
    return combination(n, x) * Math.pow(px, x) * Math.pow(1 - px, n - x);
}