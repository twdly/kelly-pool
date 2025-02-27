import { useState } from "react";
import GameSelect from "./GameSelect/GameSelect.tsx";
import GameStateModel from "./models/GameStateModel.ts";
import GameView from "./GameView/GameView.tsx";

function App() {
    
    const [game, setGame] = useState<GameStateModel>();
    const [playerId, setPlayerId] = useState<number>(-1); 
    
    const isInGameSelect = game === undefined;
    
    return (
        <>
            {isInGameSelect ? (
                <GameSelect HandleGameSet={setGame} HandlePlayerIdSet={setPlayerId}/>
            ) : (
                <GameView GameState={game} SetGameState={setGame} PlayerId={playerId}/>
            )}
        </>
    )
}

export default App;
