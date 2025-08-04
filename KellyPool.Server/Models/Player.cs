using System.Text.Json.Serialization;

namespace KellyPool.Server.Models;

public class Player(int id, string name)
{
    public int Id { get; set; } = id;
    public string Name { get; set; } = name;
    public int Wins { get; set; }
    public int BallsSunk { get; set; }
    public int Turns { get; set; }
    
    [JsonIgnore] 
    public int BallNumber { get; set; }

    [JsonIgnore]
    public List<int> KnownPlayerIds { get; set; } = [];  // The IDs of other players that this player knows the number of
}