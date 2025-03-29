import GameSelectModel from "../models/GameSelectModel";
import GameListing from "./GameListing.tsx";

interface GamesListProps {
    gamesList: GameSelectModel[],
    playerName: string,
    joinGame: Function,
}

function GamesList({gamesList, playerName, joinGame}: GamesListProps) {
    return (
        <>
            {gamesList.length == 0 ? (
                <p>No games found</p>
            ) : (
                gamesList.map((x) => {
                    return (
                        <GameListing game={x} playerName={playerName} joinGame={joinGame}/>
                    )
                })
            )}
        </>
    );
}

export default GamesList;