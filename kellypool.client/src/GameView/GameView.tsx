import {useEffect, useRef } from "react";
import GameStateModel from "../models/GameStateModel.ts";

interface GameViewProps {
    GameState: GameStateModel,
    SetGameState: Function,
}

function GameView({GameState, SetGameState}: GameViewProps) {
    const updateUri = `game-state/get?id=${GameState.id}`;
    
    const UpdateGameState = async () => {
        const response = await fetch(updateUri);
        if (response.ok) {
            const result = await response.json();
            SetGameState(result);
        }
    }
    
    const pollingRef = useRef<ReturnType<typeof setInterval>>(null);

    useEffect(() => {
        const startPolling = () => {
            pollingRef.current = setInterval(async () => {
                await UpdateGameState();
            }, 3000);
        };
        startPolling();
        
        return () => {
            clearInterval(pollingRef.current as NodeJS.Timeout);
        }
    }, []);
    
    return (
        <div>
            <h1>{GameState.name}</h1>
            <h2>Players:</h2>
            {GameState.players.map((x) => {
                return (
                    <div key={GameState.players.indexOf(x).toString()}>
                        <p>{x.name}</p>
                    </div>
                )
            })}
        </div>
    );
}

export default GameView;