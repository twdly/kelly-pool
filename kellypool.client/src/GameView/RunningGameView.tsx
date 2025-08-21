import NumberCardGrid from "./NumberCardGrid.tsx";
import GameStateModel from "../models/GameStateModel.ts";
import PlayerNumber from "../models/PlayerNumber.ts";
import SunkNumbersModel from "../models/SunkNumbersModel.ts";
import GameStateResponseModel from "../models/GameStateResponseModel.ts";
import { useState } from "react";

import "./RunningGameView.css";
import GenericInteractionModel from "../models/GenericInteractionModel.ts";

interface RunningGameViewProps {
    gameState: GameStateModel,
    playerId: number,
    knownNumbers: PlayerNumber[],
    setGameState: Function,
}

function RunningGameView ({gameState, playerId, knownNumbers, setGameState}: RunningGameViewProps) {
    const [selectedNumbers, setSelectedNumbers] = useState<number[]>([]);
    
    const isYourTurn: boolean = gameState.turnPlayerId === playerId;
    const endTurn = async () => {
        const endTurnUri = 'game-state/end-turn';

        const body: GenericInteractionModel = {
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
        }
    }
    
    const sinkBalls = async () => {
        const sinkBallsUri = 'game-state/sink-balls';

        const body: SunkNumbersModel = {
            sunkNumbers: selectedNumbers,
            gameId: gameState.id,
            playerId: playerId,
        }

        const response = await fetch(sinkBallsUri, {
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
    
    const getPlayerClass = (playerId: number): string => {
        return gameState.turnPlayerId === playerId ? "current-player" : "";
    }
    
    return (
        <div>
            <h3>Round {gameState.roundCount}</h3>
            {gameState.config.gracePeriod !== 0 && gameState.roundCount < gameState.config.gracePeriod + 1 && (
                <h3>Grace period remaining: {gameState.config.gracePeriod + 1 - gameState.roundCount} round(s)</h3>
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
                            <p className={getPlayerClass(p.id)} key={p.id}>{p.name} {gameState.turnPlayerId === p.id ? " (playing now)" : ""}</p>
                        )
                    })}
                </div>
            </div>

            <NumberCardGrid numbers={gameState.remainingNumbers} 
                            selectedNumbers={selectedNumbers}
                            handleNumberSelected={setSelectedNumbers} 
                            isYourTurn={isYourTurn}
                            knownNumbers={knownNumbers}/>
            {isYourTurn && (
                <>
                    <button onClick={sinkBalls} disabled={selectedNumbers.length === 0}>Sink balls</button>
                    <button onClick={endTurn} disabled={selectedNumbers.length !== 0}>End turn</button>
                </>
            )}
        </div>
    );
}

export default RunningGameView;