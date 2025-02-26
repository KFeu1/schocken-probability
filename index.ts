import Decimal from 'decimal.js';
import { createFraction as f, add, subtract, multiply, Fraction, power } from 'precise-fractions';
const ProgressBar = require('progress');

const cache = new Map<string,Fraction>();
const cache2 = new Map<string,bigint>();
/** Number of dice */
const N: number = 3;
/** Number of rounds */
const K: number = 3;

const playerCount: bigint = 6n;

// const start = performance.now();
// const p = prob1(33333,16666);
// const end = performance.now();

// console.log(p.toString());
// console.log(`Time in ms: ${end - start}.`);

// const check = f(0);

// for (let i = 0; i <= N; i++) {
//     check.add(prob1(N,i))
// }

// console.log(check);

function probabilityForSchockInExactlyKRoundsWithNDice(n: number,k: number) {
    const key = `${n}-${k}`;

    const cachedValue = cache.get(key);

    if (cachedValue !== undefined) return cachedValue;

    const result = f(0);

    for (const p of getPartitions(n,k)) {
        if (p.length !== k) {
            continue;
        }

        let nCurrent = n;
        const probTotal = f(1);

        for (let i = 0; i < p.length; i++) {
            const dice = p[i];
            const prob = prob1(nCurrent, dice);
            probTotal.multiply(prob);
            nCurrent -= dice;
            if (nCurrent === 0) {
                break;
            }
        }
        result.add(probTotal);
    }

    cache.set(key, result);

    return result;
}

(() => {
    // const result = probabilityForSchockInExactlyKRoundsWithNDice(N,K);
    // console.log(result);
    // console.log(+result);
    // const p = probX(playerCount, 1n); // The probability that five of six players have a schockout at the end, and one does not
    // console.log(p.toString());
    // console.log(+p);
    // console.log(prob1(2,1).toString());
    // console.log(probabilityForSchockInExactlyKRoundsWithNDice(1,1).toString());

    /** If true, validates the probability function to equal 1 in their sum */
    const validate = false;

    if (validate) {
        const sum = () => {
            const sum = f(0);
            for (let i = 0n; i <= playerCount; i++) {
                sum.add(probX(playerCount, i));
            }
            return sum;
        }
        if (`${sum()}` !== `${f(1)}`) {
            throw new Error("Base probability (1) is not 1");
        }
        const sum2 = () => {
            const sum = f(0);
            for (let i = 0n; i <= N; i++) {
                sum.add(prob1(N, i));
            }
            return sum;
        }
        if (`${sum2()}` !== `${f(1)}`) {
            throw new Error("Base probability (2) is not 1");
        }
    }

    const bar = new ProgressBar(':bar :percent', { total: Number(playerCount) + 1 });

    const chances = Array.from({ length: Number(playerCount) + 1 }, (_, i) => BigInt(i)).map(i => {
        const result = probX(playerCount, playerCount - i);
        bar.tick();
        return result;
    });

    for (let i = 0n; i <= playerCount; i++) {
        const p = chances[Number(i)];
        console.log(`Chance of ${i} player${i === 1n ? "" : "s"} having a schockout in ${K} round${K > 1 ? "s" : 0} when a total of ${playerCount} are playing with ${N} dice: ${calcDecimal(p)}`);
    }
})();

function calcDecimal(fraction: Fraction): Decimal {
    const numerator = Decimal(fraction.numerator.toString());
    const denominator = Decimal(fraction.denominator.toString());
    return numerator.div(denominator);
}

function probX(players: bigint, playersWithoutSchockOut: bigint): Fraction {
    const sumUp = () => {
        let sum = f(0);
        for (let i = 1; i <= K; i++) {
            sum.add(probabilityForSchockInExactlyKRoundsWithNDice(N,i));
        }
        return sum;
    }
    const p = sumUp();
    const chanceOfNoSchockOut = subtract(1,p);

    if (players === playersWithoutSchockOut) {
        return power(chanceOfNoSchockOut, players);
    }

    const out = f(0);
    const playersM1 = players - 1n;

    for (let i = 1; i <= K; i++) {
        const p = probabilityForSchockInExactlyKRoundsWithNDice(N,i);
        out.add(multiply(p, probY(playersM1, playersWithoutSchockOut, i)));
    }

    if (playersWithoutSchockOut >= 1n) {
        out.add(multiply(chanceOfNoSchockOut, probY(playersM1, playersWithoutSchockOut - 1n, K)));
    }

    return out;
}

/**
 * Assuming the first player has played and needed k rounds
 * 
 * @param players 
 * @param playersWithoutSchockOut 
 */
function probY(players: bigint, playersWithoutSchockOut: bigint, k: number): Fraction {
    const sumUp = () => {
        let sum = f(0);
        for (let i = 1; i <= k; i++) {
            sum.add(probabilityForSchockInExactlyKRoundsWithNDice(N,i));
        }
        return sum;
    }
    const p = sumUp();

    if (playersWithoutSchockOut === 0n) {
        return power(p, players);
    }

    const chanceOfNoSchockOut = subtract(1,p);

    if (players === playersWithoutSchockOut) {
        return power(chanceOfNoSchockOut, players);
    }

    return add(
        multiply(chanceOfNoSchockOut, probY(players - 1n, playersWithoutSchockOut - 1n, k)),
        multiply(p, probY(players - 1n, playersWithoutSchockOut, k)),
    );
}

/**
 * Probability to have exactly k 1s after throwing n dice (includes the rule two combine two 6s into one 1).
 * 
 * @param n 
 * @param k 
 * @returns 
 */
function prob1(n: bigint | number | string, k: bigint | number | string): Fraction {
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

function bin(n: bigint, k: bigint): bigint {
    const key = `${n}-${k}`;
    const cachedValue = cache2.get(key);
    if (cachedValue !== undefined) return cachedValue;
    const [min, max] = minMax(k,n-k);
    const result = factorialize(n, max) / factorialize(min);
    cache2.set(key, result);
    return result;
}

function minMax(n: bigint, k: bigint): [bigint, bigint] {
    if (n > k) return [k,n];
    return [n,k];
}

function factorialize(num: bigint, stop?: bigint): bigint {
    if (num <= 1n)
      return 1n;

    stop = stop === undefined ? 1n : stop + 1n;

    for (let i = num - 1n; i >= stop; i--) {
        num *= i;
    }

    return num;
}

function* getPartitions(n: number, p:number) : IterableIterator<Array<number>> {
    if (n === 0) {
        yield []
        return;
    }
    if (p === 1) {
        yield [n];
        return;
    }

    for (let i = 0; i <= n; i++) {
        for (const part of getPartitions(n - i, p - 1)) {
            yield [i, ...part];
        }
    }
}
