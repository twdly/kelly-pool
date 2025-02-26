using System.Text.Json.Serialization;

namespace KellyPool.Server.Models;

public class Player(int id, string name)
{
    public int Id { get; set; } = id;
    public string Name { get; set; } = name;
}