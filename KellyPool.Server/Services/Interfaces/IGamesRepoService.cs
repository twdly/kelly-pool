using KellyPool.Server.Models;

namespace KellyPool.Server.Services.Interfaces;

public interface IGamesRepoService
{
    public GameModel? GetGameById(int id);
    public List<GameModel> GetAllGames();
    public GameModel CreateGame(string name, int maxPlayers);
}