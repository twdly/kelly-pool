using System.Text.Json.Serialization;

namespace KellyPool.Server.Models;

public class Player(string name)
{
    [JsonInclude]
    private string Name { get; set; } = name;
}