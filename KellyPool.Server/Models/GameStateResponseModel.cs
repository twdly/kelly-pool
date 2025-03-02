namespace KellyPool.Server.Models;

/// <summary>
/// A model representing the current game state for an individual player.
/// Each player knows a different set of numbers depending on the game config.
/// </summary>
public class GameStateResponseModel
{
    public GameStateModel GameState { get; set; }
    public List<PlayerNumber> KnownNumbers { get; set; } = [];
}