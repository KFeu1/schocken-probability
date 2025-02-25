import { GameState } from "./GameState";
import { PlayStyle } from "./types";

type GameInput = {
    globals: Game["globals"],
    playStyle: PlayStyle,
}

export class Game {
    public state: GameState;
    public playStyle: PlayStyle;
    public globals: {
        PLAYERS: number;
        DICE: number;
        THROWS: number;
    }

    constructor(input: GameInput) {
        const { globals, playStyle } = input;

        this.globals = globals;
        this.state = new GameState(this);
        this.playStyle = playStyle;
    }

    run(): void {
        for (let i = 0; i < this.globals.PLAYERS; i++) {
            const playerAction = this.playStyle.takeAktion(this.state);
            this.state.turns.push(playerAction);
        }
    }
}