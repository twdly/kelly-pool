import { useState } from "react";
import GameSelect from "./GameSelect/GameSelect.tsx";
import GameStateModel from "./models/GameStateModel.ts";
import GameView from "./GameView/GameView.tsx";

function App() {
    
    const [game, setGame] = useState<GameStateModel>()
    
    const isInGameSelect = game === undefined;
    
    return (
        <>
            {isInGameSelect ? (
                <GameSelect handleGameSet={setGame}/>
            ) : (
                <GameView GameState={game}/>
            )}
        </>
    )
}

export default App;
