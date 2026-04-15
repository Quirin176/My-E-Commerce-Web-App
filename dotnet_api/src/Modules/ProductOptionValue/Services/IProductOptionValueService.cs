using WebApp_API.DTOs;

namespace WebApp_API.Services
{
    public interface IProductOptionValueService
    {
        Task CreateProductOptionValueAsync(ProductOptionValueDTOs.CreateOptionValueRequest request);
        Task<bool> UpdateProductOptionValueAsync(int optionValueId, ProductOptionValueDTOs.UpdateOptionValueRequest request);
        Task<bool> DeleteProductOptionValueAsync(int optionValueId);
    }
}