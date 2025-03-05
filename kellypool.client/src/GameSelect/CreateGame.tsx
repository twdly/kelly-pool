import {useState} from 'react';

interface CreateGameProps {
    handleCancel: () => void,
    handleCreateGame: (playerName:string, gameName: string, maxPlayers: number) => Promise<void>,
    handleErrorMessage: (error: string) => void,
}

const CreateGame = ({handleCancel, handleCreateGame, handleErrorMessage}: CreateGameProps) => {
    const [gameName, setGameName] = useState<string>('');
    const [playerName, setPlayerName] = useState<string>('');
    
    const createGame = () => {
        handleCreateGame(playerName, gameName, 10)
            .catch(() => handleErrorMessage("Game could not be created"));
    }
    
    return (
        <>
            <button onClick={handleCancel}>Cancel</button>
            <br/>
            <label>Your Name:</label>
            <input name='playerName' type='text' value={playerName} onChange={(e) => setPlayerName(e.target.value)}/>
            
            <label htmlFor={'gameName'}>Game Name:</label>
            <input name='gameName' type='text' value={gameName} onChange={(e) => setGameName(e.target.value)}/>
            
            <button onClick={createGame}>Create game</button>
        </>
    );
}

export default CreateGame;