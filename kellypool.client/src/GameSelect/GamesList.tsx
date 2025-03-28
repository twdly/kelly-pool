import GameSelectModel from "../models/GameSelectModel";

interface GamesListProps {
    gamesList: GameSelectModel[],
    playerName: String,
    joinGame: Function,
}

function GamesList({gamesList, playerName, joinGame}: GamesListProps) {
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
        <>
            {gamesList.length == 0 ? (
                <p>No games found</p>
            ) : (
                gamesList.map((x) => {
                    const buttonDisabled = x.currentPlayers === x.config.maxPlayers || playerName.trim().length === 0 || x.gameStarted;
                    return (
                        <div key={x.id} className={"game-listing"}>
                            <p>{x.name}</p>
                            <p>Players: {x.currentPlayers} / {x.config.maxPlayers}{x.gameStarted ? " (in progress)" : ""}</p>
                            <button
                                disabled={buttonDisabled}
                                onClick={() => joinGame(x.id)}
                                title={buttonDisabled ? getButtonDisabledReason(x) : ""}>Join
                            </button>
                        </div>
                    )
                })
            )}
        </>
    );
}

export default GamesList;