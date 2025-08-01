import {Dispatch, SetStateAction, useEffect, useRef, useState} from "react";
import GameStateModel from "../models/GameStateModel.ts";
import GameStateResponseModel from "../models/GameStateResponseModel.ts";
import PlayerNumber from "../models/PlayerNumber.ts";

import "./GameView.css";
import GameLobbyView from "./GameLobbyView.tsx";
import RunningGameView from "./RunningGameView.tsx";

interface GameViewProps {
    gameState: GameStateModel,
    setGameState: Dispatch<SetStateAction<GameStateModel | undefined>>,
    playerId: number
}

function GameView({gameState, setGameState, playerId}: GameViewProps) {
    const [knownNumbers, setKnownNumbers] = useState<PlayerNumber[]>([]);
    
    const updateUri = `game-state/get?gameId=${gameState.id}&playerId=${playerId}`;
    
    const UpdateGameState = async () => {
        const response = await fetch(updateUri);
        if (response.ok) {
            const result: GameStateResponseModel = await response.json();
            if (gameHasPlayerId(playerId, result)) {
                setGameState(result.gameState);
                setKnownNumbers(result.knownNumbers);
            } else {
                setGameState(undefined);
            }
        }
    }
    
    const gameHasPlayerId = (playerId: number, game: GameStateResponseModel): boolean => {
        return game.gameState.players.find(x => x.id === playerId) !== undefined;
    }
    
    const handlePlayerKicked = (playerId: number) => {
        const newPlayerList = gameState.players.filter(x => x.id !== playerId);
        const newState = {
            ...gameState,
            players: newPlayerList
        };
        setGameState(newState);
    }
    
    const handleHostTransferred = (playerId: number) => {
        const newState = {
            ...gameState,
            hostId: playerId,
        }
        setGameState(newState);
    }
    
    const pollingRef = useRef<ReturnType<typeof setInterval>>(null);

    useEffect(() => {
        const startPolling = () => {
            pollingRef.current = setInterval(async () => {
                await UpdateGameState();
            }, 3000);
        };
        
        const setLocalStorage = () => {
            sessionStorage.setItem('game-id', `${gameState.id}`)
            sessionStorage.setItem('player-id', `${playerId}`)
        }
        
        startPolling();
        setLocalStorage();
        
        return () => {
            clearInterval(pollingRef.current as NodeJS.Timeout);
        }
    });

    return (
        <div>
            {gameState.gameStarted ? (
                <RunningGameView gameState={gameState} playerId={playerId} knownNumbers={knownNumbers} setGameState={setGameState}/>
            ) : (
                <GameLobbyView 
                    gameState={gameState} 
                    playerId={playerId} 
                    setGameState={setGameState} 
                    setKnownNumbers={setKnownNumbers} 
                    handleSettingsUpdated={UpdateGameState} 
                    handlePlayerKicked={handlePlayerKicked}
                    handleHostTransferred={handleHostTransferred}/>
            )}
        </div>
    );
}

export default GameView;