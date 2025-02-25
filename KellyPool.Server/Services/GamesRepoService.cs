using KellyPool.Server.Models;
using KellyPool.Server.Services.Interfaces;

namespace KellyPool.Server.Services;

public class GamesRepoService : IGamesRepoService
{
    private List<GameStateModel> Games { get; } = [new GameStateModel(92, "Test Game", [new Player("Tai"), new Player("Josh")], 10)];

    public GameStateModel GetGameById(int id)
    {
        var game = Games.FirstOrDefault(x => x.Id == id);
        if (game == null)
        {
            throw new Exception("Invalid ID");
        }
        return game;
    }

    public List<GameSelectModel> GetAllGames()
    {
        return Games.Select(game => new GameSelectModel(game)).ToList();
    }

    public GameStateModel CreateGame(CreateGameModel gameModel)
    {
        var nextId = Games.Max(x => x.Id) + 1;
        var newGame = new GameStateModel(nextId, gameModel.Name, [gameModel.Host], gameModel.MaxPlayers);
        Games.Add(newGame);
        return newGame;
    }

    public GameStateModel JoinGame(int id, string name)
    {
        var selectedGame = GetGameById(id);
        selectedGame.Players.Add(new Player(name));
        return selectedGame;
    }
}