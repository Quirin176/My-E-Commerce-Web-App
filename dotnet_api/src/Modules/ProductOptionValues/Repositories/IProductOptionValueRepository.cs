namespace WebApp_API.Modules.ProductOptionValues.Repositories
{
    public interface IProductOptionValueRepository
    {
        Task<Entities.ProductOptionValue?> GetProductOptionValueAsync(string optionValue, int optionId);
        Task<Entities.ProductOptionValue?> GetProductOptionValueByIdAsync(int optionValueId);

        Task CreateProductOptionValueAsync(Entities.ProductOptionValue optionValue);
        Task UpdateProductOptionValueByIdAsync(int id, Entities.ProductOptionValue optionValue);
        Task DeleteProductOptionValueByIdAsync(int id);

        // ────────────────────────────────────────────────── Validation helpers ──────────────────────────────────────────────────
        Task<bool> OptionExistsAsync(int optionId);
        Task<List<int>> GetValidOptionValueIdsForCategoryAsync(int categoryId);
    }
}