using KellyPool.Server.Models;

namespace KellyPool.Server.Services.Interfaces;

public interface IGamesRepoService
{
    public GameStateModel GetGameById(int id);
    public List<GameSelectModel> GetAllGames();
    public GameStateModel CreateGame(CreateGameModel gameModel);
    public JoinGameResponseModel JoinGame(JoinGameModel joinGameModel);
    public bool LeaveGame(LeaveGameModel leaveModel);
    public void InitialiseGame(int id);
    public GameStateResponseModel GetStateForPlayer(int gameId, int playerId);
    void EndTurn(EndTurnModel turnModel);
}