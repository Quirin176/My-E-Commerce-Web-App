using WebApp_API.Entities;

namespace WebApp_API.Services
{
    public interface ICategoryService
    {
        // ──────────────────── Category Queries ────────────────────
        Task<Category?> GetCategoryByIdAsync(int id);
        Task<Category?> GetCategoryBySlugAsync(string slug);
        Task<List<Category>> GetAllCategoriesAsync();

        // ──────────────────── Write Oparation ────────────────────
        Task AddCategoryAsync(CategoryDTOs.CreateCategoryRequest request);
        Task<bool> UpdateAsync(int id, CategoryDTOs.CreateCategoryRequest request);
    }
}