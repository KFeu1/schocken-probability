import { Fraction, add, createFraction as f, multiply, power, subtract } from "precise-fractions";
import { bin, getPartitions } from "./helper";


/**
 * Probability to have exactly k 1s after throwing n dice at once (includes the rule two combine two 6s into one 1).
 * 
 * This function works because it presupposes that you will have more throws after this one.
 * But note that if you throw all dice to be a 1, then you are done.
 * 
 * @param n 
 * @param k 
 * @returns 
 */
export function probabilityToHaveK1sWhenThrowingNDice(n: bigint | number | string, k: bigint | number | string): Fraction {
    if (typeof n !== "bigint") {
        n = BigInt(n);
    }
    if (typeof k !== "bigint") {
        k = BigInt(k);
    }

    if (n === k) {
        return f(1n,6n ** n);
    }
    if (n === k + 1n) {
        return f(2n ** n + 4n * n - 1n, 6n ** n);
    }
    if (k === 0n) {
        return f(4n ** (n - 1n) * (4n + n), 6n ** n);
    }
    return f((4n ** (n - k - 1n) * (n - k) + 4n ** (n-k)) * bin(n,k) +
        4n ** (n - k - 1n) * ((k - n) * bin(n,k) + (2n ** (k + 1n) - 1n) * bin(n,k + 1n)), 6n ** n);
};

function probabilityToHaveASchockoutAfterAtMostKRoundsWithNDice(dice: number, k: number): Fraction {
    const result = f(0);
    for (let i = 1; i <= k; i++) {
        result.add(probabilityForSchockInExactlyKRoundsWithNDice(dice,i));
    }
    return result;
}


/**
 * Assuming the first player has played and needed k rounds
 * 
 * @param players 
 * @param playersWithoutSchockOut 
 */
function probabilityThatACertainExactNumberOfSchockoutsExistUnderTheRemainingPlayers(dice: number, players: bigint, playersWithoutSchockOut: bigint, k: number): Fraction {
    const p = probabilityToHaveASchockoutAfterAtMostKRoundsWithNDice(dice,k);

    if (playersWithoutSchockOut === 0n) {
        return power(p, players);
    }

    const chanceOfNoSchockOut = subtract(1,p);

    if (players === playersWithoutSchockOut) {
        return power(chanceOfNoSchockOut, players);
    }

    return add(
        multiply(chanceOfNoSchockOut, probabilityThatACertainExactNumberOfSchockoutsExistUnderTheRemainingPlayers(dice, players - 1n, playersWithoutSchockOut - 1n, k)),
        multiply(p, probabilityThatACertainExactNumberOfSchockoutsExistUnderTheRemainingPlayers(dice, players - 1n, playersWithoutSchockOut, k)),
    );
}


function probabilityForSchockInExactlyKRoundsWithNDice(n: number,k: number) {
    const result = f(0);

    for (const p of getPartitions(n,k)) {
        // This code block - when omitted - will still make the validation pass for some reason, but it is required here for correctness
        if (p.length !== k) { 
            continue;
        }

        let nCurrent = n;
        const probTotal = f(1);

        for (let i = 0; i < p.length; i++) {
            const dice = p[i];
            const prob = probabilityToHaveK1sWhenThrowingNDice(nCurrent, dice);
            probTotal.multiply(prob);
            nCurrent -= dice;
            if (nCurrent === 0) {
                break;
            }
        }
        result.add(probTotal);
    }

    return result;
}

export function probabiltyOfKPlayersHavingASchockoutInAtMostXRoundsWithNPlayersAndMDice(rounds: number, dice: number, players: bigint, playersWithoutSchockOut: bigint): Fraction {
    const p = probabilityToHaveASchockoutAfterAtMostKRoundsWithNDice(dice,rounds);
    const chanceOfNoSchockOut = subtract(1,p);

    if (players === playersWithoutSchockOut) {
        return power(chanceOfNoSchockOut, players);
    }

    const out = f(0);
    const playersM1 = players - 1n;

    for (let i = 1; i <= rounds; i++) {
        const p = probabilityForSchockInExactlyKRoundsWithNDice(dice,i);
        out.add(multiply(p, probabilityThatACertainExactNumberOfSchockoutsExistUnderTheRemainingPlayers(dice, playersM1, playersWithoutSchockOut, i)));
    }

    if (playersWithoutSchockOut >= 1n) {
        out.add(multiply(chanceOfNoSchockOut, probabilityThatACertainExactNumberOfSchockoutsExistUnderTheRemainingPlayers(dice, playersM1, playersWithoutSchockOut - 1n, rounds)));
    }

    return out;
}