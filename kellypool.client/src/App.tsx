import {useEffect, useState } from 'react';
import './App.css';

interface Game {
    id: number,
    name: string,
    maxPlayers: number,
}

interface CreateGameModel {
    name: string,
    maxPlayers: number,
}

function App() {
    
    const [games, setGames] = useState<Game[]>([]);
    const [name, setName] = useState<string>('');

    useEffect(() => {
        getGames();
    }, []);
    
    return (
        <div>
            {games.length == 0 ? (
                <p>No games found</p>
            ) : (
                games.map((x) => {
                    return <p>{x.name}, max players: {x.maxPlayers}</p>
                })
            )}
            <input type='text' value={name} onChange={(e) => setName(e.target.value)}/>
            <button onClick={() => createGame(8)}>Create game</button>
            <button onClick={() => getGames()}>Get games</button>
        </div>
    );
    
    async function createGame(maxPlayers: number) {
        const uri = "management/create-game";
        const newGame: CreateGameModel = {
            name: name,
            maxPlayers: maxPlayers,
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
            setName('');
            setGames(g => [...g, result]);
        }
    }
    
    async function getGames() {
        const response = await fetch('management/get-games');
        if (response.ok) {
            const data = await response.json();
            setGames(data);
        }
    }
}

export default App;