import { useState } from "react";
import GameSelect from "./GameSelect/GameSelect.tsx";
import Game from "./models/GameSelectModel.ts";

function App() {
    
    const [game, setGame] = useState<Game>()
    
    const isInGame = game !== undefined;
    
    return (
        <>
            {!isInGame && (
                <GameSelect handleGameSet={setGame}/>
            )}
        </>
    )
}

export default App;
