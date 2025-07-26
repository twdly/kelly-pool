using KellyPool.Server.Models;
using KellyPool.Server.Services.Interfaces;

namespace KellyPool.Server.Services;

public class GamesRepoService : IGamesRepoService
{
    private List<GameStateModel> Games { get; } = [];

    private delegate void SetKnownIds(List<Player> players, Player currentPlayer);

    private GameStateModel GetGameById(int id)
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

    public GameStateModel CreateGame(GameConfigModel gameConfig)
    {
        var gameId = 0;
        if (Games.Count != 0)
        {
            gameId = Games.Max(x => x.Id) + 1;
        }
        var newGame = new GameStateModel(gameId, gameConfig);
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
        var maxNumber = selectedGame.Config.IncludeWhiteBall ? 16 : 15;
        
        selectedGame.GameStarted = true;
        selectedGame.RemainingNumbers = Enumerable.Range(1, maxNumber).ToList();
        selectedGame.RemainingPlayers = [];
        selectedGame.RemainingPlayers.AddRange(selectedGame.Players);
        selectedGame.Winner = null;
        selectedGame.RoundCount = 1;
        
        AssignNumbers(selectedGame.Players, maxNumber, selectedGame.Config.RepeatNumbers);
        SetKnownNumbers(selectedGame.Config.Mode, selectedGame.Players);
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

    public void EndTurn(SunkNumbersModel turnModel)
    {
        var selectedGame = GetGameById(turnModel.GameId);
        
        RemoveBallsAndPlayers(turnModel, selectedGame);

        var gameFinished = CheckGameFinished(selectedGame);

        if (!gameFinished)
        {
            selectedGame.TurnPlayerId = SelectNextPlayer(selectedGame, turnModel.PlayerId);
        }
    }
    
    public void SinkBalls(SunkNumbersModel sunkBallsModel)
    {
        var selectedGame = GetGameById(sunkBallsModel.GameId);
        var currentPlayer = selectedGame.Players.First(x => x.Id == sunkBallsModel.PlayerId);
        var ownBallSunk = sunkBallsModel.SunkNumbers.Contains(currentPlayer.BallNumber);
        
        RemoveBallsAndPlayers(sunkBallsModel, selectedGame);

        var gameFinished = CheckGameFinished(selectedGame);

        if (!gameFinished && ownBallSunk)
        {
            selectedGame.TurnPlayerId = SelectNextPlayer(selectedGame, sunkBallsModel.PlayerId);
        }
    }

    private static bool CheckGameFinished(GameStateModel selectedGame)
    {
        var gameFinished = selectedGame.RemainingPlayers.Count <= 1;
        
        if (selectedGame.RemainingPlayers.Count == 1)
        {
            var winner = selectedGame.RemainingPlayers.First();
            winner.Wins += 1;
            selectedGame.Winner = winner;
        }
        
        selectedGame.GameFinished = gameFinished;
        selectedGame.GameStarted = !gameFinished;

        return gameFinished;
    }

    private static void RemoveBallsAndPlayers(SunkNumbersModel sunkBallsModel, GameStateModel selectedGame)
    {
        var gracePeriod = selectedGame.Config.GracePeriod;
        var roundCount = selectedGame.RoundCount;
        
        var sunkNumbers = sunkBallsModel.SunkNumbers;
        
        selectedGame.RemainingNumbers.RemoveAll(num => sunkNumbers.Contains(num));

        if (roundCount > gracePeriod)
        {
            selectedGame.RemainingPlayers.RemoveAll(p => sunkNumbers.Contains(p.BallNumber));
            
            if (selectedGame.RemainingPlayers.Count > 1 && sunkNumbers.Contains(selectedGame.StartingPlayerId))
            {
                // Choose a new player to consider as the start of a round
                selectedGame.StartingPlayerId = FindPlayerAfterId(selectedGame, selectedGame.StartingPlayerId);
            }
        }
        else
        {
            var eliminatedPlayers= selectedGame.Players.FindAll(p => sunkNumbers.Contains(p.BallNumber));
            var remainingNumbers = selectedGame.RemainingNumbers;
            
            // Remove all numbers that are currently in use
            foreach (var player in selectedGame.Players)
            {
                remainingNumbers.Remove(player.BallNumber);
            }

            var random = new Random();
            
            // Reassign ball numbers
            foreach (var player in eliminatedPlayers.TakeWhile(_ => remainingNumbers.Count != 0))
            {
                player.BallNumber = remainingNumbers[random.Next(0, remainingNumbers.Count - 1)];
                remainingNumbers.Remove(player.BallNumber);
            }
        }
    }

    public bool EditConfig(EditConfigModel editConfig)
    {
        GameStateModel selectedGame;
        
        try
        {
            selectedGame = GetGameById(editConfig.GameId);
        }
        catch (Exception)
        {
            return false;
        }

        if (selectedGame.HostId != editConfig.PlayerId || editConfig.Config.MaxPlayers < selectedGame.CurrentPlayers)
        {
            return false;
        }

        selectedGame.Config = editConfig.Config;
        return true;
    }

    public bool KickPlayer(TargetPlayerModel targetPlayerModel)
    {
        GameStateModel selectedGame;

        try
        {
            selectedGame = GetGameById(targetPlayerModel.GameId);
        }
        catch (Exception)
        {
            return false;
        }

        var kickedPlayer = selectedGame.Players.Find(x => x.Id == targetPlayerModel.TargetPlayerId);
        
        if (selectedGame.HostId != targetPlayerModel.HostId || kickedPlayer == null)
        {
            return false;
        }

        selectedGame.Players.Remove(kickedPlayer);
        return true;
    }

    public bool GiveHost(TargetPlayerModel targetPlayerModel)
    {
        GameStateModel selectedGame;

        try
        {
            selectedGame = GetGameById(targetPlayerModel.GameId);
        }
        catch (Exception)
        {
            return false;
        }

        var newHost = selectedGame.Players.Find(x => x.Id == targetPlayerModel.TargetPlayerId);

        if (selectedGame.HostId != targetPlayerModel.HostId || newHost == null)
        {
            return false;
        }

        selectedGame.HostId = newHost.Id;
        return true;
    }

    private static int SelectNextPlayer(GameStateModel selectedGame, int playerId)
    {
        var foundId = FindPlayerAfterId(selectedGame, playerId);

        if (foundId == selectedGame.StartingPlayerId)
        {
            selectedGame.RoundCount += 1;
        }

        return foundId;
    }

    private static int FindPlayerAfterId(GameStateModel selectedGame, int playerId)
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
        var playerId = gameState.Players[selectedIndex].Id;
        
        gameState.TurnPlayerId = playerId;
        gameState.StartingPlayerId = playerId;
    }
}