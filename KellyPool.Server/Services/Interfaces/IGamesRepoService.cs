using KellyPool.Server.Models;

namespace KellyPool.Server.Services.Interfaces;

public interface IGamesRepoService
{
    List<GameSelectModel> GetAllGames();
    GameStateModel CreateGame(GameConfigModel gameConfig);
    JoinGameResponseModel JoinGame(JoinGameModel joinGameModel);
    bool LeaveGame(LeaveGameModel leaveModel);
    void InitialiseGame(int id);
    GameStateResponseModel GetStateForPlayer(int gameId, int playerId);
    void EndTurn(SunkNumbersModel turnModel);
    bool EditConfig(EditConfigModel config);
    bool KickPlayer(TargetPlayerModel targetPlayerModel);
    bool GiveHost(TargetPlayerModel targetPlayerModel);
    void SinkBalls(SunkNumbersModel sunkBallsModel);
}