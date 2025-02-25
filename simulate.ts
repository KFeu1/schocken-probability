// Runs a monte carlo simulation of the probability of a player winning a game of Schocken.

import { Game } from "./simulation/game";
import { parse } from "./simulation/parse";
import { SchockenHeisstDasSpielPlayStyle } from "./simulation/playstyles/SchockenHeisstDasSpiel";

const { SIMULATIONS, SCHOCK_OUTS, ...GLOBALS } = parse();

const game = new Game({
    globals: GLOBALS,
    playStyle: new SchockenHeisstDasSpielPlayStyle(),
});

let fiveSchockOutCount = 0;

for (let i = 0; i < SIMULATIONS; i++) {
    const numberOfSchockOuts = game.run().validate();
    if (numberOfSchockOuts === 5) {
        fiveSchockOutCount++;
    }
    game.reset();
}

const probabilityOfFiveSchockOuts = fiveSchockOutCount / SIMULATIONS;

console.log(`The probability of five Schock Outs is ${probabilityOfFiveSchockOuts.toFixed(8)}`);

