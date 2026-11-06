# schocken

Exact probabilities for the German dice game **Schocken** (Knuckle): how likely is it that a given number of players gets a *Schock Out* (all dice showing a 1) within a given number of rounds?

The calculation is exact — results are returned as mathematical fractions, never as floating-point approximations.

## Install

```sh
npm install schocken
```

## Usage

```ts
import { probabiltyOfKPlayersHavingASchockoutInAtMostXRoundsWithNPlayersAndMDice } from "schocken";

// dice, rounds, players, players WITHOUT a schock out
const chance = probabiltyOfKPlayersHavingASchockoutInAtMostXRoundsWithNPlayersAndMDice(3, 3, 6n, 1n);

console.log(`${chance.numerator} / ${chance.denominator}`);
// 2927990670600862741970230865 / 162598449673865956346428164931584  (~0.000018)
```

The example above asks: with **3 dice** and up to **3 rounds** per player, **6 players** in total, what is the chance that exactly **5 of them** get a Schock Out?

### Parameters

| # | Parameter | Type | Meaning |
| --- | --- | --- | --- |
| 1 | `dice` | `number` | Dice thrown per round (usually 3) |
| 2 | `rounds` | `number` | Maximum number of rounds a player throws |
| 3 | `players` | `bigint` | Number of players in the game |
| 4 | `playersWithoutSchockOut` | `bigint` | Number of players that do **not** get a Schock Out |

So `players - playersWithoutSchockOut` is the number of players that *do* get a Schock Out. Calling the function for every value of `playersWithoutSchockOut` from `0n` to `players` yields all outcomes, and their probabilities sum to exactly 1.

### Return value

A `Fraction` from [precise-fractions](https://www.npmjs.com/package/precise-fractions) — the only runtime dependency. Read the two parts directly:

```ts
chance.numerator;   // bigint
chance.denominator; // bigint
```

Or get a decimal number: `Fraction` implements `valueOf(): number`, so a unary `+` converts it (e.g. `+f(2n, 3n)` is `0.6666666666666666`).

The rules modelled are the usual ones: a round consists of throwing all remaining dice, ones are set aside, and two 6s may be combined into one 1.

## License

MIT
