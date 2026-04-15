using WebApp_API.Entities;

namespace WebApp_API.Repositories
{
    public interface IProductOptionValueRepository
    {
        Task<ProductOptionValue?> GetProductOptionValueAsync(string optionValue);
        Task<ProductOptionValue?> GetProductOptionValueByIdAsync(int optionValueId);
        Task CreateProductOptionValueAsync(ProductOptionValue optionValue);
        Task UpdateProductOptionValueByIdAsync(int id, ProductOptionValue optionValue);
        Task DeleteProductOptionValueByIdAsync(int id);
    }
}