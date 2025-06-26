import GameConfigModel from "./GameConfigModel.ts";

interface EditConfigModel {
    playerId: number,
    gameId: number,
    config: GameConfigModel,
}

export default EditConfigModel;