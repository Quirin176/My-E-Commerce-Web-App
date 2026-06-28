using Microsoft.EntityFrameworkCore;
using WebApp_API.Data;
using WebApp_API.Modules.GeminiAgents.DTOs;

namespace WebApp_API.Modules.GeminiAgents.Repositories
{
    public class GeminiAgentRepository : IGeminiAgentRepository
    {
        private readonly int _botUserId;

        private readonly AppDbContext _db;
        public GeminiAgentRepository(AppDbContext db, IConfiguration config)
        {
            _db = db;
            _botUserId = config.GetValue("Gemini:BotUserId", 1);
        }
        // ── Catalogue snapshot ────────────────────────────────────────────────
        public async Task<List<CategorySnapshot>> GetCategorySnapshotAsync()
        {
            return await _db.Categories
                .AsNoTracking()
                .OrderBy(c => c.Name)
                .Select(c => new CategorySnapshot(c.Id, c.Name, c.Slug))
                .ToListAsync();
        }

        public async Task<List<ProductSnapshot>> GetProductSnapshotAsync(int limit = 200)
        {
            return await _db.Products
                .AsNoTracking()
                .Include(p => p.Category)
                .OrderByDescending(p => p.Id)   // newest first
                .Take(limit)
                .Select(p => new ProductSnapshot(
                    p.Id,
                    p.Name,
                    p.Slug,
                    p.Category != null ? p.Category.Name : null,
                    p.BasePrice,
                    p.ShortDescription))
                .ToListAsync();
        }

        // ── Chat history ─────────────────────────────────────────────────────
        public async Task<List<MessageSnapshot>> GetChatHistoryAsync(int chatId)
        {
            return await _db.Messages
                .AsNoTracking()
                .Where(m => m.ChatId == chatId)
                .OrderBy(m => m.CreatedAt)
                .Select(m => new MessageSnapshot(
                    m.SenderId,
                    m.SenderId == _botUserId ? "model" : "user",
                    m.Content,
                    m.CreatedAt))
                .ToListAsync();
        }
    }
}