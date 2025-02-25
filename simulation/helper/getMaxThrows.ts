import { GameStateInterface } from "../types";

export function getMaxThrows(gameState: GameStateInterface): number {
    return gameState.turns[0]?.turn || gameState.globals.THROWS;
}