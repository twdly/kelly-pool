using KellyPool.Server.Models;
using KellyPool.Server.Services.Interfaces;

namespace KellyPool.Server.Services;

public class GamesRepoService : IGamesRepoService
{
    public List<GameModel> Games { get; set; } = [];

    public GameModel? GetGameById(int id)
    {
        return Games.FirstOrDefault(x => x.Id == id);
    }

    public List<GameModel> GetAllGames()
    {
        return Games;
    }

    public GameModel CreateGame(string name, int maxPlayers)
    {
        var nextId = Games.Max(x => x.Id) + 1;
        var newGame = new GameModel(nextId, name, maxPlayers);
        return newGame;
    }
}