namespace KellyPool.Server.Models;

public class GameStateModel(int id, string name, List<Player> players, int maxPlayers = 16)
{
    public int Id { get; set; } = id;
    public string Name { get; set; } = name;
    public List<Player> Players { get; set; } = players;
    public int MaxPlayers { get; set; } = maxPlayers;
    public int CurrentPlayers => Players.Count;

    public int NextPlayerId => players.Max(x => x.Id) + 1;
}