using WebApp_API.DTOs;
using WebApp_API.Entities;

namespace WebApp_API.Services
{
    public interface IProductImageService
    {
        Task<ProductImage?> GetByIdAsync(int id);
        Task<List<ProductImage>> GetByProductAsync(int productId);
        Task<List<ProductImage>> GetByVariantAsync(int variantId);
        Task AddRangeAsync(List<ProductImageDTOs.AddProductImageRequest> requests);
        Task<ProductImage?> UpdateAsync(int id, ProductImageDTOs.ProductImageUpdateRequest dto);
        Task<bool> DeleteAsync(int id);
        Task RemoveRangeByProductAsync(int productId);
    }
}