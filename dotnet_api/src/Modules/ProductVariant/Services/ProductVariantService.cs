using WebApp_API.DTOs;
using WebApp_API.Entities;
using WebApp_API.Repositories;

namespace WebApp_API.Services
{
    public class ProductVariantService : IProductVariantService
    {
        private readonly IProductVariantRepository _productVariantRepo;
        private readonly IProductImageRepository _productImageRepo;
        private readonly IProductVariantOptionValueRepository _productVariantOptionValueRepo;

        public ProductVariantService(
            IProductVariantRepository productVariantRepo,
            IProductImageRepository productImageRepo,
            IProductVariantOptionValueRepository productVariantOptionValueRepo)
        {
            _productVariantRepo = productVariantRepo;
            _productImageRepo = productImageRepo;
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
            await _productVariantRepo.AddAsync(variant);

            // Attach images
            await AttachImagesAsync(variant.Id, request.ImageUrls);

            await AttachOptionValuesAsync(variant.Id, request.OptionValueIds);
        }

        public async Task CreateVariantsAsync(IEnumerable<ProductVariantDTOs.CreateProductVariantRequest> requests)
        {
            foreach (ProductVariantDTOs.CreateProductVariantRequest request in requests)
            {
                ProductVariant variant = BuildVariant(request);
                await _productVariantRepo.AddAsync(variant);

                // Attach images
                await AttachImagesAsync(variant.Id, request.ImageUrls);

                await AttachOptionValuesAsync(variant.Id, request.OptionValueIds);
            }
        }

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

            // Replace images
            if (request.ImageUrls is not null)
            {
                // Delete existing variant images
                var existing = await _productImageRepo.GetByVariantAsync(id);
                foreach (var img in existing)
                {
                    await _productImageRepo.DeleteAsync(img);
                }

                // Add new ones
                if (request.ImageUrls.Count > 0)
                {
                    var images = request.ImageUrls
                        .Select((url, i) => new ProductImage
                        {
                            VariantId = id,
                            ImageUrl = url,
                            DisplayOrder = i,
                            IsMain = i == 0
                        })
                        .ToList();

                    await _productImageRepo.AddRangeAsync(images);
                }

                await _productImageRepo.SaveChangesAsync();
            }

            // Replace option value links if a new list was provided
            if (request.OptionValueIds is not null)
            {
                await _productVariantOptionValueRepo.DeleteByVariantIdAsync(id);

                if (request.OptionValueIds.Count > 0)
                {
                    var links = request.OptionValueIds.Select(ovId => new ProductVariantOptionValue
                    {
                        ProductVariantId = id,
                        ProductOptionValueId = ovId
                    });

                    await _productVariantOptionValueRepo.AddRangeAsync(links);
                }
            }

            var updated = await _productVariantRepo.GetByIdAsync(id);
            return MapToResponse(updated!);
        }

        public Task<bool> DeleteAsync(int id) => _productVariantRepo.DeleteAsync(id);

        // ── Private helpers ──────────────────────────────────────────────────
        private static ProductVariant BuildVariant(ProductVariantDTOs.CreateProductVariantRequest request) => new ProductVariant
        {
            VariantName = request.VariantName,
            SKU = request.SKU ?? string.Empty,
            Price = request.Price,
            OriginalPrice = request.OriginalPrice,
            Stock = request.Stock,
            ImageUrl = request.ImageUrls?.FirstOrDefault()?.ImageUrl,
            ProductId = request.ProductId,
        };

        private async Task AttachImagesAsync(int variantId, List<ProductImageDTOs.ImageUrlDto>? imageUrls)
        {
            if (imageUrls == null || imageUrls.Count == 0) return;

            var images = imageUrls.Select((image, index) => new ProductImage
            {
                VariantId = variantId,
                ImageUrl = image.ImageUrl,
                DisplayOrder = image.DisplayOrder,
                IsMain = image.IsMain
            }).ToList();

            await _productImageRepo.AddRangeAsync(images);
            await _productImageRepo.SaveChangesAsync();
        }

        private async Task AttachOptionValuesAsync(int variantId, List<int>? optionValueIds)
        {
            if (optionValueIds == null || optionValueIds.Count == 0) return;

            var links = optionValueIds.Select(ovId => new ProductVariantOptionValue
            {
                ProductVariantId = variantId,
                ProductOptionValueId = ovId
            });

            await _productVariantOptionValueRepo.AddRangeAsync(links);
        }

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
