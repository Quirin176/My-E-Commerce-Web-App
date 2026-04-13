using WebApp_API.Entities;
using WebApp_API.Repositories;

namespace WebApp_API.Services
{
    public class CategoryService : ICategoryService
    {
        private readonly ICategoryRepository _repo;
        public CategoryService(ICategoryRepository repo) => _repo = repo;

        // ──────────────────── Category Queries ────────────────────
        public async Task<Category?> GetCategoryByIdAsync(int id)
        {
            var category = await _repo.GetCategoryByIdAsync(id);
            if (category == null) return null;
            return category;
        }
        public async Task<Category?> GetCategoryBySlugAsync(string slug)
        {
            var category = await _repo.GetCategoryBySlugAsync(slug);
            if (category == null) return null;
            return category;
        }
        public async Task<List<Category>> GetAllCategoriesAsync()
        {
            var list = await _repo.GetAllCategoriesAsync();
            return list;
        }

        // ──────────────────── Write Oparation ────────────────────
        public async Task AddCategoryAsync(Category request)
        {
            // if (!await _repo.GetCategoryBySlugAsync(request.Slug))
            // throw new InvalidOperationException($"Category with slug '{request.Slug}' already exists.");
            
        }
        public void Update(Category category)
        {
            
        }
    }
}