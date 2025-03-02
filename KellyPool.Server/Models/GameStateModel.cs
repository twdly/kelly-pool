using System.Text.Json.Serialization;

namespace KellyPool.Server.Models;

public class GameStateModel(int id, string name, List<Player> players, int maxPlayers = 16)
{
    public int Id { get; set; } = id;
    public string Name { get; set; } = name;
    public List<Player> Players { get; set; } = players;
    public int MaxPlayers { get; set; } = maxPlayers;
    public int HostId { get; private set; }
    public bool GameStarted { get; set; }
    
    public List<int> RemainingNumbers { get; set; } = [];

    public int CurrentPlayers => Players.Count;
    public int NextPlayerId => Players.Max(x => x.Id) + 1;

    public void SelectNewHost()
    {
        var newHostId = Players.Min(x => x.Id);
        HostId = newHostId;
    }
}