using WebApp_API.Entities;

namespace WebApp_API.Services
{
    // Business Logic
    public interface IProductVariantOptionValueService
    {
        Task<IEnumerable<ProductVariantOptionValue>> GetAllAsync();
        Task<IEnumerable<ProductVariantOptionValue>> GetByVariantIdAsync(int variantId);
        Task<ProductVariantOptionValue?> GetAsync(int variantId, int optionValueId);
        Task<ProductVariantOptionValue> CreateAsync(ProductVariantOptionValue entity);
        Task<bool> DeleteAsync(int variantId, int optionValueId);
    }
}