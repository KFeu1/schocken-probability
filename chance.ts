// Command line helper for the one function this package exports. The arguments are positional,
// in the same order as the function parameters, so
//            node chance.ts 3 3 6 1
// means
//            probabiltyOfKPlayersHavingASchockoutInAtMostXRoundsWithNPlayersAndMDice(3, 3, 6, 1)

import { Decimal } from "decimal.js";
import { Fraction } from "precise-fractions";
import { z } from "zod";

import { probabiltyOfKPlayersHavingASchockoutInAtMostXRoundsWithNPlayersAndMDice } from "./src/methods.ts";

const schema = z.tuple([
    z.number().int().min(1).describe("number of dice thrown per round"),
    z.number().int().min(1).describe("maximum number of rounds a player throws"),
    z.number().int().min(1).describe("number of players in the game"),
    z.number().int().min(0).describe("number of players that do NOT get a Schock Out"),
]);

/** The names of the positional arguments, in order. */
const NAMES = ["dice", "rounds", "players", "playersWithoutSchockOut"] as const;

const USAGE = "Usage: node chance.ts <dice> <rounds> <players> <playersWithoutSchockOut>";

function printUsage(): void {
    console.error(USAGE);
    console.error("");
    console.error(NAMES.map((name, index) => {
        return `${index + 1}. ${name.padEnd(NAMES.at(-1)!.length)} ${schema.items[index]._def.description}`;
    }).join("\n"));
    console.error("");
    console.error("'players - playersWithoutSchockOut' is the number of players that DO get a Schock Out.");
}

(() => {
    const argv = process.argv.slice(2);

    if (argv.length === 1 && (argv[0] === "-h" || argv[0] === "--help")) {
        printUsage();
        process.exit(0);
    }

    if (argv.length !== NAMES.length) {
        printUsage();
        console.error("");
        console.error(`Expected exactly ${NAMES.length} arguments, got ${argv.length}.`);
        process.exit(1);
    }

    const { error, data } = schema.safeParse(argv.map((arg) => {
        return Number(arg);
    }));

    if (error) {
        printUsage();
        console.error("");
        console.error(error.issues.map((issue) => {
            const index = Number(issue.path[0]);
            return Number.isInteger(index) ? `${index + 1}. ${NAMES[index]}: ${issue.message}` : issue.message;
        }).join("\n"));
        process.exit(1);
    }

    const [dice, rounds, players, playersWithoutSchockOut] = data;

    if (playersWithoutSchockOut > players) {
        console.error("'playersWithoutSchockOut' cannot be greater than 'players'.");
        process.exit(1);
    }

    const chance: Fraction = probabiltyOfKPlayersHavingASchockoutInAtMostXRoundsWithNPlayersAndMDice(dice, rounds, players, playersWithoutSchockOut);

    // A plain 'number' is not precise enough for these fractions, so the decimal expansion is done by decimal.js.
    Decimal.set({ precision: 30 });
    const decimal = new Decimal(chance.numerator.toString()).div(new Decimal(chance.denominator.toString()));

    const schockOuts = players - playersWithoutSchockOut;
    console.log(`${schockOuts} of ${players} players getting a Schock Out with ${dice} dice in at most ${rounds} rounds:`);
    console.log(`${chance.numerator} / ${chance.denominator}`);
    console.log(`~ ${decimal}`);
})();
