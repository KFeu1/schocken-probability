// Runs a monte carlo simulation of the probability of a player winning a game of Schocken.

import { Game } from "./simulation/Game";
import { parse } from "./simulation/parse";
import { SchockenHeisstDasSpielPlayStyle } from "./simulation/playstyles/SchockenHeisstDasSpiel";

const { SIMULATIONS, SCHOCK_OUTS, ...GLOBALS } = parse();

const game = new Game({
    globals: GLOBALS,
    playStyle: new SchockenHeisstDasSpielPlayStyle(),
});

let targetSchockOutCount = 0;

for (let i = 0; i < SIMULATIONS; i++) {
    const numberOfSchockOuts = game.run().validate();
    if (numberOfSchockOuts === SCHOCK_OUTS) {
        targetSchockOutCount++;
    }
    game.reset();
}

const probabilityOfFiveSchockOuts = targetSchockOutCount / SIMULATIONS;

console.log(`The probability of ${SCHOCK_OUTS} Schock Outs is ${probabilityOfFiveSchockOuts.toFixed(8)}, or ${targetSchockOutCount} / ${SIMULATIONS}.`);

