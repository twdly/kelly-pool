import {useRef, useState} from 'react';

import './CreateGame.css'

interface CreateGameProps {
    handleCancel: () => void,
    handleCreateGame: (playerName:string, gameName: string, mode: number, includeWhiteBall: boolean, maxPlayers: number) => Promise<void>,
    handleErrorMessage: (error: string) => void,
}

interface Mode {
    displayName: string,
    value: number,
}

const CreateGame = ({handleCancel, handleCreateGame, handleErrorMessage}: CreateGameProps) => {
    const [gameName, setGameName] = useState<string>('');
    const [playerName, setPlayerName] = useState<string>('');
    const [mode, setMode] = useState<number>(0);
    const [includeWhiteBall, setIncludeWhiteBall] = useState<boolean>(false);
    const playerCountRef = useRef<number>(2);
    
    const playerCounts: number[] = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];
    const modes: Mode[] = [{displayName: "One other", value: 0}, {displayName: "Yourself", value: 1}, {displayName: "Everyone else", value: 2}, {displayName: "Everyone", value: 3}];
    
    const createGame = () => {
        handleCreateGame(playerName, gameName, mode, includeWhiteBall, playerCountRef.current)
            .catch(() => handleErrorMessage("Game could not be created"));
    }
    
    return (
        <>
            <button onClick={handleCancel}>Cancel</button>

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
                <select name={'maxPlayers'} defaultValue={2}>
                    {playerCounts.map(n => {
                        return (<option key={n} onClick={() => (playerCountRef.current = n)}>{n}</option>)
                    })}
                </select>
            </div>
            
            <div className={"input-line"}>
                <label className={'inline'} htmlFor={'includeWhiteBall'}>Include white ball: </label>
                <input type={'checkbox'} checked={includeWhiteBall} onClick={() => setIncludeWhiteBall(!includeWhiteBall)}/>
            </div>
            
            <div className={"input-line"}>
                <label htmlFor={'modes'}>Known numbers: </label>
                <select name={'modes'}>
                    {modes.map(m => {
                        return (<option key={m.value} onClick={() => setMode(m.value)}>{m.displayName}</option>)
                    })}
                </select>
            </div>
            
            <button onClick={createGame}>Create game</button>
        </>
    );
}

export default CreateGame;