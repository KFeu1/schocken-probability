

/**
 * Returns the cut partitions of n into p parts.
 * 
 * E.g. getPartitions(3,2) gives [[0, 3], [1, 2], [2, 1], [3]] 
 * The length of the partition is how many rounds it took to get a schockout.
 * 
 * @param n 
 * @param p 
 * @returns 
 */
export function* getPartitions(n: number, p:number) : IterableIterator<Array<number>> {
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

export function memoize<T extends (...args: any[]) => any> (fn: T): (...args: Parameters<T>) => ReturnType<T> {
    const cache = new Map<string,ReturnType<T>>();

    return (...args: Parameters<T>) => {
        const key = args.join(',');
        const value = cache.get(key);
        if (value !== undefined) return value;
        const result: ReturnType<T> = fn(...args);
        cache.set(key, result);
        return result;
    };
}

export function bin(n: bigint, k: bigint): bigint {
    if (n < 0n || k < 0n || k > n) return 0n;

    if (k > n - k) k = n - k;

    let result = 1n;

    for (let i = 1n; i <= k; i++) {
        result = (result * (n - i + 1n)) / i;
    }

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