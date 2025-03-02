namespace KellyPool.Server.Models;

public class GameStateModel(int id, string name, List<Player> players, int maxPlayers = 16)
{
    public int Id { get; set; } = id;
    public string Name { get; set; } = name;
    public List<Player> Players { get; set; } = players;
    public List<Player> RemainingPlayers { get; set; } = [];
    public int MaxPlayers { get; set; } = maxPlayers;
    public int HostId { get; private set; }
    public bool GameStarted { get; set; }
    public int TurnPlayerId { get; set; } // The ID of the player whose turn it currently is
    public bool GameFinished { get; set; }
    
    public List<int> RemainingNumbers { get; set; } = [];

    public int CurrentPlayers => Players.Count;
    public int NextPlayerId => Players.Max(x => x.Id) + 1;

    public void SelectNewHost()
    {
        if (Players.Count == 0) return;
        var newHostId = Players.Min(x => x.Id);
        HostId = newHostId;
    }
}