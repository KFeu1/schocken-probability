export type PlayerAction = {
    /** Which dice are outside/visible of the cup */
    keep: Array<number>;
    /** The rest of the dice; random  */
    unknown: Array<number>;
    /** After how many rounds the player ended his turn */
    turn: number;
}

export interface GameStateInterface {
    turns: Array<PlayerAction>;
    globals: {
        PLAYERS: number;
        DICE: number;
        THROWS: number;
    };
    getMaxThrows(): number;
}

export interface PlayStyle {
    takeAktion(gameState: GameStateInterface): PlayerAction;
}
