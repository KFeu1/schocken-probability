import { createFraction as f, add, subtract, multiply, Fraction, power } from 'precise-fractions';

const cache = new Map<string,Fraction>();
const N = 3;
const K = 3;

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

function probabilityForSchockInKRoundsWithNDice(n: number,k: number) {
    const key = `${n}-${k}`;

    const cachedValue = cache.get(key);

    if (cachedValue !== undefined) return cachedValue;

    const result = f(0);

    for (const p of getPartitions(N,k)) {
        let n = N;
        const probTotal = f(1);

        for (let i = 0; i < p.length; i++) {
            const dice = p[i];
            const prob = prob1(n, dice);
            probTotal.multiply(prob);
            n -= dice;
            if (n === 0) {
                break;
            }
        }
        result.add(probTotal);
    }

    cache.set(key, result);

    return result;
}

(() => {
    // const result = probabilityForSchockInKRoundsWithNDice(N,K);
    // console.log(result);
    // console.log(+result);
    const playerCount = 6n;
    const p = probX(playerCount, 1n); // The probability that five of six players have a schockout at the end, and one does not
    console.log(p.toString());
    console.log(+p);
    const sum = () => {
        const sum = f(0);
        for (let i = 0n; i <= playerCount; i++) {
            sum.add(probX(playerCount, i));
        }
        return sum;
    }
    console.log(+sum());
})();

function probX(players: bigint, playersWithoutSchockOut: bigint) {
    const sum = () => {
        const sum = f(0);
        for (let i = 1; i <= K; i++) {
            sum.add(probabilityForSchockInKRoundsWithNDice(N,i));
        }
        return sum;
    };

    if (players === playersWithoutSchockOut) {
        const chanceForNoSchockOut = subtract(1, sum());
        return power(chanceForNoSchockOut, players);
    }

    const out = f(0);
    const playersM1 = players - 1n;
    const factor = bin(playersM1, playersWithoutSchockOut);

    for (let i = 1; i <= K; i++) {
        const p = probabilityForSchockInKRoundsWithNDice(N,i);
        out.add(multiply(p, factor, subtract(1,p), power(p, playersM1 - playersWithoutSchockOut)));
    }

    const p = probabilityForSchockInKRoundsWithNDice(N,K);
    out.add(multiply(subtract(1,p), power(p, playersM1)));

    return out;
}

function prob1(n: bigint | number | string, k: bigint | number | string) {
    if (typeof n !== "bigint") {
        n = BigInt(n);
    }
    if (typeof k !== "bigint") {
        k = BigInt(k);
    }

    if (n === k) {
        return f(1,6n ** n);
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

function bin(n: bigint, k: bigint) {
    const [min, max] = minMax(k,n-k);
    return factorialize(n, max) / factorialize(min);
}

function minMax(n: bigint, k: bigint) {
    if (n > k) return [k,n];
    return [n,k];
}

function factorialize(num: bigint, stop?: bigint) {
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
