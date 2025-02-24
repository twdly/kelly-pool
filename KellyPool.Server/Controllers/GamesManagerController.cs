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
    public IEnumerable<GameModel> Get()
    {
        var games = GamesRepo.GetAllGames();
        return games.Count == 0 ? [] : games;
    }

    [HttpPost]
    [Route("create-game")]
    public ActionResult<GameModel> CreateGame([FromBody] CreateGameModel gameModel)
    {
        return GamesRepo.CreateGame(gameModel.Name, gameModel.MaxPlayers);
    }
}
