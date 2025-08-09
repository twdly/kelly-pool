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
        return GamesRepoService.GetStateForPlayer(requestModel.GameId, requestModel.PlayerId);
    }

    [HttpPost]
    [Route("sink-balls")]
    public GameStateResponseModel SinkBalls([FromBody] SunkNumbersModel sunkBallsModel)
    {
        GamesRepoService.SinkBalls(sunkBallsModel);
        return GamesRepoService.GetStateForPlayer(sunkBallsModel.GameId, sunkBallsModel.PlayerId);
    }

    [HttpPost]
    [Route("end-turn")]
    public GameStateResponseModel EndTurn([FromBody] GenericInteractionModel interactionModel)
    {
        GamesRepoService.EndTurn(interactionModel);
        return GamesRepoService.GetStateForPlayer(interactionModel.GameId, interactionModel.PlayerId);
    }
}