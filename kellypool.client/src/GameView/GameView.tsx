import {useEffect, useRef, useState } from "react";
import GameStateModel from "../models/GameStateModel.ts";
import LeaveGameModel from "../models/LeaveGameModel.ts";
import NumberCardGrid from "./NumberCardGrid.tsx";
import GameStateResponseModel from "../models/GameStateResponseModel.ts";
import StateRequestModel from "../models/StateRequestModel.ts";
import PlayerNumber from "../models/PlayerNumber.ts";

interface GameViewProps {
    GameState: GameStateModel,
    SetGameState: Function,
    PlayerId: number
}

function GameView({GameState, SetGameState, PlayerId}: GameViewProps) {

    const [selectedNumbers, setSelectedNumbers] = useState<number[]>([]);
    const [knownNumbers, setKnownNumbers] = useState<PlayerNumber[]>([]);
    
    const updateUri = `game-state/get?gameId=${GameState.id}&playerId=${PlayerId}`;
    
    const UpdateGameState = async () => {
        const response = await fetch(updateUri);
        if (response.ok) {
            const result: GameStateResponseModel = await response.json();
            SetGameState(result.gameState);
            setKnownNumbers(result.knownNumbers);
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
    
    const BeginGame = async () => {
        const beginUri = 'game-state/begin';
        
        const body: StateRequestModel = {
            gameId: GameState.id,
            playerId: PlayerId,
        } 
        
        const response = await fetch(beginUri, {
            method: 'POST',
            body: JSON.stringify(body),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
        });
        
        if (response.ok) {
            const result: GameStateResponseModel = await response.json();
            SetGameState(result.gameState);
            setKnownNumbers(result.knownNumbers);
        }
    }
    
    return (
        <div>
            <h1>{GameState.name}</h1>
            {GameState.gameStarted ? (
                <>
                    <h2>Known Numbers:</h2>
                    {knownNumbers.map(n => {
                        return (
                            <p key={n.player.id}>{n.player.name}: {n.number}</p>
                        )
                    })}
                    <NumberCardGrid numbers={GameState.remainingNumbers} selectedNumbers={selectedNumbers}
                                    handleNumberSelected={setSelectedNumbers}/>
                </>
            ) : (
                <div>
                    <h2>Players:</h2>
                    {GameState.players.map((x) => {
                        return (
                            <div key={x.id}>
                                <p>{x.name}</p>
                            </div>
                        )
                    })}
                    {GameState.hostId === PlayerId && (
                        <button onClick={BeginGame}>Start game</button>
                    )}
                    <button onClick={HandleLeave}>Leave game</button>
                </div>
            )}
        </div>
    );
}

export default GameView;