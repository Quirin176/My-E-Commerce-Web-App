using WebApp_API.DTOs;

namespace WebApp_API.Services
{
    public interface IProductImageService
    {
        Task AddProductImagesAsync(List<ProductImageDTOs.AddProductImageRequest> requests);
    }
}