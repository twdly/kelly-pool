namespace KellyPool.Server.Models;

public class GameConfigModel
{
    public required string GameName { get; set; }
    public int MaxPlayers { get; set; }
    public required Player Host { get; set; }
    public Mode Mode { get; set; }
    public bool IncludeWhiteBall { get; set; }
    public bool RepeatNumbers { get; set; }
    public int GracePeriod { get; set; } = 0;
}