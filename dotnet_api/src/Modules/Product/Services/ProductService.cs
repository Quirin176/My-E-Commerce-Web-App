using WebApp_API.DTOs;
using WebApp_API.Entities;
using WebApp_API.Repositories;
using WebApp_API.Specifications;
using static WebApp_API.DTOs.PaginationDTOs;

namespace WebApp_API.Services
{
    public class ProductService : IProductService
    {
        private readonly IProductRepository _repo;

        public ProductService(IProductRepository repo) => _repo = repo;

        // ──────────────────── Public queries ────────────────────

        public async Task<ProductDTOs.ProductDetailResponse?> GetByIdAsync(int id)
        {
            var product = await _repo.GetByIdAsync(id);
            if (product is null) return null;
            return await MapToDetailAsync(product);
        }

        public async Task<ProductDTOs.ProductDetailResponse?> GetBySlugAsync(string slug)
        {
            var product = await _repo.GetBySlugAsync(slug);
            if (product is null) return null;
            return await MapToDetailAsync(product);
        }

        public async Task<List<ProductListDTOs.ProductSummaryResponse>> GetFilteredAsync(
            ProductListDTOs.ProductFilterParams filterParams)
        {
            var spec = ProductFilterSpec.From(filterParams);
            int? categoryId = string.IsNullOrWhiteSpace(spec.Category)
                ? null
                : await _repo.ResolveCategoryIdAsync(spec.Category);

            // If a category slug was provided but not found, return empty
            if (!string.IsNullOrWhiteSpace(spec.Category) && categoryId is null)
                return new List<ProductListDTOs.ProductSummaryResponse>();

            var products = await _repo.GetFilteredAsync(spec, categoryId);
            return await MapToSummaryListAsync(products);
        }

        public async Task<List<ProductListDTOs.ProductSummaryResponse>> GetByCategoryAsync(string categorySlug)
        {
            var categoryId = await _repo.ResolveCategoryIdAsync(categorySlug);
            if (categoryId is null) return new List<ProductListDTOs.ProductSummaryResponse>();

            var products = await _repo.GetByCategoryAsync(categoryId.Value);
            return await MapToSummaryListAsync(products);
        }

        public async Task<ProductDTOs.SearchResponse> SearchAsync(ProductListDTOs.ProductSearchParams searchParams)
        {
            var spec = ProductSearchSpec.From(searchParams);
            var (items, totalCount) = await _repo.SearchAsync(spec);

            return new ProductDTOs.SearchResponse
            {
                Success = true,
                Query = searchParams.Q,
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
                Q = q,
                PageSize = limit
            });

            var (items, _) = await _repo.SearchAsync(spec);
            return items.Select(p => p.Name).Distinct().Take(limit).ToList();
        }

        // ──────────────────── Admin queries ────────────────────

        public async Task<PaginatedResponse<ProductDTOs.ProductAdminResponse>> GetPaginatedAsync(
            ProductListDTOs.AdminProductFilterParams filterParams)
        {
            var spec = ProductFilterSpec.From(filterParams);

            if (filterParams.Page < 1) filterParams.Page = 1;
            if (filterParams.PageSize is < 1 or > 100) filterParams.PageSize = 10;

            int? categoryId = string.IsNullOrWhiteSpace(spec.Category)
                ? null
                : await _repo.ResolveCategoryIdAsync(spec.Category);

            if (!string.IsNullOrWhiteSpace(spec.Category) && categoryId is null)
                return new PaginatedResponse<ProductDTOs.ProductAdminResponse>
                {
                    Pagination = PaginationMeta.From(filterParams.Page, filterParams.PageSize, 0)
                };

            var (items, totalCount) = await _repo.GetPaginatedAsync(
                spec, categoryId, filterParams.Search, filterParams.Page, filterParams.PageSize);

            var data = await MapToAdminListAsync(items);
            return new PaginatedResponse<ProductDTOs.ProductAdminResponse>
            {
                Success = true,
                Data = data,
                Pagination = PaginationMeta.From(filterParams.Page, filterParams.PageSize, totalCount)
            };
        }

        // ──────────────────── Write operations ────────────────────

        public async Task<int> CreateAsync(ProductDTOs.CreateProductRequest request)
        {
            if (!await _repo.CategoryExistsAsync(request.CategoryId))
                throw new ArgumentException($"Category with ID {request.CategoryId} does not exist.");

            if (await _repo.SlugExistsAsync(request.Slug))
                throw new InvalidOperationException($"A product with slug '{request.Slug}' already exists.");

            if (request.SelectedOptionValueIds.Count > 0)
            {
                var valid = await _repo.GetValidOptionValueIdsForCategoryAsync(request.CategoryId);
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
                Price = request.Price,
                ImageUrl = request.ImageUrl,
                CategoryId = request.CategoryId
            };

            await _repo.AddAsync(product);
            await _repo.SaveChangesAsync();

            // Build image records (deduplicated)
            var imageUrls = BuildImageUrlList(request.ImageUrl, request.ImageUrls);
            await _repo.AddImagesAsync(imageUrls.Select((url, i) => new ProductImage
            {
                ProductId = product.Id,
                ImageUrl = url,
                DisplayOrder = i
            }));

            if (request.SelectedOptionValueIds.Count > 0)
                await _repo.SetOptionValuesAsync(product.Id, request.SelectedOptionValueIds);

            await _repo.SaveChangesAsync();
            return product.Id;
        }

        public async Task<bool> UpdateAsync(int id, ProductDTOs.UpdateProductRequest request)
        {
            var product = await _repo.GetByIdAsync(id);
            if (product is null) return false;

            if (!string.IsNullOrWhiteSpace(request.Name)) product.Name = request.Name;
            if (!string.IsNullOrWhiteSpace(request.Slug)) product.Slug = request.Slug;
            if (!string.IsNullOrWhiteSpace(request.ShortDescription)) product.ShortDescription = request.ShortDescription;
            if (!string.IsNullOrWhiteSpace(request.Description)) product.Description = request.Description;
            if (request.Price.HasValue && request.Price > 0) product.Price = request.Price.Value;
            if (!string.IsNullOrWhiteSpace(request.ImageUrl)) product.ImageUrl = request.ImageUrl;
            if (request.CategoryId.HasValue) product.CategoryId = request.CategoryId.Value;

            _repo.Update(product);
            await _repo.SaveChangesAsync();

            if (request.ImageUrls.Count > 0)
            {
                await _repo.RemoveImagesAsync(id);
                var urls = BuildImageUrlList(request.ImageUrl, request.ImageUrls);
                await _repo.AddImagesAsync(urls.Select((url, i) => new ProductImage
                {
                    ProductId = id,
                    ImageUrl = url,
                    DisplayOrder = i
                }));
            }

            if (request.SelectedOptionValueIds is not null)
                await _repo.SetOptionValuesAsync(id, request.SelectedOptionValueIds);

            await _repo.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var product = await _repo.GetByIdAsync(id);
            if (product is null) return false;

            _repo.Remove(product);
            await _repo.SaveChangesAsync();
            return true;
        }

        // ──────────────────── Mapping helpers ────────────────────
        private async Task<ProductDTOs.ProductDetailResponse> MapToDetailAsync(Product product)
        {
            var images = await _repo.GetImageUrlsAsync(product.Id);
            var rawOpts = await _repo.GetOptionsRawAsync(product.Id);

            return new ProductDTOs.ProductDetailResponse
            {
                Id = product.Id,
                Name = product.Name,
                Slug = product.Slug,
                ShortDescription = product.ShortDescription,
                Description = product.Description,
                Price = product.Price,
                ImageUrl = product.ImageUrl,
                CategoryId = product.CategoryId,
                Category = MapCategory(product.Category),
                Images = images,
                Options = GroupOptions(rawOpts)
            };
        }

        private async Task<List<ProductListDTOs.ProductSummaryResponse>> MapToSummaryListAsync(List<Product> products)
        {
            var result = new List<ProductListDTOs.ProductSummaryResponse>(products.Count);
            foreach (var p in products)
            {
                var rawOpts = await _repo.GetOptionsRawAsync(p.Id);
                result.Add(new ProductListDTOs.ProductSummaryResponse
                {
                    Id = p.Id,
                    Name = p.Name,
                    Slug = p.Slug,
                    Price = p.Price,
                    ImageUrl = p.ImageUrl,
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

        private async Task<List<ProductDTOs.ProductAdminResponse>> MapToAdminListAsync(List<Product> products)
        {
            var result = new List<ProductDTOs.ProductAdminResponse>(products.Count);
            foreach (var p in products)
            {
                var images = await _repo.GetImageUrlsAsync(p.Id);
                var rawOpts = await _repo.GetOptionsRawAsync(p.Id);
                result.Add(new ProductDTOs.ProductAdminResponse
                {
                    Id = p.Id,
                    Name = p.Name,
                    Slug = p.Slug,
                    Price = p.Price,
                    ImageUrl = p.ImageUrl,
                    ShortDescription = p.ShortDescription,
                    Description = p.Description,
                    CategoryId = p.CategoryId,
                    Category = MapCategory(p.Category),
                    Images = images,
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

        private static List<string> BuildImageUrlList(string? imageUrl, List<string> imageUrls)
        {
            var all = new List<string>();
            if (!string.IsNullOrWhiteSpace(imageUrl)) all.Add(imageUrl);
            all.AddRange(imageUrls.Where(u => !string.IsNullOrWhiteSpace(u)));
            return all.Distinct().ToList();
        }
    }
}
