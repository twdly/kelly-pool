import {Dispatch, SetStateAction, useState} from 'react';

import './CreateGame.css'
import Player from "../models/Player.ts";
import GameConfigModel from "../models/GameConfigModel.ts";

interface CreateGameProps {
    handleCancel: () => void,
    handleCreateGame: (gameConfig: GameConfigModel) => Promise<void>,
    handleErrorMessage: (error: string) => void,
    playerName: string,
    setPlayerName: Dispatch<SetStateAction<string>>,
}

interface Mode {
    displayName: string,
    value: number,
}

const CreateGame = ({handleCancel, handleCreateGame, handleErrorMessage, playerName, setPlayerName}: CreateGameProps) => {
    const [gameName, setGameName] = useState<string>('');
    const [mode, setMode] = useState<number>(0);
    const [includeWhiteBall, setIncludeWhiteBall] = useState<boolean>(false);
    const [repeatNumbers, setRepeatNumbers] = useState<boolean>(false);
    const [playerCount, setPlayerCount] = useState<number>(2);
    const [gracePeriod, setGracePeriod] = useState<number>(0);
    
    const playerCounts: number[] = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];
    const modes: Mode[] = [{displayName: "One other", value: 0}, {displayName: "Yourself", value: 1}, {displayName: "Everyone else", value: 2}, {displayName: "Everyone", value: 3}];
    
    const createGame = () => {
        // First player to join a game always has an ID of 0
        const host: Player = {
            id: 0,
            name: playerName,
            wins: 0,
            ballsSunk: 0,
            turns: 0
        }

        const config: GameConfigModel = {
            gameName: gameName,
            maxPlayers: playerCount,
            host: host,
            mode: mode,
            includeWhiteBall: includeWhiteBall,
            repeatNumbers: repeatNumbers,
            gracePeriod: gracePeriod,
        }
        
        handleCreateGame(config)
            .catch(() => handleErrorMessage("Game could not be created"));
    }
    
    const isCreateButtonDisabled = () => {
        const namesEmpty = playerName.trim().length === 0 || gameName.trim().length === 0;
        const notEnoughNumbers = !includeWhiteBall && !repeatNumbers && playerCount === 16;
        return notEnoughNumbers || namesEmpty;
    }
    
    return (
        <>
            <h2 className={'heading'}>New game</h2>
            <div className={"input-line"}>
                <label>Your Name:</label>
                <input name='playerName' type='text' value={playerName}
                       onChange={(e) => setPlayerName(e.target.value)}/>
            </div>

            <div className={"input-line"}>
                <label htmlFor={'gameName'}>Game Name:</label>
                <input name='gameName' type='text' value={gameName} onChange={(e) => setGameName(e.target.value)}/>
            </div>

            <div className={"input-line"}>
                <label className={'inline'} htmlFor={'maxPlayers'}>Max players:</label>
                <select name={'maxPlayers'} defaultValue={2} value={playerCount}
                        onChange={event => setPlayerCount(parseInt(event.target.value))}>
                    {playerCounts.map(n => {
                        return (<option key={n} value={n}>{n}</option>)
                    })}
                </select>
            </div>
            
            <div className={"input-line"}>
                <label className={'inline'} htmlFor={'gracePeriod'}>Grace period:</label>
                <select name={'gracePeriod'} defaultValue={0} value={gracePeriod} onChange={event => setGracePeriod(parseInt(event.target.value))}>
                    <option>0</option>
                    <option>1</option>
                    <option>2</option>
                </select>
            </div>

            <div className={"input-line"}>
                <label className={'inline'} htmlFor={'includeWhiteBall'}>Include white ball: </label>
                <input name='includeWhiteBall' type={'checkbox'} checked={includeWhiteBall}
                       onChange={() => setIncludeWhiteBall(!includeWhiteBall)}/>
            </div>

            <div className={"input-line"}>
                <label className={'inline'} htmlFor={'repeatNumbers'}>Repeat numbers: </label>
                <input name='repeatNumbers' type={'checkbox'} checked={repeatNumbers}
                       onChange={() => setRepeatNumbers(!repeatNumbers)}/>
            </div>

            <div className={"input-line"}>
                <label htmlFor={'modes'}>Known numbers: </label>
                <select name={'modes'} value={mode} onChange={mode => setMode(parseInt(mode.target.value))}>
                    {modes.map(m => {
                        return (<option key={m.value} value={m.value}>{m.displayName}</option>)
                    })}
                </select>
            </div>
            <div className={'input-buttons'}>
                <button onClick={handleCancel}>Cancel</button>
                <button onClick={createGame} disabled={isCreateButtonDisabled()}>Create game</button>
            </div>
        </>
    );
}

export default CreateGame;