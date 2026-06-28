using WebApp_API.Modules.GeminiAgents.DTOs;

namespace WebApp_API.Modules.GeminiAgents.Repositories
{
    public interface IGeminiAgentRepository
    {
        // Returns all categories
        Task<List<CategorySnapshot>> GetCategorySnapshotAsync();

        // Returns a lightweight product snapshot for the newest "limit" products.
        Task<List<ProductSnapshot>> GetProductSnapshotAsync(int limit = 200);

        // Returns the full message history for a chat, ordered oldest → newest
        Task<List<MessageSnapshot>> GetChatHistoryAsync(int chatId);
    }
}