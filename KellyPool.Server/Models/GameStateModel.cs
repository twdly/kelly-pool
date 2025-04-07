namespace KellyPool.Server.Models;

public class GameStateModel(int id, GameConfigModel configModel)
{
    public int Id { get; set; } = id;
    public List<Player> Players { get; set; } = [configModel.Host];
    public List<Player> RemainingPlayers { get; set; } = [];
    public int HostId { get; private set; }
    public bool GameStarted { get; set; }
    public int TurnPlayerId { get; set; } // The ID of the player whose turn it currently is
    public bool GameFinished { get; set; }
    public Player? Winner { get; set; } 
    public GameConfigModel Config { get; set; } = configModel;
    
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