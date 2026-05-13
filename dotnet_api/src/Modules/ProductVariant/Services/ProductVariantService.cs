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

        public ProductVariantService(IProductVariantRepository productVariantRepo, IProductImageRepository productImageRepo, IProductVariantOptionValueRepository productVariantOptionValueRepo)
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
            var variant = new ProductVariant
            {
                VariantName = request.VariantName,
                SKU = request.SKU,
                Price = request.Price,
                OriginalPrice = request.OriginalPrice,
                Stock = request.Stock,
                ImageUrl = request.ImageUrls[0].ImageUrl,
                ProductId = request.ProductId,
            };

            await _productVariantRepo.AddAsync(variant);

            // Attach images if provided
            if (request.ImageUrls.Count > 0)
            {
                var images = request.ImageUrls.Select((image, index) => new ProductImage
                {
                    VariantId = variant.Id,
                    ImageUrl = image.ImageUrl,
                    DisplayOrder = image.DisplayOrder,
                    IsMain = image.IsMain
                })
                    .ToList();

                await _productImageRepo.AddRangeAsync(images);
                await _productImageRepo.SaveChangesAsync();
            }

            if (request.OptionValueIds.Count > 0)
            {
                var links = request.OptionValueIds
                    .Select(ovId => new ProductVariantOptionValue
                    {
                        ProductVariantId = variant.Id,
                        ProductOptionValueId = ovId
                    });

                await _productVariantOptionValueRepo.AddRangeAsync(links);
            }
        }

        public async Task CreateVariantsAsync(IEnumerable<ProductVariantDTOs.CreateProductVariantRequest> requests)
        {
            foreach (ProductVariantDTOs.CreateProductVariantRequest request in requests)
            {
                var variant = new ProductVariant
                {
                    VariantName = request.VariantName,
                    SKU = request.SKU,
                    Price = request.Price,
                    OriginalPrice = request.OriginalPrice,
                    Stock = request.Stock,
                    ImageUrl = request.ImageUrls[0].ImageUrl,
                    ProductId = request.ProductId,
                };

                await _productVariantRepo.AddAsync(variant);

                // Attach images if provided
                if (request.ImageUrls.Count > 0)
                {
                    var images = request.ImageUrls.Select((image, index) => new ProductImage
                    {
                        VariantId = variant.Id,
                        ImageUrl = image.ImageUrl,
                        DisplayOrder = image.DisplayOrder,
                        IsMain = image.IsMain
                    })
                        .ToList();

                    await _productImageRepo.AddRangeAsync(images);
                    await _productImageRepo.SaveChangesAsync();
                }

                if (request.OptionValueIds.Count > 0)
                {
                    var links = request.OptionValueIds
                        .Select(ovId => new ProductVariantOptionValue
                        {
                            ProductVariantId = variant.Id,
                            ProductOptionValueId = ovId
                        });

                    await _productVariantOptionValueRepo.AddRangeAsync(links);
                }
            }
        }

        public async Task<ProductVariantDTOs.ProductVariantResponse?> UpdateAsync(
            int id, ProductVariantDTOs.UpdateProductVariantRequest request)
        {
            var variant = await _productVariantRepo.GetByIdAsync(id);
            if (variant is null) return null;

            if (request.VariantName is not null) variant.VariantName = request.VariantName;
            if (request.SKU is not null) variant.SKU = request.SKU;
            if (request.Price.HasValue) variant.Price = request.Price.Value;
            if (request.OriginalPrice.HasValue) variant.OriginalPrice = request.OriginalPrice.Value;
            if (request.Stock.HasValue) variant.Stock = request.Stock.Value;

            await _productVariantRepo.UpdateAsync(variant);

            // Replace images if a new list was provided
            if (request.ImageUrls is not null)
            {
                // Delete existing variant images
                var existing = await _productImageRepo.GetByVariantAsync(id);
                foreach (var img in existing)
                    await _productImageRepo.DeleteAsync(img);

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
                    var links = request.OptionValueIds
                        .Select(ovId => new ProductVariantOptionValue
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

        // ── Mapping helpers ────────────────────────────────────────────────────

        private static ProductVariantDTOs.ProductVariantResponse MapToResponse(ProductVariant v) => new()
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
