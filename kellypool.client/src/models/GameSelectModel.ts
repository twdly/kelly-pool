import GameConfigModel from "./GameConfigModel.ts";

interface GameSelectModel {
    id: number,
    name: string,
    currentPlayers: number,
    gameStarted: boolean,
    config: GameConfigModel
}

export default GameSelectModel;