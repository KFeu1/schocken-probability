import { createFraction as f } from 'precise-fractions';

const p = prob1(3,1);

console.log(p.toString());


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

function bin(n: bigint, k: bigint) : bigint {
    return factorialize(n) / (factorialize(k) * factorialize(n-k));
}

function factorialize(num: bigint) {
    if (num === 0n || num === 1n)
      return 1n;

    for (let i = num - 1n; i >= 1; i--) {
      num *= i; // or num *= i;
    }
    return num; //120
  }