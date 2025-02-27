import GameStateModel from "./GameStateModel.ts";

interface JoinGameResponseModel {
    gameState: GameStateModel,
    playerId: number,
}

export default JoinGameResponseModel;