// Sample runner: prints the exact schockout probabilities for a fixed setup.
// Kept for reference; the package entry point (index.ts) exports only the probability function.

import { Decimal } from 'decimal.js';
import { createFraction as f, add, subtract, multiply, Fraction, power } from 'precise-fractions';
import { probabilityToHaveK1sWhenThrowingNDice, probabiltyOfKPlayersHavingASchockoutInAtMostXRoundsWithNPlayersAndMDice } from './src/methods.ts';
import ProgressBar from "progress";

/** Number of dice */
const N: number = 3;
/** Number of rounds */
const K: number = 3;

const playerCount: number = 6;

(() => {
    /** If true, validates the probability function to equal 1 in their sum */
    const validate = true;

    if (validate) {
        const sum = () => {
            const sum = f(0);
            for (let i = 0; i <= playerCount; i++) {
                sum.add(probabiltyOfKPlayersHavingASchockoutInAtMostXRoundsWithNPlayersAndMDice(N, K, playerCount, i));
            }
            return sum;
        }
        if (!sum().equals(1)) {
            throw new Error("Base probability (1) is not 1");
        }
        const sum2 = () => {
            const sum = f(0);
            for (let i = 0n; i <= N; i++) {
                sum.add(probabilityToHaveK1sWhenThrowingNDice(N, i));
            }
            return sum;
        }

        if (!sum2().equals(1)) {
            throw new Error("Base probability (2) is not 1");
        }
    }

    const bar = new ProgressBar(':bar :percent', { total: playerCount + 1 });

    const chances = Array.from({ length: playerCount + 1 }, (_, i) => i).map(i => {
        const result = probabiltyOfKPlayersHavingASchockoutInAtMostXRoundsWithNPlayersAndMDice(N, K, playerCount, playerCount - i);
        bar.tick();
        return result;
    });

    const calcDecimal = (fraction: Fraction): Decimal => {
        const numerator = Decimal(fraction.numerator.toString());
        const denominator = Decimal(fraction.denominator.toString());
        return numerator.div(denominator);
    }

    for (let i = 0; i <= playerCount; i++) {
        const p = chances[i];
        console.log(`Chance of ${i} player${i === 1 ? "" : "s"} having a schockout in (at most) ${K} round${K > 1 ? "s" : ""} when a total of ${playerCount} are playing with ${N} dice: ${calcDecimal(p)}`);
    }
})();
