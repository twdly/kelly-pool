using KellyPool.Server.Models;

namespace KellyPool.Server.Services.Interfaces;

public interface IGamesRepoService
{
    public GameStateModel GetGameById(int id);
    public List<GameSelectModel> GetAllGames();
    public GameStateModel CreateGame(string name, int maxPlayers);
    public GameStateModel JoinGame(int id, string name);
}