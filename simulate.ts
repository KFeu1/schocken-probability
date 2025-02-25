// Runs a monte carlo simulation of the probability of a player winning a game of Schocken.

import { Game } from "./simulation/game";
import { parse } from "./simulation/parse";
import { SchockenHeisstDasSpielPlayStyle } from "./simulation/playstyles/SchockenHeisstDasSpiel";

const { SIMULATIONS, SCHOCK_OUTS, ...REST } = parse();

const game = new Game({ globals: REST, playStyle: new SchockenHeisstDasSpielPlayStyle() });

console.log(game);
