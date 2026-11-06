import type { GameState } from "./GameState.ts";

export type PlayerAction = {
    /** Which dice are outside/visible of the cup */
    keep: Array<number>;
    /** The rest of the dice; random  */
    unknown: Array<number>;
    /** After how many rounds the player ended his turn */
    turn: number;
}

export interface PlayStyle {
    takeAktion(gameState: GameState): PlayerAction;
}
