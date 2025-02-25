// Runs a monte carlo simulation of the probability of a player winning a game of Schocken.

import { z } from "zod";
import { parse } from "./simulation/parse";

const { PLAYERS, DICE, THROWS, SIMULATIONS } = parse();

