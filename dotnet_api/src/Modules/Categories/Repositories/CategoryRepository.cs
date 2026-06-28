using Microsoft.EntityFrameworkCore;
using WebApp_API.Data;
using WebApp_API.Entities;

namespace WebApp_API.Modules.Categories.Repositories
{
    public class CategoryRepository : ICategoryRepository
    {
        private readonly AppDbContext _db;
        public CategoryRepository(AppDbContext db) => _db = db;

        // ──────────────────── Category Queries ────────────────────
        public Task<Category?> GetCategoryByIdAsync(int id) =>
        _db.Categories.FirstOrDefaultAsync(cat => cat.Id == id);

        public Task<Category?> GetCategoryBySlugAsync(string slug) =>
        _db.Categories.FirstOrDefaultAsync(cat => cat.Slug == slug);

        public Task<List<Category>> GetAllCategoriesAsync() =>
        _db.Categories.ToListAsync();

        public Task<bool> CheckCategoryExistsByIdAsync(int id) =>
            _db.Categories.AnyAsync(c => c.Id == id);

        public Task<bool> CheckCategoryExistsBySlugAsync(string slug) =>
            _db.Categories.AnyAsync(c => c.Slug == slug);

        // ──────────────────── Write operations ────────────────────
        public async Task AddCategoryAsync(Category category)
        {
            await _db.Categories.AddAsync(category);
            await _db.SaveChangesAsync();
        }

        public async Task UpdateAsync(Category category)
        {
            _db.Categories.Update(category);
            await _db.SaveChangesAsync();
        }
    }
}