import { useState, useEffect } from "react";
import GameSelect from "./GameSelect/GameSelect.tsx";
import GameStateModel from "./models/GameStateModel.ts";
import GameView from "./GameView/GameView.tsx";
import StateRequestModel from "./models/StateRequestModel.ts";
import GameStateResponseModel from "./models/GameStateResponseModel.ts";

function App() {
    
    const [game, setGame] = useState<GameStateModel>();
    const [playerId, setPlayerId] = useState<number>(-1);
    
    const isInGameSelect = game === undefined;
    
    const rejoinGame = async () => {
        const gameId = sessionStorage.getItem('game-id');
        const playerId = sessionStorage.getItem('player-id');
        
        if (gameId === null || playerId === null)
        {
            return;
        }
        
        const rejoinUri = "management/rejoin-game";
        
        const body: StateRequestModel = {
            playerId: parseInt(playerId),
            gameId: parseInt(gameId),
            
        }
        
        const response = await fetch(rejoinUri, {
            method: 'POST',
            body: JSON.stringify(body),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
        });
        
        if (response.ok) {
            const result: GameStateResponseModel = await response.json();
            setGame(result.gameState);
            setPlayerId(parseInt(playerId));
        } else {
            // Game has likely expired
            sessionStorage.clear();
        }
    }

    useEffect(() => {
        rejoinGame()
    }, []);
    
    return (
        <>
            {isInGameSelect ? (
                <GameSelect HandleGameSet={setGame} HandlePlayerIdSet={setPlayerId}/>
            ) : (
                <GameView gameState={game} setGameState={setGame} playerId={playerId}/>
            )}
        </>
    )
}

export default App;
