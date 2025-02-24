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
    public ActionResult<IEnumerable<GameModel>> Get()
    {
        var games = GamesRepo.GetAllGames();
        if (games.Count == 0)
        {
            return NoContent();
        }

        return games;
    }

    [HttpPost]
    [Route("create-game")]
    public ActionResult<GameModel> CreateGame([FromBody] CreateGameModel gameModel)
    {
        return GamesRepo.CreateGame(gameModel.Name, gameModel.MaxPlayers);
    }
}
