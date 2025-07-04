import GameStateModel from "../models/GameStateModel.ts";
import StateRequestModel from "../models/StateRequestModel.ts";
import GameStateResponseModel from "../models/GameStateResponseModel.ts";
import LeaveGameModel from "../models/LeaveGameModel.ts";
import { useState } from "react";
import EditConfigModel from "../models/EditConfigModel.ts";

interface GameLobbyViewProps {
    gameState: GameStateModel,
    playerId: number,
    setGameState: Function,
    setKnownNumbers: Function,
    handleSettingsUpdated: Function,
}

interface Mode {
    displayName: string,
    value: number,
}

function GameLobbyView ({gameState, playerId, setGameState, setKnownNumbers, handleSettingsUpdated}: GameLobbyViewProps) {
    const showWins: boolean = gameState.players.filter((x) => x.wins != 0).length != 0;
    const [editingSettings, setEditingSettings] = useState<boolean>();
    
    // Edit settings state
    const [gameName, setGameName] = useState<string>("");
    const [includeWhiteBall, setIncludeWhiteBall] = useState<boolean>(false);
    const [repeatNumbers, setRepeatNumbers] = useState<boolean>(false);
    const [mode, setMode] = useState<number>(0);
    const [playerCount, setPlayerCount] = useState<number>(0);
    const [possiblePlayerCounts, setPossiblePlayerCounts] = useState<number[]>([2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]);

    const modes: Mode[] = [{displayName: "One other", value: 0}, {displayName: "Yourself", value: 1}, {displayName: "Everyone else", value: 2}, {displayName: "Everyone", value: 3}];

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
    
    const UpdateSettings = async () => {
        const endpoint = 'management/edit-config';
        
        const newConfig: EditConfigModel = {
            playerId: playerId,
            gameId: gameState.id,
            config: {
                gameName: gameName,
                host: gameState.config.host,
                mode: mode,
                includeWhiteBall: includeWhiteBall,
                repeatNumbers: repeatNumbers,
                maxPlayers: playerCount,
            }
        };

        const response = await fetch(endpoint, {
            method: 'POST',
            body: JSON.stringify(newConfig),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
        });
        
        if (response.ok) {
            setEditingSettings(false); 
            handleSettingsUpdated();
        } else {
            window.alert("Something went wrong");
        }
    }
    
    const calculatePotentialPlayerCounts = () => {
        let calculatedPlayerCounts: number[] = [];
        let currentPlayerCount = gameState.players.length;
        let maxPlayers = gameState.config.includeWhiteBall || gameState.config.repeatNumbers ? 16 : 15;
        
        for (let i = currentPlayerCount; i <= maxPlayers; i++) {
            calculatedPlayerCounts.push(i);
        }
        return calculatedPlayerCounts;
    }
    
    const initialiseEditSettings = async () => {
        setGameName(gameState.config.gameName);
        setIncludeWhiteBall(gameState.config.includeWhiteBall);
        setRepeatNumbers(gameState.config.repeatNumbers);
        setMode(gameState.config.mode);
        setPlayerCount(gameState.config.maxPlayers);
        
        setPossiblePlayerCounts(calculatePotentialPlayerCounts());
        
        setEditingSettings(true);
    }
    
    return (
        <>
            {editingSettings ? (
                <>
                    <div>
                        <label htmlFor={"name"}>Game name:</label>
                        <input name={"name"} value={gameName} onChange={event => setGameName(event.target.value)}/>
                    </div>
                    <div>
                        <label htmlFor={"repeat"}>Repeat numbers:</label>
                        <input type={"checkbox"} name={"repeat"} checked={repeatNumbers} onChange={() => setRepeatNumbers(!repeatNumbers)}/>
                    </div>
                    <div>
                        <label htmlFor={"whiteBall"}>Include white ball:</label>
                        <input type={"checkbox"} name={"whiteBall"} checked={includeWhiteBall} onChange={() => setIncludeWhiteBall(!includeWhiteBall)}/>
                    </div>
                    <div>
                        <label htmlFor={"knownNumbers"}>Known numbers:</label>
                        <select name={"knownNumbers"} value={mode} onChange={mode => setMode(parseInt(mode.target.value))}>
                            {modes.map(m => {
                                return (<option key={m.value} value={m.value}>{m.displayName}</option>)
                            })}
                        </select>
                    </div>
                    <div>
                        <label htmlFor={"playerCount"}>Players:</label>
                        <select name={"playerCount"} value={playerCount} onChange={players => setPlayerCount(parseInt(players.target.value))}>
                            {possiblePlayerCounts.map(m => {
                                return (<option key={m} value={m}>{m}</option>)
                            })}
                        </select>
                    </div>

                    <button onClick={() => UpdateSettings()}>Save</button>
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
                            <button onClick={initialiseEditSettings}>Edit settings</button>
                        </>
                    )}
                    <button onClick={HandleLeave}>Leave game</button>
                </div>
            )}
        </>


    );
}

export default GameLobbyView;