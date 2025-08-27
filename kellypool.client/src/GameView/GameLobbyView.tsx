import GameStateModel from "../models/GameStateModel.ts";
import StateRequestModel from "../models/StateRequestModel.ts";
import GameStateResponseModel from "../models/GameStateResponseModel.ts";
import GenericInteractionModel from "../models/GenericInteractionModel.ts";
import { useState } from "react";
import EditConfigModel from "../models/EditConfigModel.ts";
import TargetPlayerModel from "../models/TargetPlayerModel.ts";

import "./GameLobbyView.css"
import "../GameSelect/CreateGame.css"
import InfoPopover from "./InfoPopover.tsx";

interface GameLobbyViewProps {
    gameState: GameStateModel,
    playerId: number,
    setGameState: Function,
    setKnownNumbers: Function,
    handleSettingsUpdated: Function,
    handlePlayerKicked: Function,
    handleHostTransferred: Function,
}

interface Mode {
    displayName: string,
    value: number,
}

function GameLobbyView ({gameState, playerId, setGameState, setKnownNumbers, handleSettingsUpdated, handlePlayerKicked, handleHostTransferred}: GameLobbyViewProps) {
    const [editingSettings, setEditingSettings] = useState<boolean>();
    
    // Edit settings state
    const [gameName, setGameName] = useState<string>("");
    const [includeWhiteBall, setIncludeWhiteBall] = useState<boolean>(false);
    const [repeatNumbers, setRepeatNumbers] = useState<boolean>(false);
    const [mode, setMode] = useState<number>(0);
    const [playerCount, setPlayerCount] = useState<number>(0);
    const [possiblePlayerCounts, setPossiblePlayerCounts] = useState<number[]>([2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]);
    const [gracePeriod, setGracePeriod] = useState<number>(0);

    const modes: Mode[] = [{displayName: "One other", value: 0}, {displayName: "Yourself", value: 1}, {displayName: "Everyone else", value: 2}, {displayName: "Everyone", value: 3}];

    const beginGame = async () => {
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

    const handleLeave = async () => {
        const leaveUri = 'management/leave-game';

        const leaveModel: GenericInteractionModel = {
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
    
    const updateSettings = async () => {
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
                gracePeriod: gracePeriod,
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
        let currentPlayerCount = gameState.players.length == 1 ? 2 : gameState.players.length;
        let maxPlayers = gameState.config.includeWhiteBall || gameState.config.repeatNumbers ? 16 : 15;
        
        for (let i = currentPlayerCount; i <= maxPlayers; i++) {
            calculatedPlayerCounts.push(i);
        }
        return calculatedPlayerCounts;
    }
    
    const handleWhiteBallChecked = () => {
        const whiteBallChecked = !includeWhiteBall;
        const includeSixteen = whiteBallChecked || repeatNumbers;
        const sixteenAvailable = possiblePlayerCounts.filter(x => x === 16).length === 1;
        
        if (!includeSixteen && sixteenAvailable) {
            setPossiblePlayerCounts(possiblePlayerCounts.slice(0, -1));

            if (playerCount === 16) {
                setPlayerCount(15);
            }
            
        } else if (includeSixteen && !sixteenAvailable) {
            setPossiblePlayerCounts([...possiblePlayerCounts, 16]);
        }
        
        setIncludeWhiteBall(whiteBallChecked);
    }
    
    const handleRepeatNumbersChecked = () => {
        const repeatNumbersChecked = !repeatNumbers;
        const includeSixteen = includeWhiteBall || repeatNumbersChecked;
        const sixteenAvailable = possiblePlayerCounts.filter(x => x === 16).length === 1;

        if (!includeSixteen && sixteenAvailable) {
            setPossiblePlayerCounts(possiblePlayerCounts.slice(0, -1));

            if (playerCount === 16) {
                setPlayerCount(15);
            }
            
        } else if (includeSixteen && !sixteenAvailable) {
            setPossiblePlayerCounts([...possiblePlayerCounts, 16]);
        }

        setRepeatNumbers(repeatNumbersChecked);
    }
    
    const initialiseEditSettings = async () => {
        setGameName(gameState.config.gameName);
        setIncludeWhiteBall(gameState.config.includeWhiteBall);
        setRepeatNumbers(gameState.config.repeatNumbers);
        setMode(gameState.config.mode);
        setPlayerCount(gameState.config.maxPlayers);
        setGracePeriod(gameState.config.gracePeriod);
        
        setPossiblePlayerCounts(calculatePotentialPlayerCounts());
        
        setEditingSettings(true);
    }
    
    const handleKick = async (kickedPlayerId: number) => {
        const endpoint = 'management/kick-player';
        
        const kickPlayerModel: TargetPlayerModel = {
            hostId: playerId,
            gameId: gameState.id,
            targetPlayerId: kickedPlayerId
        };

        const response = await fetch(endpoint, {
            method: 'POST',
            body: JSON.stringify(kickPlayerModel),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
        });

        if (response.ok) {
            handlePlayerKicked(kickedPlayerId);
        } else {
            window.alert("Unable to kick player");
        }
    }
    
    const giveHost = async (newHostId: number) => {
        const endpoint = 'management/give-host';
        
        const targetPlayerModel: TargetPlayerModel = {
            hostId: playerId,
            gameId: gameState.id,
            targetPlayerId: newHostId
        };

        const response = await fetch(endpoint, {
            method: 'POST',
            body: JSON.stringify(targetPlayerModel),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
        });
        
        if (response.ok)  {
            handleHostTransferred(newHostId);
        } else {
            window.alert("Unable to transfer host");
        }
    }
    
    return (
        <>
            {editingSettings ? (
                <div className={"settings-menu"}>
                    <h2 className={'heading'}>Edit settings</h2>
                    <div className={"input-line"}>
                        <label className={"inline"} htmlFor={"name"}>Game name:</label>
                        <input name={"name"} value={gameName} onChange={event => setGameName(event.target.value)}/>
                    </div>
                    <div className={"input-line"}>
                        <label className={"inline"} htmlFor={"repeat"}>Repeat numbers:</label>
                        <input type={"checkbox"} name={"repeat"} checked={repeatNumbers}
                               onChange={handleRepeatNumbersChecked}/>
                    </div>
                    <div className={"input-line"}>
                        <label className={"inline"} htmlFor={"whiteBall"}>Include white ball:</label>
                        <input type={"checkbox"} name={"whiteBall"} checked={includeWhiteBall}
                               onChange={handleWhiteBallChecked}/>
                    </div>
                    <div className={"input-line"}>
                        <label className={"inline"} htmlFor={"knownNumbers"}>Known numbers:</label>
                        <select name={"knownNumbers"} value={mode}
                                onChange={mode => setMode(parseInt(mode.target.value))}>
                            {modes.map(m => {
                                return (<option key={m.value} value={m.value}>{m.displayName}</option>)
                            })}
                        </select>
                    </div>
                    <div className={"input-line"}>
                        <label className={"inline"} htmlFor={"gracePeriod"}>Grace period:</label>
                        <select name={"gracePeriod"} value={gracePeriod}
                                onChange={mode => setGracePeriod(parseInt(mode.target.value))}>
                            <option>0</option>
                            <option>1</option>
                            <option>2</option>
                        </select>
                    </div>
                    <div className={"input-line"}>
                        <label className={"inline"} htmlFor={"playerCount"}>Players:</label>
                        <select name={"playerCount"} value={playerCount}
                                onChange={players => setPlayerCount(parseInt(players.target.value))}>
                            {possiblePlayerCounts.map(m => {
                                return (<option key={m} value={m}>{m}</option>)
                            })}
                        </select>
                    </div>

                    <button onClick={() => updateSettings()}>Save</button>
                    <button onClick={() => setEditingSettings(false)}>Cancel</button>
                </div>
            ) : (
                <div>
                    <h1>{gameState.config.gameName}</h1>
                    {gameState.gameFinished && (
                        <h3>The winner is: {gameState.winner != null ? `${gameState.winner.name}` : "nobody :("}</h3>
                    )}
                    <h2>Players:</h2>
                    <h3>{gameState.players.length} / {gameState.config.maxPlayers}</h3>
                    {gameState.players.map((x) => {
                        return (
                            <div key={x.id} className={"player-row"}>
                                <p>{x.name}</p>
                                
                                <button className={'info-button'} popoverTarget={`info-popover-${x.id}`}>Info</button>

                                <InfoPopover player={x} hostId={gameState.hostId} currentPlayerId={playerId} handleKick={handleKick} giveHost={giveHost}/>
                            </div>
                        )
                    })}
                    {gameState.hostId === playerId && (
                        <>
                            <button disabled={gameState.players.length == 1} onClick={beginGame}>Start game</button>
                            <button onClick={initialiseEditSettings}>Edit settings</button>
                        </>
                    )}
                    <button popoverTarget={'leaderboard-popover'}>Leaderboard</button>
                    <button onClick={handleLeave}>Leave game</button>
                    <div popover={'auto'} id={'leaderboard-popover'}>
                        <p>Leaderboard:</p>
                        {gameState.players.sort((a, b) => {return b.wins - a.wins}).map(p => {
                            return (
                                <p>{p.name} - {p.wins} win(s)</p>
                            )
                        })}
                    </div>
                </div>
            )}
        </>
    );
}

export default GameLobbyView;