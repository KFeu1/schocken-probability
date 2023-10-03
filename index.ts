import { createFraction as f } from 'precise-fractions';

const start = performance.now();
const p = prob1(3,1);
const end = performance.now();

console.log(p.toString());
console.log(`Time in ms: ${end - start}.`);

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
    if (n === k - 1n) {
        return f(2n ** n + 4n * n + 1n, 6n ** n);
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