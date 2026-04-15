
using WebApp_API.DTOs;
using WebApp_API.Entities;
using WebApp_API.Repositories;

namespace WebApp_API.Services
{
    public class ProductOptionValueService : IProductOptionValueService
    {
        private readonly IProductOptionValueRepository _repo;
        public ProductOptionValueService(IProductOptionValueRepository repo) => _repo = repo;

        public async Task CreateProductOptionValueAsync(ProductOptionValueDTOs.CreateOptionValueRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.Value))
                throw new InvalidOperationException("Option value is required");

            if (await _repo.GetProductOptionValueAsync(request.Value) != null)
                throw new InvalidOperationException($"Value '{request.Value}' already exists for this option");

            var optionValue = new ProductOptionValue
            {
                Value = request.Value,
                ProductOptionId = request.OptionId
            };

            await _repo.CreateProductOptionValueAsync(optionValue);
        }

        public async Task<bool> UpdateProductOptionValueAsync(int optionValueId, ProductOptionValueDTOs.UpdateOptionValueRequest request)
        {
            var optionValue = await _repo.GetProductOptionValueByIdAsync(optionValueId);
            if (optionValue is null) return false;

            optionValue.Value = request.Value;

            await _repo.UpdateProductOptionValueByIdAsync(optionValueId, optionValue);
            return true;
        }

        public async Task<bool> DeleteProductOptionValueAsync(int optionValueId)
        {
            var optionValue = await _repo.GetProductOptionValueByIdAsync(optionValueId);
            if (optionValue is null) return false;
            await _repo.DeleteProductOptionValueByIdAsync(optionValueId);
            return true;
        }
    }
}