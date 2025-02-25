import Player from "./Player.ts";

interface GameStateModel {
    id: number,
    name: string,
    players: Player[]
}

export default GameStateModel;