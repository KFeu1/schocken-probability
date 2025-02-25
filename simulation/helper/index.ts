
/**
 * Throw n dice and return the results in order from lowest to highest.
 * 
 * @param n 
 * @returns 
 */
export function throwDice(n: number): Array<number> {
    const arr = Array.from({ length: n }, getRandomDiceNumber);
    arr.sort();
    return arr;
}

function getRandomDiceNumber(): number {
    return Math.floor(Math.random() * 6) + 1;
}

export function countOnes(arr: Array<number>): number {
    return count(arr, 1);
}

export function countSixes(arr: Array<number>): number {
    return count(arr, 6);
}

function count(arr: Array<number>, n: number): number {
    let count = 0;
    for (let i = 0; i < arr.length; i++) {
        if (arr[i] === n) {
            count++;
        }
    }
    return count;
}
