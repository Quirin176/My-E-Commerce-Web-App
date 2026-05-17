using WebApp_API.DTOs;
using WebApp_API.Entities;
using WebApp_API.Repositories;

namespace WebApp_API.Services
{
    public class ProductVariantService : IProductVariantService
    {
        private readonly IProductVariantRepository _productVariantRepo;
        private readonly IProductVariantOptionValueRepository _productVariantOptionValueRepo;

        public ProductVariantService(
            IProductVariantRepository productVariantRepo,
            IProductVariantOptionValueRepository productVariantOptionValueRepo)
        {
            _productVariantRepo = productVariantRepo;
            _productVariantOptionValueRepo = productVariantOptionValueRepo;
        }

        // ──────────────────── Public queries ────────────────────
        public async Task<IEnumerable<ProductVariantDTOs.ProductVariantResponse>> GetAllAsync()
        {
            var variants = await _productVariantRepo.GetAllAsync();
            return variants.Select(MapToResponse);
        }

        public async Task<ProductVariantDTOs.ProductVariantResponse?> GetByIdAsync(int id)
        {
            var variant = await _productVariantRepo.GetByIdAsync(id);
            return variant is null ? null : MapToResponse(variant);
        }

        public async Task<IEnumerable<ProductVariantDTOs.ProductVariantResponse>> GetByProductIdAsync(int productId)
        {
            var variants = await _productVariantRepo.GetByProductIdAsync(productId);
            return variants.Select(MapToResponse);
        }

        // ──────────────────── Write operations ────────────────────
        public async Task CreateAsync(ProductVariantDTOs.CreateProductVariantRequest request)
        {
            ProductVariant variant = BuildVariant(request);

            // Save each variant first to get its Id
            await _productVariantRepo.AddAsync(variant);
            await _productVariantRepo.SaveChangesAsync();

            // Attach option value links
            await _productVariantOptionValueRepo.AddRangeAsync(variant.Id, request.OptionValueIds);
            await _productVariantOptionValueRepo.SaveChangesAsync();
        }

        // public async Task CreateVariantsAsync(IEnumerable<ProductVariantDTOs.CreateProductVariantRequest> requests)
        // {
        //     foreach (ProductVariantDTOs.CreateProductVariantRequest request in requests)
        //     {
        //         ProductVariant variant = BuildVariant(request);

        //         // Save each variant first to get its Id
        //         await _productVariantRepo.AddAsync(variant);

        //         // Attach option value links
        //         await AttachOptionValuesAsync(variant.Id, request.OptionValueIds);
        //     }
        // }

        public async Task<ProductVariantDTOs.ProductVariantResponse?> UpdateAsync(int id, ProductVariantDTOs.UpdateProductVariantRequest request)
        {
            var variant = await _productVariantRepo.GetByIdAsync(id);
            if (variant is null) return null;

            if (request.VariantName is not null) variant.VariantName = request.VariantName;
            if (request.SKU is not null) variant.SKU = request.SKU;
            if (request.Price.HasValue) variant.Price = request.Price.Value;
            if (request.OriginalPrice.HasValue) variant.OriginalPrice = request.OriginalPrice.Value;
            if (request.Stock.HasValue) variant.Stock = request.Stock.Value;

            await _productVariantRepo.UpdateAsync(variant);

            // Replace option value links if a new list was provided
            if (request.OptionValueIds is not null)
            {
                await _productVariantOptionValueRepo.DeleteByVariantIdAsync(id);
                await _productVariantOptionValueRepo.SaveChangesAsync();

                await _productVariantOptionValueRepo.AddRangeAsync(id, request.OptionValueIds);
                await _productVariantOptionValueRepo.SaveChangesAsync();
            }

            var updated = await _productVariantRepo.GetByIdAsync(id);
            await _productVariantRepo.SaveChangesAsync();

            return MapToResponse(updated!);
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var variant = await _productVariantRepo.GetByIdAsync(id);
            if (variant is null) return false;

            await _productVariantRepo.DeleteAsync(id);
            await _productVariantRepo.SaveChangesAsync();
            return true;
        }

        // ── Private helpers ──────────────────────────────────────────────────
        private static ProductVariant BuildVariant(ProductVariantDTOs.CreateProductVariantRequest request) => new ProductVariant
        {
            VariantName = request.VariantName,
            SKU = request.SKU ?? string.Empty,
            Price = request.Price,
            OriginalPrice = request.OriginalPrice,
            Stock = request.Stock,
            ProductId = request.ProductId,
        };

        // ── Mapping helpers ────────────────────────────────────────────────────
        private static ProductVariantDTOs.ProductVariantResponse MapToResponse(ProductVariant v) => new ProductVariantDTOs.ProductVariantResponse
        {
            Id = v.Id,
            VariantName = v.VariantName,
            SKU = v.SKU,
            Price = v.Price,
            OriginalPrice = v.OriginalPrice,
            Stock = v.Stock,
            ProductId = v.ProductId,
            Images = v.Images
                .OrderBy(img => img.DisplayOrder)
                .Select(img => new ProductVariantDTOs.VariantImageDto
                {
                    Id = img.Id,
                    ImageUrl = img.ImageUrl,
                    DisplayOrder = img.DisplayOrder,
                    IsMain = img.IsMain
                })
                .ToList(),
            OptionValues = v.ProductVariantOptionValues
                .Select(pvov => new ProductVariantDTOs.VariantOptionValueDto
                {
                    OptionValueId = pvov.ProductOptionValueId,
                    OptionName = pvov.ProductOptionValue?.ProductOption?.Name ?? "",
                    Value = pvov.ProductOptionValue?.Value ?? ""
                })
                .ToList()
        };
    }
}
