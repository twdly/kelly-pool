import { Icon } from "@iconify/react";
import GameSelectModel from "../models/GameSelectModel";
import './GameListing.css'

interface GameListingProps {
    game: GameSelectModel,
    playerName: string,
    joinGame: Function,
}

function GameListing({game, playerName, joinGame}: GameListingProps) {
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
    
    const getModeName = (num: number) => {
        switch (num) {
            case 0:
                return "One other";
            case 1:
                return "Yourself";
            case 2:
                return "Everyone else";
            case 3:
                return "Everyone";
            default:
                return "Unknown";
        }
    }
    
    return (
        <div key={game.id} className={"game-listing"}>
            <p>{game.name}</p>
            <p>Players: {game.currentPlayers} / {game.config.maxPlayers}{game.gameStarted ? " (in progress)" : ""}</p>
            <button
                disabled={buttonDisabled}
                onClick={() => joinGame(game.id)}
                title={buttonDisabled ? getButtonDisabledReason(game) : ""}>Join
            </button>
            <button popoverTarget={`rules-popover-${game.id}`} className={"popover-button"} id={'rules-button'}>
                <Icon className="icon" icon={"uil:info-circle"}/>
            </button>
            <div popover="auto" id={`rules-popover-${game.id}`} className={"popover"}>
                <p>Known numbers: {getModeName(game.config.mode)}</p>
                <p>Repeat numbers: {game.config.repeatNumbers ? "Yes" : "No"}</p>
                <p>Include white ball: {game.config.includeWhiteBall ? "Yes" : "No"}</p>
            </div>
        </div>
    );
}

export default GameListing;
