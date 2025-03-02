namespace KellyPool.Server.Models;

public class PlayerNumber(Player player)
{
    public Player Player { get; set; } = player;
    public int Number { get; set; } = player.BallNumber;
}