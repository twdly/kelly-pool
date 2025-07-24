namespace KellyPool.Server.Models;

public class SunkNumbersModel
{
    public int[] SunkNumbers { get; set; } = [];
    public int GameId { get; set; }
    public int PlayerId { get; set; }
}