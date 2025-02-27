namespace KellyPool.Server.Models;

public class JoinGameResponseModel(GameStateModel gameState, int playerId)
{
    public GameStateModel GameState { get; set; } = gameState;
    public int PlayerId { get; set; } = playerId;
}