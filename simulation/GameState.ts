import { GameStateInterface, PlayerAction } from "./types";

type WithoutMethods<T> = {
    [K in keyof T]: T[K] extends (...args: any[]) => any ? never : T[K];
};


export class GameState implements GameStateInterface {
    public turns: Array<PlayerAction>;
    public globals: GameStateInterface["globals"];

    constructor(input: WithoutMethods<GameState>) {
        this.globals = input.globals;
        this.turns = input.turns;
    }

    getMaxThrows(): number {
        return this.turns[0]?.turn || this.globals.THROWS;
    }
}
