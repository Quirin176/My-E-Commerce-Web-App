using WebApp_API.DTOs;
using WebApp_API.Entities;

namespace WebApp_API.Services
{
    public interface IProductImageService
    {
        Task<ProductImageDTOs.ProductImageResponse?> GetByIdAsync(int id);
        Task<List<ProductImageDTOs.ProductImageResponse>> GetByProductAsync(int productId);
        Task<List<ProductImageDTOs.ProductImageResponse>> GetByVariantAsync(int variantId);
        Task AddRangeAsync(List<ProductImageDTOs.AddProductImageRequest> requests);
        Task<ProductImage?> UpdateAsync(int id, ProductImageDTOs.ProductImageUpdateRequest dto);
        Task<bool> DeleteAsync(int id);
        Task RemoveRangeByProductAsync(int productId);
    }
}