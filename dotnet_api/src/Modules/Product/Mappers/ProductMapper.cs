using WebApp_API.Entities;
using WebApp_API.Modules.Products.DTOs;
using WebApp_API.Modules.Products.Repositories;
using WebApp_API.Modules.ProductVariants.DTOs;

namespace WebApp_API.Modules.Products.Mappers
{
    public class ProductMapper
    {
        private readonly IProductRepository _productRepo;
        public ProductMapper(IProductRepository productRepo) => _productRepo = productRepo;


        // Converts a Product entity to response product's detail
        public async Task<ProductDTOs.ProductDetailResponse> ToDetailAsync(Product product)
        {
            var rawOpts = await _productRepo.GetOptionsRawAsync(product.Id);

            return new ProductDTOs.ProductDetailResponse
            {
                Id = product.Id,
                Name = product.Name,
                Slug = product.Slug,
                ShortDescription = product.ShortDescription,
                Description = product.Description,
                BasePrice = product.BasePrice,
                ThumbnailUrl = product.ThumbnailUrl,
                CategoryId = product.CategoryId,
                Category = MapCategory(product.Category),
                Options = GroupOptions(rawOpts),

                Variants = product.Variants.Select(v => new ProductVariantResponse
                {
                    Id = v.Id,
                    VariantName = v.VariantName,
                    SKU = v.SKU,
                    Price = v.Price,
                    OriginalPrice = v.OriginalPrice,
                    Stock = v.Stock,
                    ProductId = v.ProductId,
                    Images = v.Images.OrderBy(img => img.DisplayOrder).Select(img => new VariantImageDto
                    {
                        Id = img.Id,
                        ImageUrl = img.ImageUrl,
                        DisplayOrder = img.DisplayOrder,
                        IsMain = img.IsMain
                    }).ToList(),
                    OptionValues = v.ProductVariantOptionValues.Select(pvov => new VariantOptionValueDto
                    {
                        OptionValueId = pvov.ProductOptionValueId,
                        OptionName = pvov.ProductOptionValue?.ProductOption?.Name ?? "",
                        Value = pvov.ProductOptionValue?.Value ?? ""
                    }).ToList()
                }).ToList()
            };
        }

        private static ProductDTOs.CategoryInfo? MapCategory(Category? category)
        {
            if (category is null)
                return null;

            return new ProductDTOs.CategoryInfo
            {
                Id = category.Id,
                Name = category.Name,
                Slug = category.Slug
            };
        }

        private static List<ProductDTOs.ProductOptionGroupResponse> GroupOptions(List<(int OptionId, string OptionName, int ValueId, string Value)> raw)
        {
            return raw.GroupBy(o => new { o.OptionId, o.OptionName })
                        .Select(g => new ProductDTOs.ProductOptionGroupResponse
                        {
                            OptionId = g.Key.OptionId,
                            OptionName = g.Key.OptionName,
                            OptionValues = g.Select(v => new ProductDTOs.ProductOptionValueItem
                            {
                                OptionValueId = v.ValueId,
                                Value = v.Value
                            }).ToList()
                        }).ToList();
        }

        // Converts a list of Product entities to a list of response product summaries
        public async Task<List<ProductListDTOs.ProductSummaryResponse>> ToSummaryListAsync(List<Product> products)
        {
            if (products.Count == 0)
                return new List<ProductListDTOs.ProductSummaryResponse>();

            var productIds = products.Select(p => p.Id).Distinct().ToList();
            var rawOpts = await _productRepo.GetOptionsRawForProductsAsync(productIds);

            var groupedByProduct = rawOpts
                .GroupBy(o => o.ProductId)
                .ToDictionary(
                    g => g.Key,
                    g => g.GroupBy(x => new { x.OptionId, x.OptionName })
                          .Select(optionGroup => new ProductListDTOs.ProductOptionGroupResponse
                          {
                              OptionId = optionGroup.Key.OptionId,
                              OptionName = optionGroup.Key.OptionName,
                              OptionValues = optionGroup.Select(x => x.Value).Distinct().ToList()
                          })
                          .ToList());

            return products.Select(p => new ProductListDTOs.ProductSummaryResponse
            {
                Id = p.Id,
                Name = p.Name,
                Slug = p.Slug,
                BasePrice = p.BasePrice,
                ThumbnailUrl = p.ThumbnailUrl,
                ShortDescription = p.ShortDescription,
                CategoryId = p.CategoryId,
                Options = groupedByProduct.TryGetValue(p.Id, out var options) ? options : new List<ProductListDTOs.ProductOptionGroupResponse>()
            }).ToList();
        }
    }
}