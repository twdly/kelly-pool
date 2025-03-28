namespace KellyPool.Server.Models;

public class GameSelectModel(GameStateModel stateModel)
{
    public int Id { get; set; } = stateModel.Id;
    public string Name { get; set; } = stateModel.Config.GameName;
    public int CurrentPlayers { get; set; } = stateModel.CurrentPlayers;
    public int MaxPlayers { get; set; } = stateModel.Config.MaxPlayers;
    public bool GameStarted { get; set; } = stateModel.GameStarted;
    public GameConfigModel Config { get; set; } = stateModel.Config;
}