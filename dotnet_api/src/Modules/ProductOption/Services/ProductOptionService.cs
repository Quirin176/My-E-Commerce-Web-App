using Microsoft.EntityFrameworkCore;
using WebApp_API.Data;
using WebApp_API.DTOs;
using WebApp_API.Entities;
using WebApp_API.Repositories;

namespace WebApp_API.Services
{
    public class ProductOptionService : IProductOptionService
    {
        private readonly IProductOptionRepository _repo;
        private readonly AppDbContext _db;

        public ProductOptionService(IProductOptionRepository repo, AppDbContext db)
        {
            _repo = repo;
            _db = db;
        }

        // ────────────────────────────── Queries ──────────────────────────────
        public async Task<ProductOptionDTOs.ProductOptionResponse?> GetByIdAsync(int id)
        {
            var option = await _repo.GetByIdAsync(id);
            if (option is null) return null;

            return await MapToResponseAsync(option);
        }

        public async Task<List<ProductOptionDTOs.ProductOptionGroupResponse>> GetByCategoryIdAsync(int categoryId)
        {
            var options = await _repo.GetByCategoryIdAsync(categoryId);
            return await MapToGroupListAsync(options);
        }

        public async Task<List<ProductOptionDTOs.ProductOptionGroupResponse>> GetByCategorySlugAsync(string categorySlug)
        {
            var options = await _repo.GetByCategorySlugAsync(categorySlug);
            return await MapToGroupListAsync(options);
        }

        // ────────────────────────────── Write Operations ──────────────────────────────
        public async Task<ProductOptionDTOs.ProductOptionResponse> CreateAsync(
            ProductOptionDTOs.CreateProductOptionRequest request)
        {
            if (!await _repo.CategoryExistsAsync(request.CategoryId!.Value))
                throw new ArgumentException($"Category with ID {request.CategoryId} does not exist.");

            if (await _repo.GetByNameAndCategoryAsync(request.Name, request.CategoryId.Value) is not null)
                throw new InvalidOperationException(
                    $"Option '{request.Name}' already exists for this category.");

            var option = new ProductOption
            {
                Name = request.Name,
                CategoryId = request.CategoryId.Value
            };

            await _repo.AddAsync(option);
            await _repo.SaveChangesAsync();

            return new ProductOptionDTOs.ProductOptionResponse
            {
                Id = option.Id,
                Name = option.Name,
                CategoryId = option.CategoryId,
                OptionValues = new()
            };
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var option = await _repo.GetByIdAsync(id);
            if (option is null) return false;

            await _repo.DeleteAsync(option);
            await _repo.SaveChangesAsync();
            return true;
        }

        // ────────────────────────────── Mapping Helpers ──────────────────────────────
        private async Task<ProductOptionDTOs.ProductOptionResponse> MapToResponseAsync(ProductOption option)
        {
            var values = await _db.ProductOptionValues
                .Where(v => v.ProductOptionId == option.Id)
                .OrderBy(v => v.Value)
                .Select(v => new ProductOptionDTOs.OptionValueResponse
                {
                    Id = v.Id,
                    Value = v.Value,
                    ProductOptionId = v.ProductOptionId
                })
                .ToListAsync();

            return new ProductOptionDTOs.ProductOptionResponse
            {
                Id = option.Id,
                Name = option.Name,
                CategoryId = option.CategoryId,
                OptionValues = values
            };
        }

        private async Task<List<ProductOptionDTOs.ProductOptionGroupResponse>> MapToGroupListAsync(
            List<ProductOption> options)
        {
            var result = new List<ProductOptionDTOs.ProductOptionGroupResponse>(options.Count);

            foreach (var option in options)
            {
                var values = await _db.ProductOptionValues
                    .Where(v => v.ProductOptionId == option.Id)
                    .OrderBy(v => v.Value)
                    .Select(v => new ProductOptionDTOs.OptionValueResponse
                    {
                        Id = v.Id,
                        Value = v.Value,
                        ProductOptionId = v.ProductOptionId
                    })
                    .ToListAsync();

                result.Add(new ProductOptionDTOs.ProductOptionGroupResponse
                {
                    OptionId = option.Id,
                    OptionName = option.Name,
                    OptionValues = values
                });
            }

            return result;
        }
    }
}