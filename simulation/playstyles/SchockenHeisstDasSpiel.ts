import { countOnes, countSixes, throwDice } from "../game";
import { GameStateInterface, PlayerAction, PlayStyle } from "../types";

export class SchockenHeisstDasSpielPlayStyle implements PlayStyle {
    takeAktion(gameState: GameStateInterface): PlayerAction {
        const maxThrows = gameState.getMaxThrows();

        let currentKeptDice: Array<number> = [];
        let currentThrow = 0;

        while (++currentThrow < maxThrows) {
            const dice = throwDice(gameState.globals.DICE - currentKeptDice.length);
            const oneCount = countOnes(dice);
            for (let i = 0; i < oneCount; i++) {
                currentKeptDice.push(1);
            }
            const sixCount = countSixes(dice);
            for (let i = 0; i < sixCount - 1; i++) {
                currentKeptDice.push(1);
            }
        }

        // The last round; the rest of the dice are random
        const randomUnknownDice = throwDice(gameState.globals.DICE - currentKeptDice.length);

        return {
            keep: currentKeptDice,
            unknown: randomUnknownDice,
            turn: currentThrow,
        };
    }
}