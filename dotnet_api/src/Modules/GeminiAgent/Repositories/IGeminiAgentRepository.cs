using WebApp_API.DTOs;

namespace WebApp_API.Repositories
{
    public interface IGeminiAgentRepository
    {
        // Returns all categories
        Task<List<GeminiAgentDTOs.CategorySnapshot>> GetCategorySnapshotAsync();

        // Returns a lightweight product snapshot for the newest "limit" products.
        Task<List<GeminiAgentDTOs.ProductSnapshot>> GetProductSnapshotAsync(int limit = 200);

        // Returns the full message history for a chat, ordered oldest → newest
        Task<List<GeminiAgentDTOs.MessageSnapshot>> GetChatHistoryAsync(int chatId);
    }
}