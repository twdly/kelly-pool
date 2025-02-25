import GameStateModel from "../models/GameStateModel.ts";

interface GameViewProps {
    GameState: GameStateModel,
}

function GameView({GameState}: GameViewProps) {
    return (
        <div>
            <h1>{GameState.name}</h1>
            <h2>Players:</h2>
            {GameState.players.map((x) => {
                return (
                    <div key={GameState.players.indexOf(x).toString()}>
                        <p>{x.name}</p>
                    </div>
                )
            })}
        </div>
    );
}

export default GameView;