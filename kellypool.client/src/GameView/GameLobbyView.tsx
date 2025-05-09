import GameStateModel from "../models/GameStateModel.ts";
import StateRequestModel from "../models/StateRequestModel.ts";
import GameStateResponseModel from "../models/GameStateResponseModel.ts";
import LeaveGameModel from "../models/LeaveGameModel.ts";
import { useState } from "react";

interface GameLobbyViewProps {
    gameState: GameStateModel,
    playerId: number,
    setGameState: Function,
    setKnownNumbers: Function,
}

function GameLobbyView ({gameState, playerId, setGameState, setKnownNumbers}: GameLobbyViewProps) {
    const showWins: boolean = gameState.players.filter((x) => x.wins != 0).length != 0;
    const [editingSettings, setEditingSettings] = useState<boolean>();

    const BeginGame = async () => {
        const beginUri = 'game-state/begin';

        const body: StateRequestModel = {
            gameId: gameState.id,
            playerId: playerId,
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
            setGameState(result.gameState);
            setKnownNumbers(result.knownNumbers);
        }
    }

    const HandleLeave = async () => {
        const leaveUri = 'management/leave-game';

        const leaveModel: LeaveGameModel = {
            playerId: playerId,
            gameId: gameState.id,
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
                setGameState(undefined);
                sessionStorage.clear();
                return;
            }
        }
    }
    
    return (
        <>
            {editingSettings ? (
                <>
                    <button>Save</button>
                    <button onClick={() => setEditingSettings(false)}>Cancel</button>
                </>
            ) : (
                <div>
                    {gameState.gameFinished && (
                        <h3>The winner is: {gameState.winner != null ? `${gameState.winner.name}` : "nobody :("}</h3>
                    )}
                    <h2>Players:</h2>
                    <h3>{gameState.players.length} / {gameState.config.maxPlayers}</h3>
                    {gameState.players.map((x) => {
                        return (
                            <div key={x.id}>
                                <p>{x.name} {showWins ? `(${x.wins} ${x.wins == 1 ? "win" : "wins"})` : ""}</p>
                            </div>
                        )
                    })}
                    {gameState.hostId === playerId && (
                        <>
                            <button disabled={gameState.players.length == 1} onClick={BeginGame}>Start game</button>
                            <button onClick={() => setEditingSettings(true)}>Edit settings</button>
                        </>
                    )}
                    <button onClick={HandleLeave}>Leave game</button>
                </div>
            )}
        </>


    );
}

export default GameLobbyView;