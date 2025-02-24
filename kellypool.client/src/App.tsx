import { useState } from 'react';
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
    
    return (
        <div>
            {games.length == 0 ? (
                <p>No games found</p>
            ) : (
                games.map((x) => {
                    return <p>{x.name}, max players: {x.maxPlayers}</p>
                })
            )}

            <button onClick={() => createGame("Test", 8)}>Create game</button>
        </div>
    );
    
    async function createGame(name: string,  maxPlayers: number) {
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
        }).then(response => response.json())
        
        // let request = new Request("management/create-game", {
        //     method: "POST",
        //     body: JSON.stringify(newGame),
        //     headers: {
        //         'Accept': 'application/json',
        //         'Content-Type': 'application/json'
        //     },
        // });
        // const response = await fetch(request);
        if (response.ok) {
            const result = await response.json();
            setGames(g => [...g, result]);
        }
    }
}

export default App;