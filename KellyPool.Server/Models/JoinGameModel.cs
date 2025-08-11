namespace KellyPool.Server.Models;

public class JoinGameModel
{
    public int GameId { get; set; }
    public required string PlayerName { get; set; }
}