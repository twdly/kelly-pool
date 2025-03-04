namespace KellyPool.Server.Models;

public class GameSelectModel(GameStateModel stateModel)
{
    public int Id { get; set; } = stateModel.Id;
    public string Name { get; set; } = stateModel.Name;
    public int CurrentPlayers { get; set; } = stateModel.CurrentPlayers;
    public int MaxPlayers { get; set; } = stateModel.MaxPlayers;
    public bool GameStarted { get; set; } = stateModel.GameStarted;
}