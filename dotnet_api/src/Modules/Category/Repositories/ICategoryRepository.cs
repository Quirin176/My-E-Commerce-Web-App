using WebApp_API.Entities;

namespace WebApp_API.Repositories
{
    public interface ICategoryRepository
    {
        // ──────────────────── Category Queries ────────────────────
        Task<Category?> GetCategoryByIdAsync(int id);
        Task<Category?> GetCategoryBySlugAsync(string slug);
        Task<List<Category>> GetAllCategoriesAsync();

        // ──────────────────── Write Oparation ────────────────────
        Task AddCategoryAsync(Category request);
        void Update(Category category);
    }
}