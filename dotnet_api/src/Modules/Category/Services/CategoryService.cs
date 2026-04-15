using WebApp_API.Entities;
using WebApp_API.Repositories;

namespace WebApp_API.Services
{
    public class CategoryService : ICategoryService
    {
        private readonly ICategoryRepository _repo;
        public CategoryService(ICategoryRepository repo) => _repo = repo;

        // ──────────────────── Category Queries ────────────────────
        public Task<Category?> GetCategoryByIdAsync(int id) =>
        _repo.GetCategoryByIdAsync(id);
        
        public Task<Category?> GetCategoryBySlugAsync(string slug) =>
        _repo.GetCategoryBySlugAsync(slug);
        
        public Task<List<Category>> GetAllCategoriesAsync() =>
        _repo.GetAllCategoriesAsync();

        // ──────────────────── Write Oparation ────────────────────
        public async Task AddCategoryAsync(CategoryDTOs.CreateCategoryRequest request)
        {
            if (await _repo.GetCategoryBySlugAsync(request.Slug) != null)
                throw new InvalidOperationException($"A category with slug '{request.Slug}' already exists.");

            var category = new Category
            {
                Name = request.Name,
                Slug = request.Slug
            };

            await _repo.AddCategoryAsync(category);
        }

        public async Task<bool> UpdateAsync(int id, CategoryDTOs.CreateCategoryRequest request)
        {
            var category = await _repo.GetCategoryByIdAsync(id);
            if (category is null) return false;

            // Check slug uniqueness only if it's changing
            if (category.Slug != request.Slug &&
                await _repo.GetCategoryBySlugAsync(request.Slug) != null)
                throw new InvalidOperationException($"A category with slug '{request.Slug}' already exists.");

            category.Name = request.Name;
            category.Slug = request.Slug;

            await _repo.UpdateAsync(category);
            return true;
        }
    }
}