namespace KellyPool.Server.Models;

public class EndTurnModel
{
    public int[] SunkNumbers { get; set; } = [];
    public int GameId { get; set; }
    public int PlayerId { get; set; }
}