
import { z } from "zod";

const argvParser = require('yargs-parser')

const schema = z.object({
    p: z.number().describe("The number of players."),
    d: z.number().describe("The number of dice."),
    t: z.number().describe("The number of dice throws per round"),
});

export function parse() {
    const argv = argvParser(process.argv.slice(2));
    const { error, data } = schema.safeParse(argv);

    if (error) {
        const helpText = Object.entries(schema.shape).map(([key, value]) => {
            return `${key}: ${value._def.description}`;
        });
        console.error("Please provide the following arguments: players, dice, throws");
        console.error(helpText.join("\n"));
        process.exit(1);
    }

    return {
        players: data.p,
        dice: data.d,
        throws: data.t,
    }
}