using WebApp_API.DTOs;
using WebApp_API.Entities;
using WebApp_API.Repositories;
using WebApp_API.Specifications;
using static WebApp_API.DTOs.PaginationDTOs;

namespace WebApp_API.Services
{
    public class ProductService : IProductService
    {
        private readonly IProductRepository _productRepo;

        public ProductService(IProductRepository productRepo)
        {
            _productRepo = productRepo;
        }

        // ──────────────────── Public queries ────────────────────

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

        public async Task<List<ProductListDTOs.ProductSummaryResponse>> GetFilteredAsync(
            ProductListDTOs.ProductFilterParams filterParams)
        {
            var spec = ProductFilterSpec.From(filterParams);
            int? categoryId = string.IsNullOrWhiteSpace(spec.Category)
                ? null
                : await _productRepo.ResolveCategoryIdAsync(spec.Category);

            // If a category slug was provided but not found, return empty
            if (!string.IsNullOrWhiteSpace(spec.Category) && categoryId is null)
                return new List<ProductListDTOs.ProductSummaryResponse>();

            var products = await _productRepo.GetFilteredAsync(spec, categoryId);
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

        // ──────────────────── Admin queries ────────────────────

        public async Task<PaginatedResponse<ProductDTOs.ProductPaginatedResponse>> GetPaginatedAsync(ProductFilterSpec spec)
        {
            var (items, totalCount) = await _productRepo.GetPaginatedAsync(spec);

            var data = await MapToAdminListAsync(items);
            return new PaginatedResponse<ProductDTOs.ProductPaginatedResponse>
            {
                Success = true,
                Data = data,
                Pagination = PaginationMeta.From(spec.Page, spec.PageSize, totalCount)
            };
        }

        // ──────────────────── Write operations ────────────────────
        public async Task CreateAsync(ProductDTOs.CreateProductRequest request)
        {
            if (!await _productRepo.CategoryExistsAsync(request.CategoryId))
                throw new ArgumentException($"Category with ID {request.CategoryId} does not exist.");

            if (await _productRepo.SlugExistsAsync(request.Slug))
                throw new InvalidOperationException($"A product with slug '{request.Slug}' already exists.");

            if (request.SelectedOptionValueIds.Count > 0)
            {
                var valid = await _productRepo.GetValidOptionValueIdsForCategoryAsync(request.CategoryId);
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
                ThumbnailUrl = request.ThumbnailUrl,
                CategoryId = request.CategoryId,
                HasVariants = request.HasVariants,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            await _productRepo.AddAsync(product);
            await _productRepo.SaveChangesAsync();

            // ── Option values (filters) ───────────────────────────────────────────
            if (request.SelectedOptionValueIds.Count > 0)
                await _productRepo.SetOptionValuesAsync(product.Id, request.SelectedOptionValueIds);

            await _productRepo.SaveChangesAsync();
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

        // ──────────────────── Mapping helpers ────────────────────
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
                ThumbnailUrl = product.ThumbnailUrl,
                CategoryId = product.CategoryId,
                Category = MapCategory(product.Category),
                Options = GroupOptions(rawOpts),
                HasVariants = product.HasVariants
            };
        }

        private async Task<List<ProductListDTOs.ProductSummaryResponse>> MapToSummaryListAsync(List<Product> products)
        {
            var result = new List<ProductListDTOs.ProductSummaryResponse>(products.Count);
            foreach (var p in products)
            {
                var rawOpts = await _productRepo.GetOptionsRawAsync(p.Id);
                result.Add(new ProductListDTOs.ProductSummaryResponse
                {
                    Id = p.Id,
                    Name = p.Name,
                    Slug = p.Slug,
                    Price = p.BasePrice,
                    ImageUrl = p.ThumbnailUrl,
                    ShortDescription = p.ShortDescription,
                    CategoryId = p.CategoryId,
                    Options = rawOpts.Select(o => new ProductListDTOs.ProductOptionFlatResponse
                    {
                        OptionName = o.OptionName,
                        Value = o.Value
                    }).ToList()
                });
            }
            return result;
        }

        private async Task<List<ProductDTOs.ProductPaginatedResponse>> MapToAdminListAsync(List<Product> products)
        {
            var result = new List<ProductDTOs.ProductPaginatedResponse>(products.Count);
            foreach (var p in products)
            {
                // var images = await _productImageRepo.GetImageUrlsByProductAsync(p.Id);
                var rawOpts = await _productRepo.GetOptionsRawAsync(p.Id);
                result.Add(new ProductDTOs.ProductPaginatedResponse
                {
                    Id = p.Id,
                    Name = p.Name,
                    Slug = p.Slug,
                    Price = p.BasePrice,
                    ImageUrl = p.ThumbnailUrl,
                    // ShortDescription = p.ShortDescription,
                    // Description = p.Description,
                    // CategoryId = p.CategoryId,
                    // Category = MapCategory(p.Category),
                    // Images = images,
                    Options = GroupOptions(rawOpts)
                });
            }
            return result;
        }

        private static ProductDTOs.CategoryInfo? MapCategory(Category? c) =>
            c is null ? null : new ProductDTOs.CategoryInfo { Id = c.Id, Name = c.Name, Slug = c.Slug };

        private static List<ProductDTOs.ProductOptionGroupResponse> GroupOptions(
            List<(int OptionId, string OptionName, int ValueId, string Value)> raw) =>
            raw.GroupBy(o => new { o.OptionId, o.OptionName })
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
