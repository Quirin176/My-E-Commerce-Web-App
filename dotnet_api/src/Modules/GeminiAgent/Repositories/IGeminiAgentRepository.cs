using WebApp_API.DTOs;

namespace WebApp_API.Repositories
{
    public interface IGeminiAgentRepository
    {
        /// Returns all categories (Id, Name, Slug)
        Task<List<GeminiAgentDTOs.CategorySnapshot>> GetCategorySnapshotAsync();
 
        /// Returns a lightweight product snapshot for the newest <paramref name="limit"/> products.
        /// Includes category name, base price, short description, slug, and variant flag.
        Task<List<GeminiAgentDTOs.ProductSnapshot>> GetProductSnapshotAsync(int limit = 80);
 
        /// Returns the full message history for a chat, ordered oldest → newest,
        /// so the agent can reason over the whole conversation.
        Task<List<GeminiAgentDTOs.MessageSnapshot>> GetChatHistoryAsync(int chatId);
    }
}