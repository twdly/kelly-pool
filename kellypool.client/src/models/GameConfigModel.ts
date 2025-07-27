import Player from "./Player";

interface GameConfigModel {
    gameName: string;
    host: Player;
    mode: number;
    includeWhiteBall: boolean;
    repeatNumbers: boolean;
    maxPlayers: number;
    gracePeriod: number;
}

export default GameConfigModel;