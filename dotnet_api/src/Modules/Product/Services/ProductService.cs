using WebApp_API.DTOs;
using WebApp_API.Entities;
using WebApp_API.Repositories;
using WebApp_API.Specifications;
using static WebApp_API.Models.PaginationDTOs;

namespace WebApp_API.Services
{
    public class ProductService : IProductService
    {
        private readonly IProductRepository _productRepo;
        private readonly ICategoryRepository _categoryRepo;
        private readonly IProductOptionValueRepository _productOptionValueRepo;
        public ProductService(IProductRepository productRepo, ICategoryRepository categoryRepo, IProductOptionValueRepository productOptionValueRepo)
        {
            _productRepo = productRepo;
            _categoryRepo = categoryRepo;
            _productOptionValueRepo = productOptionValueRepo;
        }

        // ────────────────────────────────────────────────── Public queries ──────────────────────────────────────────────────
        public async Task<ProductDTOs.ProductDetailResponse?> GetByIdAsync(int id)
        {
            var product = await _productRepo.GetByIdAsync(id);
            if (product is null) return null;
            return await MapToDetailAsync(product);
        }

        public async Task<ProductDTOs.ProductDetailResponse?> GetBySlugAsync(string slug)
        {
            var product = await _productRepo.GetBySlugAsync(slug);
            if (product is null) return null;
            return await MapToDetailAsync(product);
        }

        public async Task<List<ProductListDTOs.ProductSummaryResponse>> GetCategoryNewestAsync(int categoryId, int amount)
        {
            var products = await _productRepo.GetCategoryNewestAsync(categoryId, amount);
            return await MapToSummaryListAsync(products);
        }

        public async Task<ProductDTOs.SearchResponse> SearchAsync(ProductListDTOs.ProductSearchParams searchParams)
        {
            var spec = ProductSearchSpec.From(searchParams);
            var (items, totalCount) = await _productRepo.SearchAsync(spec);

            return new ProductDTOs.SearchResponse
            {
                Success = true,
                Query = searchParams.QueryPhrase,
                TotalCount = totalCount,
                PageNumber = spec.Page,
                PageSize = spec.PageSize,
                TotalPages = (int)Math.Ceiling((decimal)totalCount / spec.PageSize),
                HasNextPage = (spec.Page - 1) * spec.PageSize + items.Count < totalCount,
                HasPreviousPage = spec.Page > 1,
                Products = await MapToSummaryListAsync(items)
            };
        }

        public async Task<List<string>> GetSuggestionsAsync(string q, int limit = 10)
        {
            if (string.IsNullOrWhiteSpace(q) || q.Length < 2)
                return new List<string>();

            var spec = ProductSearchSpec.From(new ProductListDTOs.ProductSearchParams
            {
                QueryPhrase = q,
                PageSize = limit
            });

            var (items, _) = await _productRepo.SearchAsync(spec);
            return items.Select(p => p.Name).Distinct().Take(limit).ToList();
        }

        public async Task<PaginatedResponse<ProductListDTOs.ProductSummaryResponse>> GetPaginatedAsync(ProductFilterSpec spec)
        {
            var (items, totalCount) = await _productRepo.GetPaginatedAsync(spec);

            var data = await MapToSummaryListAsync(items);
            return new PaginatedResponse<ProductListDTOs.ProductSummaryResponse>
            {
                Success = true,
                Data = data,
                Pagination = PaginationMeta.From(spec.Page, spec.PageSize, totalCount)
            };
        }

        // ────────────────────────────────────────────────── Write operations ──────────────────────────────────────────────────
        public async Task<int> CreateAsync(ProductDTOs.CreateProductRequest request)
        {
            if (!await _categoryRepo.CheckCategoryExistsByIdAsync(request.CategoryId))
                throw new ArgumentException($"Category with ID {request.CategoryId} does not exist.");

            if (await _productRepo.CheckProductExistsBySlugAsync(request.Slug))
                throw new InvalidOperationException($"A product with slug '{request.Slug}' already exists.");

            if (request.SelectedOptionValueIds.Count > 0)
            {
                var valid = await _productOptionValueRepo.GetValidOptionValueIdsForCategoryAsync(request.CategoryId);
                var invalid = request.SelectedOptionValueIds.Except(valid).ToList();
                if (invalid.Count > 0)
                    throw new ArgumentException($"Option value ID(s) {string.Join(", ", invalid)} are not valid for this category.");
            }

            var product = new Product
            {
                Name = request.Name,
                Slug = request.Slug,
                ShortDescription = request.ShortDescription,
                Description = request.Description,
                BasePrice = request.BasePrice,
                Stock = request.Stock,
                ThumbnailUrl = request.ThumbnailUrl,
                CategoryId = request.CategoryId,
                HasVariants = request.HasVariants,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            var created = await _productRepo.AddAsync(product);
            await _productRepo.SaveChangesAsync();

            // ── Option values (filters) ───────────────────────────────────────────
            if (request.SelectedOptionValueIds.Count > 0)
                await _productRepo.SetOptionValuesAsync(product.Id, request.SelectedOptionValueIds);

            await _productRepo.SaveChangesAsync();

            return created.Id;
        }

        public async Task<bool> UpdateAsync(int id, ProductDTOs.UpdateProductRequest request)
        {
            var product = await _productRepo.GetByIdAsync(id);
            if (product is null) return false;

            if (!string.IsNullOrWhiteSpace(request.Name)) product.Name = request.Name;
            if (!string.IsNullOrWhiteSpace(request.Slug)) product.Slug = request.Slug;
            if (!string.IsNullOrWhiteSpace(request.ShortDescription)) product.ShortDescription = request.ShortDescription;
            if (!string.IsNullOrWhiteSpace(request.Description)) product.Description = request.Description;
            if (request.BasePrice.HasValue && request.BasePrice > 0) product.BasePrice = request.BasePrice.Value;
            product.Stock = request.Stock;
            if (!string.IsNullOrWhiteSpace(request.ThumbnailUrl)) product.ThumbnailUrl = request.ThumbnailUrl;
            if (request.CategoryId.HasValue) product.CategoryId = request.CategoryId.Value;
            product.HasVariants = request.HasVariants;
            product.UpdatedAt = DateTime.UtcNow;

            _productRepo.Update(product);
            await _productRepo.SaveChangesAsync();

            if (request.SelectedOptionValueIds is not null)
                await _productRepo.SetOptionValuesAsync(id, request.SelectedOptionValueIds);

            await _productRepo.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var product = await _productRepo.GetByIdAsync(id);
            if (product is null) return false;

            _productRepo.Remove(product);
            await _productRepo.SaveChangesAsync();
            return true;
        }

        // ────────────────────────────────────────────────── Mapping helpers ──────────────────────────────────────────────────
        private async Task<ProductDTOs.ProductDetailResponse> MapToDetailAsync(Product product)
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
                Stock = product.Stock,
                ThumbnailUrl = product.ThumbnailUrl,
                CategoryId = product.CategoryId,
                Category = MapCategory(product.Category),
                Options = GroupOptions(rawOpts),
                HasVariants = product.HasVariants,

                Variants = product.Variants.Select(v => new ProductVariantDTOs.ProductVariantResponse
                {
                    Id = v.Id,
                    VariantName = v.VariantName,
                    SKU = v.SKU,
                    Price = v.Price,
                    OriginalPrice = v.OriginalPrice,
                    Stock = v.Stock,
                    ProductId = v.ProductId,
                    Images = v.Images.OrderBy(img => img.DisplayOrder).Select(img => new ProductVariantDTOs.VariantImageDto
                    {
                        Id = img.Id,
                        ImageUrl = img.ImageUrl,
                        DisplayOrder = img.DisplayOrder,
                        IsMain = img.IsMain
                    }).ToList(),
                    OptionValues = v.ProductVariantOptionValues.Select(pvov => new ProductVariantDTOs.VariantOptionValueDto
                    {
                        OptionValueId = pvov.ProductOptionValueId,
                        OptionName = pvov.ProductOptionValue?.ProductOption?.Name ?? "",
                        Value = pvov.ProductOptionValue?.Value ?? ""
                    }).ToList()
                }).ToList()
            };
        }

        private static ProductDTOs.CategoryInfo? MapCategory(Category? c) =>
            c is null ? null : new ProductDTOs.CategoryInfo { Id = c.Id, Name = c.Name, Slug = c.Slug };

        private async Task<List<ProductListDTOs.ProductSummaryResponse>> MapToSummaryListAsync(List<Product> products)
        {
            var result = new List<ProductListDTOs.ProductSummaryResponse>(products.Count);
            foreach (var p in products)
            {
                var rawOpts = await _productRepo.GetOptionsRawAsync(p.Id);

                // Group by OptionName
                var groupedOpts = rawOpts
                    .GroupBy(o => o.OptionName)
                    .Select(g => new ProductListDTOs.ProductOptionGroupResponse
                    {
                        OptionName = g.Key,
                        Values = g.Select(x => x.Value).ToList()
                    })
                    .ToList();

                result.Add(new ProductListDTOs.ProductSummaryResponse
                {
                    Id = p.Id,
                    Name = p.Name,
                    Slug = p.Slug,
                    BasePrice = p.BasePrice,
                    Stock = p.Stock,
                    ThumbnailUrl = p.ThumbnailUrl,
                    ShortDescription = p.ShortDescription,
                    CategoryId = p.CategoryId,
                    Options = groupedOpts
                });
            }
            return result;
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
    }
}