// Locks down the numbers printed in README.md. If the calculation ever changes,
// this test and the README have to be updated together.

import { describe, it } from "node:test";
import assert from "node:assert/strict";

import { probabiltyOfKPlayersHavingASchockoutInAtMostXRoundsWithNPlayersAndMDice } from "./index.ts";
import { createFraction as f } from "precise-fractions";

describe("README usage example", () => {
    // dice, rounds, players, players WITHOUT a schock out
    const chance = probabiltyOfKPlayersHavingASchockoutInAtMostXRoundsWithNPlayersAndMDice(3, 3, 6, 1);

    it("prints the fraction of the README", () => {
        assert.equal(
            `${chance.numerator} / ${chance.denominator}`,
            "2927990670600862741970230865 / 162598449673865956346428164931584",
        );
    });

    it("exposes those parts as bigints", () => {
        assert.equal(chance.numerator, 2927990670600862741970230865n);
        assert.equal(chance.denominator, 162598449673865956346428164931584n);
    });

    it("is the decimal number quoted in the README (~0.000018)", () => {
        // 'Fraction.valueOf(): number', so a unary '+' converts it.
        assert.ok(Math.abs(+chance - 0.000018) < 1e-8);
    });
});

describe("README parameter table", () => {
    it("yields all outcomes that sum up to exactly 1", () => {
        const dice = 3;
        const rounds = 3;
        const players = 6;

        // 'sum' accumulates mutatively, exactly like the implementation does it.
        const sum = f(0);
        let outcomeCount = 0;

        for (let playersWithoutSchockOut = 0; playersWithoutSchockOut <= players; playersWithoutSchockOut++) {
            sum.add(probabiltyOfKPlayersHavingASchockoutInAtMostXRoundsWithNPlayersAndMDice(dice, rounds, players, playersWithoutSchockOut));
            outcomeCount++;
        }

        assert.equal(outcomeCount, players + 1);
        assert.equal(sum.numerator, 1n);
        assert.equal(sum.denominator, 1n);
    });
});
