import {useEffect, useRef, useState } from "react";
import GameStateModel from "../models/GameStateModel.ts";
import LeaveGameModel from "../models/LeaveGameModel.ts";
import NumberCardGrid from "./NumberCardGrid.tsx";

interface GameViewProps {
    GameState: GameStateModel,
    SetGameState: Function,
    PlayerId: number
}

function GameView({GameState, SetGameState, PlayerId}: GameViewProps) {

    const [selectedNumbers, setSelectedNumbers] = useState<number[]>([]);
    
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

    const HandleLeave = async () => {
        const leaveUri = 'management/leave-game';
        
        const leaveModel: LeaveGameModel = {
            playerId: PlayerId,
            gameId: GameState.id,
        }
        
        const response = await fetch(leaveUri, {
            method: 'POST',
            body: JSON.stringify(leaveModel),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
        });
        
        if (response.ok) {
            const result: boolean = await response.json();
            if (result) {
                SetGameState(undefined);
                return;
            }
        }
    }
    
    return (
        <div>
            <h1>{GameState.name}</h1>
            <h2>Players:</h2>
            {GameState.players.map((x) => {
                return (
                    <div key={x.id}>
                        <p>{x.name}</p>
                    </div>
                )
            })}
            <button onClick={HandleLeave}>Leave game</button>
            <NumberCardGrid numbers={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14 ,15 ,16]} selectedNumbers={selectedNumbers} handleNumberSelected={setSelectedNumbers}/>
        </div>
    );
}

export default GameView;