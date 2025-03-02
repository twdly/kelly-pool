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

    public void InitialiseGame(int id)
    {
        var selectedGame = GetGameById(id);
        selectedGame.GameStarted = true;
        selectedGame.RemainingNumbers = Enumerable.Range(1, 16).ToList();
        AssignNumbers(selectedGame.Players);
        SetKnownNumbers(selectedGame.Players);
    }

    public GameStateResponseModel GetStateForPlayer(int gameId, int playerId)
    {
        var selectedGame = GetGameById(gameId);

        if (!selectedGame.GameStarted)
        {
            return new GameStateResponseModel
            {
                GameState = selectedGame,
                KnownNumbers = [],
            };
        }
        
        var responseModel = new GameStateResponseModel
        {
            GameState = selectedGame
        };
        var currentPlayer = selectedGame.Players.First(x => x.Id == playerId);
        var knownPlayers = selectedGame.Players.Where(x => currentPlayer.KnownPlayerIds.Contains(x.Id));
        List<PlayerNumber> playerNumbers = [];
        playerNumbers.AddRange(knownPlayers.Select(knownPlayer => new PlayerNumber(knownPlayer)));
        responseModel.KnownNumbers = playerNumbers;
        return responseModel;
    }

    private static void AssignNumbers(List<Player> players)
    {
        var random = new Random();
        var numbers = Enumerable.Range(1, 16).ToList();
        foreach (var player in players)
        {
            var numberIndex = random.Next(numbers.Count + 1);
            player.BallNumber = numbers[numberIndex];
            numbers.RemoveAt(numberIndex);
        }
    }

    private static void SetKnownNumbers(List<Player> players)
    {
        foreach (var player in players)
        {
            player.KnownPlayerIds = [GetNextPlayerId(players, player.Id)];
        }
    }

    private static int GetNextPlayerId(List<Player> players, int currentId)
    {
        var currentIndex = players.FindIndex(x => x.Id == currentId);
        if (currentIndex == players.Count - 1)
        {
            currentIndex = 0;
        }
        else
        {
            currentIndex += 1;
        }

        return players[currentIndex].Id;
    }
}