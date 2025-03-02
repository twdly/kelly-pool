using KellyPool.Server.Models;
using KellyPool.Server.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace KellyPool.Server.Controllers;

[ApiController]
[Route("game-state")]
public class GameStateController(IGamesRepoService gamesRepoService)
{
    private IGamesRepoService GamesRepoService { get; } = gamesRepoService;
    
    [HttpGet]
    [Route("get")]
    public GameStateModel GetGameState([FromQuery] int id)
    {
        return GamesRepoService.GetGameById(id);
    }

    [HttpPost]
    [Route("begin")]
    public GameStateModel BeginGame([FromBody] int id)
    {
        return GamesRepoService.InitialiseGame(id);
    }
}