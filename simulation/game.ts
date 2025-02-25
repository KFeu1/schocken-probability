import { GameState } from "./GameState";
import { PlayerAction, PlayStyle } from "./types";

type GameInput = {
    globals: Game["globals"],
    playStyle: PlayStyle,
}

type SchockOutCount = number;

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

    reset(): void {
        this.state.reset();
    }

    run(): this {
        for (let i = 0; i < this.globals.PLAYERS; i++) {
            const playerAction = this.playStyle.takeAktion(this.state);
            this.state.turns.push(playerAction);
        }
        return this;
    }

    validate(): SchockOutCount {
        const hasSchockOut = (result: PlayerAction): boolean => {
            let oneCount = 0;

            for (let i = 0; i < result.keep.length; i++) {
                if (result.keep[i] === 1) {
                    oneCount++;
                }
            }
            for (let i = 0; i < result.unknown.length; i++) {
                if (result.unknown[i] === 1) {
                    oneCount++;
                }
            }

            return oneCount === this.globals.DICE;
        }

        let count = 0;
        for (let i = 0; i < this.globals.PLAYERS; i++) {
            const playerAction = this.state.turns[i];
            if (hasSchockOut(playerAction)) {
                count++;
            }
        }
        return count;
    }
}