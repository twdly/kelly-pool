import {useRef, useState} from 'react';

import './CreateGame.css'

interface CreateGameProps {
    handleCancel: () => void,
    handleCreateGame: (playerName:string, gameName: string, maxPlayers: number) => Promise<void>,
    handleErrorMessage: (error: string) => void,
}

const CreateGame = ({handleCancel, handleCreateGame, handleErrorMessage}: CreateGameProps) => {
    const [gameName, setGameName] = useState<string>('');
    const [playerName, setPlayerName] = useState<string>('');
    const [mode, setMode] = useState<string>('');
    const playerCountRef = useRef<number>(2);
    
    const playerCounts: number[] = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];
    const modes: string[] = ["One other", "Yourself", "Everyone else"];
    
    const createGame = () => {
        handleCreateGame(playerName, gameName, playerCountRef.current)
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
                <label htmlFor={'maxPlayers'}>Max players:</label>
                <select name={'maxPlayers'} defaultValue={2}>
                    {playerCounts.map(n => {
                        return (<option key={n} onClick={() => (playerCountRef.current = n)}>{n}</option>)
                    })}
                </select>
            </div>
            
            <div className={"input-line"}>
                <label htmlFor={'modes'}>Known numbers: </label>
                <select name={'modes'}>
                    <option onClick={() => setMode('')}>---</option>
                    {modes.map(m => {
                        return (<option key={m} onClick={() => setMode(m)}>{m}</option>)
                    })}
                </select>
            </div>
            
            <button onClick={createGame} disabled={mode===''}>Create game</button>
        </>
    );
}

export default CreateGame;