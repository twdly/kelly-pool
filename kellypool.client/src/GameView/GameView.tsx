import {useEffect, useRef, useState } from "react";
import GameStateModel from "../models/GameStateModel.ts";
import LeaveGameModel from "../models/LeaveGameModel.ts";
import NumberCardGrid from "./NumberCardGrid.tsx";
import GameStateResponseModel from "../models/GameStateResponseModel.ts";
import StateRequestModel from "../models/StateRequestModel.ts";
import PlayerNumber from "../models/PlayerNumber.ts";
import EndTurnModel from "../models/EndTurnModel.ts";

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
        
        const setLocalStorage = () => {
            sessionStorage.setItem('game-id', `${GameState.id}`)
            sessionStorage.setItem('player-id', `${PlayerId}`)
        }
        
        startPolling();
        setLocalStorage();
        
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
                sessionStorage.clear();
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
    
    const EndTurn = async () => {
        const endTurnUri = 'game-state/end-turn';
        
        const body: EndTurnModel = {
            sunkNumbers: selectedNumbers,
            gameId: GameState.id,
            playerId: PlayerId,
        }
        
        const response = await fetch(endTurnUri, {
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
            setSelectedNumbers([]);
        }
    }

    return (
        <div>
            <h1>{GameState.name}</h1>
            {GameState.gameStarted ? (
                <>
                    {GameState.turnPlayerId === PlayerId && (
                        <h2>It's your turn!</h2>
                    )}
                    <h2>Known Numbers:</h2>
                    {knownNumbers.map(n => {
                        return (
                            <p key={n.player.id}>{n.player.name}: {n.number}</p>
                        )
                    })}
                    
                    <h2>Remaining players:</h2>
                    {GameState.remainingPlayers.map(p => {
                        return (
                        <p key={p.id}>{p.name}</p>
                        )
                    })}
                    
                    <NumberCardGrid numbers={GameState.remainingNumbers} selectedNumbers={selectedNumbers}
                                    handleNumberSelected={setSelectedNumbers}/>
                    {GameState.turnPlayerId === PlayerId && (
                        <button onClick={EndTurn}>End turn</button>
                    )}
                </>
            ) : (
                <div>
                    {GameState.gameFinished && (
                        <h3>The winner is: {GameState.remainingPlayers.at(0) != undefined ? `${GameState.remainingPlayers.at(0)?.name}` : "nobody :("}</h3>
                    )}
                    <h2>Players:</h2>
                    {GameState.players.map((x) => {
                        return (
                            <div key={x.id}>
                                <p>{x.name}</p>
                            </div>
                        )
                    })}
                    {GameState.hostId === PlayerId && (
                        <button disabled={GameState.players.length == 1} onClick={BeginGame}>Start game</button>
                    )}
                    <button onClick={HandleLeave}>Leave game</button>
                </div>
            )}
        </div>
    );
}

export default GameView;