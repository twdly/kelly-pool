import Player from "./Player.ts";

interface GameStateModel {
    id: number,
    name: string,
    players: Player[]
    hostId: number,
}

export default GameStateModel;