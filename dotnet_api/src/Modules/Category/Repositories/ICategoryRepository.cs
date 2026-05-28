using WebApp_API.Entities;

namespace WebApp_API.Repositories
{
    public interface ICategoryRepository
    {
        // ──────────────────── Category Queries ────────────────────
        Task<Category?> GetCategoryByIdAsync(int id);
        Task<Category?> GetCategoryBySlugAsync(string slug);
        Task<List<Category>> GetAllCategoriesAsync();
        Task<bool> CheckCategoryExistsByIdAsync(int id);
        Task<bool> CheckCategoryExistsBySlugAsync(string slug);

        // ──────────────────── Write Oparation ────────────────────
        Task AddCategoryAsync(Category request);
        Task UpdateAsync(Category category);
    }
}