using KellyPool.Server.Models;
using KellyPool.Server.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace KellyPool.Server.Controllers;

[ApiController]
[Route("management")]
public class GamesManagerController(IGamesRepoService gamesRepoService) : ControllerBase
{
    private IGamesRepoService GamesRepo { get; } = gamesRepoService;

    [HttpGet]
    [Route("get-games")]
    public IEnumerable<GameSelectModel> Get()
    {
        var games = GamesRepo.GetAllGames();
        return games.Count == 0 ? [] : games;
    }

    [HttpPost]
    [Route("create-game")]
    public ActionResult<GameStateModel> CreateGame([FromBody] CreateGameModel gameModel)
    {
        return GamesRepo.CreateGame(gameModel);
    }

    [HttpPost]
    [Route("join-game")]
    public ActionResult<GameStateModel> JoinGame([FromBody] JoinGameModel joinModel)
    {
        return GamesRepo.JoinGame(joinModel.GameId, joinModel.PlayerName);
    }
}
