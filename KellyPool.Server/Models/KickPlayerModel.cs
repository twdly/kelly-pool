namespace KellyPool.Server.Models;

public class KickPlayerModel
{
    public int HostId { get; set; }
    public int GameId { get; set; }
    public int KickedPlayerId { get; set; }
}