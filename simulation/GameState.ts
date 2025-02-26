import { Game } from "./Game";
import { PlayerAction } from "./types";

type WithoutMethods<T> = {
    [K in keyof T]: T[K] extends (...args: any[]) => any ? never : T[K];
};


export class GameState {
    public turns: Array<PlayerAction> = [];
    public game: Game;

    constructor(game: Game) {
        this.game = game;
    }

    getMaxThrows(): number {
        return this.turns[0]?.turn || this.game.globals.THROWS;
    }

    reset(): void {
        this.turns = [];
    }
}
