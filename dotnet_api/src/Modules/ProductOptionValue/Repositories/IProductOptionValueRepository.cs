using WebApp_API.Entities;

namespace WebApp_API.Repositories
{
    public interface IProductOptionValueRepository
    {
        Task<ProductOptionValue?> GetProductOptionValueAsync(string optionValue, int optionId);
        Task<ProductOptionValue?> GetProductOptionValueByIdAsync(int optionValueId);
        Task<List<(int OptionId, List<int> ValueIds)>> GetOptionGroupsForValuesAsync(List<int> valueIds);
        Task CreateProductOptionValueAsync(ProductOptionValue optionValue);
        Task UpdateProductOptionValueByIdAsync(int id, ProductOptionValue optionValue);
        Task DeleteProductOptionValueByIdAsync(int id);

        // ────────────────────────────────────────────────── Validation helpers ──────────────────────────────────────────────────
        Task<bool> OptionExistsAsync(int optionId);
        Task<List<int>> GetValidOptionValueIdsForCategoryAsync(int categoryId);
    }
}