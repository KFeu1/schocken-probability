# schocken

Calculates probabilities for the German dice game "Schocken" (Knuckle): exact fractions, plus a Monte Carlo simulation.

## Use it (the package export)

```ts
import { probabiltyOfKPlayersHavingASchockoutInAtMostXRoundsWithNPlayersAndMDice } from "schocken";

// dice, rounds, players, players WITHOUT a schock out
const chance = probabiltyOfKPlayersHavingASchockoutInAtMostXRoundsWithNPlayersAndMDice(3, 3, 6n, 1n);

console.log(`${chance.numerator} / ${chance.denominator}`);
```

It returns a `Fraction` from [precise-fractions](https://www.npmjs.com/package/precise-fractions) — the only runtime dependency. `dist/` is what is published; `npm run build` creates it and `prepack` runs it automatically before `npm pack` / `npm publish`.

## Run example (the original question)
```sh
node simulate.ts -p 6 -d 3 -t 3 -n 1000000 -s 5
```

(Node runs the `.ts` files directly. Relative imports therefore carry their `.ts` extension, and type-only imports use `import type` so nothing type-related is left at runtime.)

The probability of 5 Schock Outs is 0.00001804, or 18036 / 1000000000. (Takes a few seconds to run)

```sh
node run.ts
```

computes the same probabilities exactly instead of sampling them (`run.ts` is the old package entry point, kept as a local sample).

## Development

```sh
pnpm run typecheck   # type-checks all sources, no output
pnpm run build       # writes dist/ (JS + .d.ts) for the package
```
