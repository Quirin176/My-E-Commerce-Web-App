using Microsoft.EntityFrameworkCore;
using WebApp_API.Data;
using WebApp_API.Entities;

namespace WebApp_API.Repositories
{
    public class ProductOptionRepository : IProductOptionRepository
    {
        private readonly AppDbContext _db;
        public ProductOptionRepository(AppDbContext db) => _db = db;

        // ────────────────────────────── Queries ──────────────────────────────
        public async Task<ProductOption?> GetByIdAsync(int id) =>
            await _db.ProductOptions.FirstOrDefaultAsync(po => po.Id == id);

        public async Task<ProductOption?> GetByNameAndCategoryAsync(string name, int categoryId) =>
            await _db.ProductOptions
                .FirstOrDefaultAsync(po => po.Name == name && po.CategoryId == categoryId);

        public async Task<List<ProductOption>> GetByCategoryIdAsync(int categoryId) =>
            await _db.ProductOptions
                .Where(po => po.CategoryId == categoryId)
                .ToListAsync();

        public async Task<List<ProductOption>> GetByCategorySlugAsync(string categorySlug) =>
            await _db.ProductOptions
                .Where(po => po.Category.Slug == categorySlug)
                .ToListAsync();

        public Task<bool> CategoryExistsAsync(int categoryId) =>
            _db.Categories.AnyAsync(c => c.Id == categoryId);

        // ────────────────────────────── Write Operations ──────────────────────────────
        public async Task AddAsync(ProductOption option)
        {
            await _db.ProductOptions.AddAsync(option);
        }

        public Task DeleteAsync(ProductOption option)
        {
            _db.ProductOptions.Remove(option);
            return Task.CompletedTask;
        }

        public Task SaveChangesAsync() => _db.SaveChangesAsync();
    }
}