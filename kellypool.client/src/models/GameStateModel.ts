import Player from "./Player.ts";
import GameConfigModel from "./GameConfigModel.ts";

interface GameStateModel {
    id: number,
    players: Player[],
    remainingPlayers: Player[],
    hostId: number,
    gameStarted: boolean,
    remainingNumbers: number[],
    turnPlayerId: number,
    gameFinished: number,
    winner: Player,
    config: GameConfigModel,
    roundCount: number,
}

export default GameStateModel;