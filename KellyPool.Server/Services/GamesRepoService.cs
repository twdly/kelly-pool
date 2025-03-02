using KellyPool.Server.Models;
using KellyPool.Server.Services.Interfaces;

namespace KellyPool.Server.Services;

public class GamesRepoService : IGamesRepoService
{
    private List<GameStateModel> Games { get; } = [];

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
        var gameId = 0;
        if (Games.Count != 0)
        {
            gameId = Games.Max(x => x.Id) + 1;
        }
        var newGame = new GameStateModel(gameId, gameModel.Name, [gameModel.Host], gameModel.MaxPlayers);
        Games.Add(newGame);
        return newGame;
    }

    public JoinGameResponseModel JoinGame(JoinGameModel joinGameModel)
    {
        var selectedGame = GetGameById(joinGameModel.GameId);
        var playerId = selectedGame.NextPlayerId;
        selectedGame.Players.Add(new Player(playerId, joinGameModel.PlayerName));
        return new JoinGameResponseModel(selectedGame, playerId);
    }

    public bool LeaveGame(LeaveGameModel leaveModel)
    {
        var selectedGame = GetGameById(leaveModel.GameId);
        var leavingPlayer = selectedGame.Players.First(p => p.Id == leaveModel.PlayerId);
        var isSuccess = selectedGame.Players.Remove(leavingPlayer);

        if (selectedGame.Players.Count == 0)
        {
            Games.RemoveAll(g => g.Id == selectedGame.Id);
        }

        if (selectedGame.HostId == leavingPlayer.Id)
        {
            selectedGame.SelectNewHost();
        }
        
        return isSuccess;
    }

    public GameStateModel InitialiseGame(int id)
    {
        var selectedGame = GetGameById(id);
        selectedGame.GameStarted = true;
        selectedGame.RemainingNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];
        selectedGame.SunkNumbers = [];
        return selectedGame;
    }
}