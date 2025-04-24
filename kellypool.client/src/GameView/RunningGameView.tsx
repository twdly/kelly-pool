import NumberCardGrid from "./NumberCardGrid.tsx";
import GameStateModel from "../models/GameStateModel.ts";
import PlayerNumber from "../models/PlayerNumber.ts";
import EndTurnModel from "../models/EndTurnModel.ts";
import GameStateResponseModel from "../models/GameStateResponseModel.ts";
import { useState } from "react";

interface RunningGameViewProps {
    gameState: GameStateModel,
    playerId: number,
    knownNumbers: PlayerNumber[],
    setGameState: Function,
}

function RunningGameView ({gameState, playerId, knownNumbers, setGameState}: RunningGameViewProps) {
    const [selectedNumbers, setSelectedNumbers] = useState<number[]>([]);
    
    const isYourTurn: boolean = gameState.turnPlayerId === playerId;
    const EndTurn = async () => {
        const endTurnUri = 'game-state/end-turn';

        const body: EndTurnModel = {
            sunkNumbers: selectedNumbers,
            gameId: gameState.id,
            playerId: playerId,
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
            setGameState(result.gameState);
            setSelectedNumbers([]);
        }
    }
    
    return (
        <div>
            {isYourTurn && (
                <h2>It's your turn!</h2>
            )}

            <div className={'state-panels'}>
                <div className={'state-panel-item'}>
                    <h3>Known Numbers:</h3>
                    {knownNumbers.map(n => {
                        return (
                            <p key={n.player.id}>{n.player.name} {n.player.id == playerId ? "(You)" : ""}: {n.number}</p>
                        )
                    })}
                </div>

                <div className={'state-panel-item'}>
                    <h3>Remaining players:</h3>
                    {gameState.remainingPlayers.map(p => {
                        return (
                            <p key={p.id}>{p.name}</p>
                        )
                    })}
                </div>
            </div>

            <NumberCardGrid numbers={gameState.remainingNumbers} selectedNumbers={selectedNumbers}
                            handleNumberSelected={setSelectedNumbers} isYourTurn={isYourTurn}/>
            {isYourTurn && (
                <button onClick={EndTurn}>End turn</button>
            )}
        </div>
    );
}

export default RunningGameView;