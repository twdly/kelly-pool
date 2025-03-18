using KellyPool.Server.Models;
using KellyPool.Server.Services.Interfaces;

namespace KellyPool.Server.Services;

public class GamesRepoService : IGamesRepoService
{
    private List<GameStateModel> Games { get; } = [];

    private delegate void SetKnownIds(List<Player> players, Player currentPlayer);

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
        var newGame = new GameStateModel(gameId, gameModel.Name, [gameModel.Host], gameModel.Mode, 
            gameModel.IncludeWhiteBall, gameModel.RepeatNumbers, gameModel.MaxPlayers);
        Games.Add(newGame);
        return newGame;
    }

    public JoinGameResponseModel JoinGame(JoinGameModel joinGameModel)
    {
        var selectedGame = GetGameById(joinGameModel.GameId);
        if (selectedGame.GameStarted) throw new Exception("Game already started");  
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
        var maxNumber = selectedGame.IncludeWhiteBall ? 16 : 15;
        selectedGame.GameStarted = true;
        selectedGame.RemainingNumbers = Enumerable.Range(1, maxNumber).ToList();
        selectedGame.RemainingPlayers = [];
        selectedGame.RemainingPlayers.AddRange(selectedGame.Players);
        AssignNumbers(selectedGame.Players, maxNumber, selectedGame.RepeatNumbers);
        SetKnownNumbers(selectedGame.GameMode, selectedGame.Players);
        SelectFirstTurn(selectedGame);
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

    public void EndTurn(EndTurnModel turnModel)
    {
        var selectedGame = GetGameById(turnModel.GameId);
        
        selectedGame.RemainingNumbers.RemoveAll(num => turnModel.SunkNumbers.Contains(num));
        selectedGame.RemainingPlayers.RemoveAll(p => turnModel.SunkNumbers.Contains(p.BallNumber));
        
        var gameFinished = selectedGame.RemainingPlayers.Count <= 1;
        selectedGame.GameFinished = gameFinished;
        selectedGame.GameStarted = !gameFinished;

        if (!gameFinished)
        {
            selectedGame.TurnPlayerId = SelectNextPlayer(selectedGame, turnModel.PlayerId);
        }
    }

    private static int SelectNextPlayer(GameStateModel selectedGame, int playerId)
    {
        var players = selectedGame.Players;
        var remainingPlayers = selectedGame.RemainingPlayers;

        if (players.Count <= 1) return -1;

        var currentIndex = players.FindIndex(p => p.Id == playerId);

        var foundId = -1;
        
        while (foundId == -1)
        {
            currentIndex += 1;
            if (currentIndex == players.Count) currentIndex = 0;
            var player = players[currentIndex];
            if (remainingPlayers.Contains(player)) foundId = player.Id;
        }

        return foundId;
    }

    private static void AssignNumbers(List<Player> players, int maxNumber, bool repeatNumbers)
    {
        var random = new Random();
        var numbers = Enumerable.Range(1, maxNumber).ToList();
        foreach (var player in players)
        {
            var numberIndex = random.Next(numbers.Count);
            player.BallNumber = numbers[numberIndex];
            if (!repeatNumbers)
            {
                numbers.RemoveAt(numberIndex);
            }
        }
    }

    private static void SetKnownNumbers(Mode mode, List<Player> players)
    {
        SetKnownIds assignNumbers = mode switch
        {
            Mode.Everyone => SetKnownToEveryone,
            Mode.Yourself => SetKnownToYourself,
            Mode.EveryoneElse => SetKnownToEveryoneElse,
            Mode.OneOther => SetKnownToOneOther,
            _ => SetKnownToYourself
        };
        foreach (var player in players)
        {
            assignNumbers(players, player);
        }
    }

    private static void SetKnownToEveryone(List<Player> players, Player currentPlayer)
    {
        currentPlayer.KnownPlayerIds = players.Select(p => p.Id).ToList();
    }

    private static void SetKnownToYourself(List<Player> players, Player currentPlayer)
    {
        currentPlayer.KnownPlayerIds = [currentPlayer.Id];
    }
    
    private static void SetKnownToEveryoneElse(List<Player> players, Player currentPlayer)
    {
        currentPlayer.KnownPlayerIds = players.Where(p => p.Id != currentPlayer.Id).Select(p => p.Id).ToList();
    }
    
    private static void SetKnownToOneOther(List<Player> players, Player currentPlayer)
    {
        currentPlayer.KnownPlayerIds = [GetNextPlayerId(players, currentPlayer.Id)];
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
    
    private static void SelectFirstTurn(GameStateModel gameState)
    {
        var random = new Random();
        var selectedIndex = random.Next(gameState.Players.Count);
        gameState.TurnPlayerId = gameState.Players[selectedIndex].Id;
    }
}