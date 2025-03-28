import {Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import '../App.css';
import './GameSelect.css'
import GameSelectModel from "../models/GameSelectModel.ts";
import JoinGameModel from "../models/JoinGameModel.ts";
import JoinGameResponseModel from "../models/JoinGameResponseModel.ts";
import CreateGame from "./CreateGame.tsx";
import GameStateModel from "../models/GameStateModel.ts";
import gameConfigModel from "../models/GameConfigModel.ts";
import GamesList from "./GamesList.tsx";

interface GameSelectProps {
    HandleGameSet: Dispatch<SetStateAction<GameStateModel | undefined>>,
    HandlePlayerIdSet: Dispatch<SetStateAction<number>>,
}

function GameSelect({HandleGameSet, HandlePlayerIdSet}: GameSelectProps) {

    const [gamesList, setGamesList] = useState<GameSelectModel[]>([]);
    const [playerName, setPlayerName] = useState<string>('');
    const [errorMessage, setErrorMessage] = useState<string>('');
    const [isCreatingGame, setIsCreatingGame] = useState<boolean>(false);

    useEffect(() => {
        getGames();
    }, []);

    const pollingRef = useRef<number>(undefined);

    useEffect(() => {
        const startPolling = () => {
            pollingRef.current = window.setInterval(async () => {
                await getGames();
            }, 3000);
        };
        startPolling();

        return () => {
            window.clearInterval(pollingRef.current);
        }
    }, []);

    async function createGame(gameConfig: gameConfigModel) {
        const uri = "management/create-game";

        const response = await fetch(uri, {
            method: 'POST',
            body: JSON.stringify(gameConfig),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
        });

        if (response.ok) {
            const result = await response.json();
            HandleGameSet(result);
            HandlePlayerIdSet(gameConfig.host.id);
        }
    }
    
    const cancelCreateGame = () => {
        setIsCreatingGame(false);
    }

    async function getGames() {
        const response = await fetch('management/get-games');
        if (response.ok) {
            const data: GameSelectModel[] = await response.json();
            setGamesList(data);
        }
    }
    
    async function JoinGame(id: number) {
        const uri = "management/join-game";
        
        const body: JoinGameModel = {
            gameId: id,
            playerName: playerName,
        }
        
        const response = await fetch(uri, {
            method: 'POST',
            body: JSON.stringify(body),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
        });
        
        if (response.ok) {
            const result: JoinGameResponseModel = await response.json();
            HandleGameSet(result.gameState);
            HandlePlayerIdSet(result.playerId);
        } else {
            showErrorMessage("Game has already started")
        }
    }
    
    const showErrorMessage = (error: string) => {
        setErrorMessage(error);
        setInterval(() => {
            setErrorMessage("");
        }, 5000);
    }
    
    return (
        <div>
            {isCreatingGame ? (
                <CreateGame handleCancel={cancelCreateGame} handleCreateGame={createGame} handleErrorMessage={showErrorMessage}/>
            ) : (
                <div>
                    <GamesList gamesList={gamesList} playerName={playerName} joinGame={JoinGame}/>
                    <div className={'player-name-input'}>
                        <label htmlFor={'playerName'}>Name:</label>
                        <input name='playerName' type='text' value={playerName}
                               onChange={(e => setPlayerName(e.target.value))}/>
                    </div>
                    <div className={'create-game'}>
                        <button onClick={() => setIsCreatingGame(true)}>New game</button>
                    </div>
                </div>
            )}
            <p className={'error'}>{errorMessage}</p>
        </div>
    );
}

export default GameSelect;