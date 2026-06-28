namespace WebApp_API.Modules.GeminiAgents.DTOs
{
    public record CategorySnapshot(int Id, string Name, string Slug);

    public record ProductSnapshot(
        int Id,
        string Name,
        string Slug,
        string? CategoryName,
        decimal BasePrice,
        string? ShortDescription);

    public record MessageSnapshot(int SenderId, string Role, string Content, DateTime CreatedAt);
}