namespace KellyPool.Server.Models;

public class GameModel(int id, string name, int maxPlayers = 16)
{
    public int Id { get; set; } = id;
    public string Name { get; set; } = name;
    public int MaxPlayers { get; set; } = maxPlayers;
}