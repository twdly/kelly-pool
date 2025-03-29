import { useState } from "react";
import GameSelectModel from "../models/GameSelectModel";

interface GameListingProps {
    game: GameSelectModel,
    playerName: string,
    joinGame: Function,
}

function GameListing({game, playerName, joinGame}: GameListingProps) {
    const [showConfig, setShowConfig] = useState<boolean>(false);

    const buttonDisabled = game.currentPlayers === game.config.maxPlayers || playerName.trim().length === 0 || game.gameStarted;
    
    const getButtonDisabledReason = (game: GameSelectModel) => {
        if (game.gameStarted) {
            return "This game is already in progress"
        }
        if (game.config.maxPlayers === game.currentPlayers) {
            return "This game is already full"
        }
        if (playerName.trim().length === 0) {
            return "Please enter a name before joining a game"
        }
    }
    
    return (
        <div key={game.id} className={"game-listing"}>
            <p>{game.name}</p>
            <p>Players: {game.currentPlayers} / {game.config.maxPlayers}{game.gameStarted ? " (in progress)" : ""}</p>
            <button onClick={() => setShowConfig(!showConfig)}>{showConfig ? "Hide rules" : "Show rules"}</button>
            <button
                disabled={buttonDisabled}
                onClick={() => joinGame(game.id)}
                title={buttonDisabled ? getButtonDisabledReason(game) : ""}>Join
            </button>
        </div>
    );
}

export default GameListing;
