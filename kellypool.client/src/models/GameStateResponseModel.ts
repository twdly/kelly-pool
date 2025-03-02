import GameStateModel from "./GameStateModel.ts";
import PlayerNumber from "./PlayerNumber.ts";

interface GameStateResponseModel {
    gameState: GameStateModel,
    knownNumbers: PlayerNumber[]
}

export default GameStateResponseModel;