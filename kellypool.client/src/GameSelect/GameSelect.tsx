import {useEffect, useRef, useState } from 'react';
import '../App.css';
import './GameSelect.css'
import GameSelectModel from "../models/GameSelectModel.ts";
import JoinGameModel from "../models/JoinGameModel.ts";
import Player from "../models/Player.ts";
import JoinGameResponseModel from "../models/JoinGameResponseModel.ts";

interface CreateGameModel {
    name: string,
    maxPlayers: number,
    host: Player,
}

interface GameSelectProps {
    HandleGameSet: Function,
    HandlePlayerIdSet: Function,
}

function GameSelect({HandleGameSet, HandlePlayerIdSet}: GameSelectProps) {

    const [gamesList, setGamesList] = useState<GameSelectModel[]>([]);
    const [gameName, setGameName] = useState<string>('');
    const [playerName, setPlayerName] = useState<string>('');
    const [errorMessage, setErrorMessage] = useState<string>('');

    useEffect(() => {
        getGames();
    }, []);

    const pollingRef = useRef<ReturnType<typeof setInterval>>(null);

    useEffect(() => {
        const startPolling = () => {
            pollingRef.current = setInterval(async () => {
                await getGames();
            }, 3000);
        };
        startPolling();

        return () => {
            clearInterval(pollingRef.current as NodeJS.Timeout);
        }
    }, []);

    async function createGame(maxPlayers: number) {
        const uri = "management/create-game";
        
        const host: Player = {
            id: 0,
            name: playerName,
        }
        
        const newGame: CreateGameModel = {
            name: gameName,
            maxPlayers: maxPlayers,
            host: host,
        }

        const response = await fetch(uri, {
            method: 'POST',
            body: JSON.stringify(newGame),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
        });

        if (response.ok) {
            const result = await response.json();
            HandleGameSet(result);
            HandlePlayerIdSet(0); // First player to join a game always has an ID of 0
        }
    }

    async function getGames() {
        const response = await fetch('management/get-games');
        if (response.ok) {
            const data = await response.json();
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
            setErrorMessage("Game has already started");
            setInterval(() => {
                setErrorMessage("");
            }, 5000);
        }
    }
    
    return (
        <div>
            {gamesList.length == 0 ? (
                <p>No games found</p>
            ) : (
                gamesList.map((x) => {
                    return (
                        <div key={x.id}>
                            <p>{x.name}, Players: {x.currentPlayers}/{x.maxPlayers}{x.gameStarted ? " (in progress)" : ""}</p>
                            <button disabled={x.currentPlayers === x.maxPlayers || playerName.trim().length === 0 || x.gameStarted}
                                    onClick={() => JoinGame(x.id)}>Join
                            </button>
                        </div>
                    )
                })
            )}
            <label htmlFor={'playerName'}>Name:</label>
            <input name='playerName' type='text' value={playerName} onChange={(e => setPlayerName(e.target.value))}/>
            <hr/>
            <label htmlFor={'gameName'}>Game Name:</label>
            <input name='gameName' type='text' value={gameName} onChange={(e) => setGameName(e.target.value)}/>
            <br/>
            <button onClick={() => createGame(8)}>Create game</button>
            <p className={'error'}>{errorMessage}</p>
        </div>
    );
}

export default GameSelect;