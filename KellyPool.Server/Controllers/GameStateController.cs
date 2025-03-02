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
    public GameStateResponseModel GetGameState([FromQuery] int gameId, [FromQuery] int playerId)
    {
        return GamesRepoService.GetStateForPlayer(gameId, playerId);
    }

    [HttpPost]
    [Route("begin")]
    public GameStateResponseModel BeginGame([FromBody] StateRequestModel requestModel)
    {
        GamesRepoService.InitialiseGame(requestModel.GameId);
        var gameStateResponse = GamesRepoService.GetStateForPlayer(requestModel.GameId, requestModel.PlayerId);
        return gameStateResponse;
    }

    [HttpPost]
    [Route("end-turn")]
    public GameStateResponseModel EndTurn([FromBody] EndTurnModel turnModel)
    {
        GamesRepoService.EndTurn(turnModel);
        return GamesRepoService.GetStateForPlayer(turnModel.GameId, turnModel.PlayerId);
    }
}