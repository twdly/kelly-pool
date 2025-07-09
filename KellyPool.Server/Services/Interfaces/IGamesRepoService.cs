using KellyPool.Server.Models;

namespace KellyPool.Server.Services.Interfaces;

public interface IGamesRepoService
{
    public GameStateModel GetGameById(int id);
    public List<GameSelectModel> GetAllGames();
    public GameStateModel CreateGame(GameConfigModel gameConfig);
    public JoinGameResponseModel JoinGame(JoinGameModel joinGameModel);
    public bool LeaveGame(LeaveGameModel leaveModel);
    public void InitialiseGame(int id);
    public GameStateResponseModel GetStateForPlayer(int gameId, int playerId);
    public void EndTurn(EndTurnModel turnModel);
    public bool EditConfig(EditConfigModel config);
    public bool KickPlayer(KickPlayerModel kickPlayerModel);
}