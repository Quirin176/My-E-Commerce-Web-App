using Microsoft.EntityFrameworkCore;
using WebApp_API.Data;
using WebApp_API.DTOs;

namespace WebApp_API.Repositories
{
    public class GeminiAgentRepository : IGeminiAgentRepository
    {
        // BotSenderId must match MessageService.BotSenderId (= 1).
        // Messages sent by this sender get role "model" so Gemini treats them
        // as its own prior turns rather than user input.
        private const int BotSenderId = 1;

        private readonly AppDbContext _db;

        public GeminiAgentRepository(AppDbContext db) => _db = db;

        // ── Catalogue snapshot ────────────────────────────────────────────────

        public async Task<List<GeminiAgentDTOs.CategorySnapshot>> GetCategorySnapshotAsync()
        {
            return await _db.Categories
                .AsNoTracking()
                .OrderBy(c => c.Name)
                .Select(c => new GeminiAgentDTOs.CategorySnapshot(c.Id, c.Name, c.Slug))
                .ToListAsync();
        }

        public async Task<List<GeminiAgentDTOs.ProductSnapshot>> GetProductSnapshotAsync(int limit = 80)
        {
            return await _db.Products
                .AsNoTracking()
                .Include(p => p.Category)
                .OrderByDescending(p => p.Id)   // newest first
                .Take(limit)
                .Select(p => new GeminiAgentDTOs.ProductSnapshot(
                    p.Id,
                    p.Name,
                    p.Slug,
                    p.Category != null ? p.Category.Name : null,
                    p.BasePrice,
                    p.HasVariants,
                    p.ShortDescription))
                .ToListAsync();
        }

        // ── Chat history ─────────────────────────────────────────────────────

        public async Task<List<GeminiAgentDTOs.MessageSnapshot>> GetChatHistoryAsync(int chatId)
        {
            return await _db.Messages
                .AsNoTracking()
                .Where(m => m.ChatId == chatId)
                .OrderBy(m => m.CreatedAt)
                .Select(m => new GeminiAgentDTOs.MessageSnapshot(
                    m.SenderId,
                    m.SenderId == BotSenderId ? "model" : "user",
                    m.Content,
                    m.CreatedAt))
                .ToListAsync();
        }
    }
}