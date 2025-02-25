// Runs a monte carlo simulation of the probability of a player winning a game of Schocken.

import { z } from "zod";
import { parse } from "./simulation/parse";

const { players, dice, throws } = parse();

console.log(players, dice, throws)
