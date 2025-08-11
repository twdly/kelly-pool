namespace KellyPool.Server.Models;

public class EditConfigModel
{
    public int PlayerId { get; set; }
    public int GameId { get; set; }
    public required GameConfigModel Config { get; set; }
}