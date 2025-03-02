import Player from "./Player.ts";

interface GameStateModel {
    id: number,
    name: string,
    players: Player[],
    remainingPlayers: Player[],
    hostId: number,
    gameStarted: boolean,
    remainingNumbers: number[],
    turnPlayerId: number,
    gameFinished: number,
}

export default GameStateModel;