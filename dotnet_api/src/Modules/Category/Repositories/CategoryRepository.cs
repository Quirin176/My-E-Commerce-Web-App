
using Microsoft.EntityFrameworkCore;
using WebApp_API.Data;
using WebApp_API.Entities;

namespace WebApp_API.Repositories
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

        public async Task AddCategoryAsync(Category category) =>
        await _db.Categories.AddAsync(category);

        public void Update(Category category) => _db.Categories.Update(category);
    }
}