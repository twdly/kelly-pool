namespace KellyPool.Server.Models;

public class GameConfigModel
{
    public string GameName { get; set; }
    public int MaxPlayers { get; set; }
    public Player Host { get; set; }
    public Mode Mode { get; set; }
    public bool IncludeWhiteBall { get; set; }
    public bool RepeatNumbers { get; set; }
}