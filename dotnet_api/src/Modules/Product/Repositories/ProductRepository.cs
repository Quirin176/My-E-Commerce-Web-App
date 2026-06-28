using Microsoft.EntityFrameworkCore;
using WebApp_API.Data;
using WebApp_API.Entities;
using WebApp_API.Modules.Products.Specifications;

namespace WebApp_API.Modules.Products.Repositories
{
    public class ProductRepository : IProductRepository
    {
        private readonly AppDbContext _db;
        public ProductRepository(AppDbContext db) => _db = db;

        // ────────────────────────────────────────────────── Single product lookups ──────────────────────────────────────────────────
        public Task<Entities.Product?> GetByIdAsync(int id)
        {
            return _db.Products.AsNoTracking()
                        .Include(p => p.Category)

                        .Include(p => p.Variants)
                            .ThenInclude(v => v.Images)

                        .Include(p => p.Variants)
                            .ThenInclude(v => v.ProductVariantOptionValues)
                                .ThenInclude(vov => vov.ProductOptionValue)
                                    .ThenInclude(pov => pov!.ProductOption)

                        .FirstOrDefaultAsync(p => p.Id == id);
        }

        public Task<Entities.Product?> GetBySlugAsync(string slug)
        {
            return _db.Products.AsNoTracking()
                        .Include(p => p.Category)

                        .Include(p => p.Variants)
                            .ThenInclude(v => v.Images)

                        .Include(p => p.Variants)
                            .ThenInclude(v => v.ProductVariantOptionValues)
                                .ThenInclude(vov => vov.ProductOptionValue)
                                    .ThenInclude(pov => pov!.ProductOption)

                        .FirstOrDefaultAsync(p => p.Slug == slug);
        }

        // ────────────────────────────────────────────────── List queries ──────────────────────────────────────────────────
        public async Task<List<Entities.Product>> GetByIdsAsync(IEnumerable<int> productIds)
        {
            var ids = productIds.ToList();

            return await _db.Products.Where(p => ids.Contains(p.Id))
                                                    .ToListAsync();
        }

        public async Task<List<Entities.Product>> GetCategoryNewestAsync(int categoryId, int amount)
        {
            if (amount <= 0) return [];

            return await _db.Products.AsNoTracking()
                                     .Where(p => p.CategoryId == categoryId)
                                     .OrderByDescending(p => p.CreatedAt)
                                     .Take(amount)
                                     .ToListAsync();
        }

        public async Task<List<Entities.Product>> GetTopSellingProducts(int categoryId, int amount)
        {
            var topProductIds = await _db.OrderItems.Where(oi => oi.Product.CategoryId == categoryId)
                                                    .GroupBy(oi => oi.ProductId)
                                                    .Select(g => new
                                                    {
                                                        ProductId = g.Key,
                                                        TotalQuantity = g.Sum(x => x.Quantity)
                                                    })
                                                    .OrderByDescending(x => x.TotalQuantity)
                                                    .Take(amount)
                                                    .Select(x => x.ProductId)
                                                    .ToListAsync();

            var products = await _db.Products.Where(p => topProductIds.Contains(p.Id)).ToListAsync();

            return products;
        }

        public async Task<(List<Entities.Product> Items, int TotalCount)> GetPaginatedAsync(ProductFilterSpec spec)
        {
            var query = await BuildFilteredQueryAsync(spec, includeDeleted: false);

            // Pagination
            var totalCount = await query.CountAsync();

            var items = await query.Include(p => p.Category)
                                    .Skip((spec.Page - 1) * spec.PageSize)
                                    .Take(spec.PageSize)
                                    .ToListAsync();

            return (items, totalCount);
        }

        public async Task<(List<Entities.Product> Items, int TotalCount)> GetSoftDeletedPaginatedAsync(ProductFilterSpec spec)
        {
            var query = await BuildFilteredQueryAsync(spec, includeDeleted: true);

            // Pagination
            var totalCount = await query.CountAsync();

            var items = await query.Include(p => p.Category)
                                    .Skip((spec.Page - 1) * spec.PageSize)
                                    .Take(spec.PageSize)
                                    .ToListAsync();

            return (items, totalCount);
        }

        public async Task<(List<Entities.Product> Items, int TotalCount)> SearchAsync(ProductSearchSpec spec)
        {
            // Search matches query from name, description, and category name
            var term = spec.Query.Trim();

            var query = _db.Products.AsNoTracking()
                                    .Include(p => p.Category)
                                    .Where(p => EF.Functions.Like(p.Name, $"%{term}%") ||
                                          (p.ShortDescription != null && EF.Functions.Like(p.ShortDescription, $"%{term}%")) ||
                                          (p.Description != null && EF.Functions.Like(p.Description, $"%{term}%")) ||
                                          (p.Category != null && EF.Functions.Like(p.Category.Name, $"%{term}%")));

            query = ApplyPriceFilter(query, spec.MinPrice, spec.MaxPrice);

            query = spec.SortOrder switch
            {
                "price_asc" => query.OrderBy(p => p.BasePrice),
                "price_desc" => query.OrderByDescending(p => p.BasePrice),
                "newest" => query.OrderByDescending(p => p.Id),
                "name" => query.OrderBy(p => p.Name),
                _ => query.OrderByDescending(p => p.Id)
            };

            var totalCount = await query.CountAsync();
            var items = await query
                .Skip((spec.Page - 1) * spec.PageSize)
                .Take(spec.PageSize)
                .ToListAsync();

            return (items, totalCount);
        }

        // ────────────────────────────────────────────────── Validation helpers ──────────────────────────────────────────────────
        // Checks if a product with the same slug already exists when creating a new product
        public Task<bool> CheckProductExistsBySlugAsync(string slug) =>
            _db.Products.AnyAsync(p => p.Slug == slug);

        // ────────────────────────────────────────────────── Write operations ──────────────────────────────────────────────────
        public async Task<Entities.Product> AddAsync(Entities.Product product)
        {
            await _db.Products.AddAsync(product);
            return product;
        }

        public void Update(Entities.Product product) => _db.Products.Update(product);    // Update the entire product data
        public void Remove(Entities.Product product) => _db.Products.Remove(product);    // Remove the product

        // ────────────────────────────────────────────────── Related data ──────────────────────────────────────────────────
        public async Task<List<(int OptionId, string OptionName, int ValueId, string Value)>> GetOptionsRawAsync(int productId)
        {
            var data = await _db.ProductFilters
                .Where(pf => pf.ProductId == productId)
                .Select(pf => new
                {
                    pf.OptionValue.ProductOption.Id,
                    pf.OptionValue.ProductOption.Name,
                    ValueId = pf.OptionValue.Id,
                    pf.OptionValue.Value
                })
                .ToListAsync();

            return data.Select(d => (d.Id, d.Name, d.ValueId, d.Value))
                       .ToList();
        }

        public async Task<List<(int ProductId, int OptionId, string OptionName, int ValueId, string Value)>> GetOptionsRawForProductsAsync(IEnumerable<int> productIds)
        {
            var ids = productIds.Where(id => id > 0).Distinct().ToList();
            if (ids.Count == 0)
                return new List<(int ProductId, int OptionId, string OptionName, int ValueId, string Value)>();

            var data = await _db.ProductFilters
                .Where(pf => ids.Contains(pf.ProductId))
                .Select(pf => new
                {
                    pf.ProductId,
                    pf.OptionValue.ProductOption.Id,
                    pf.OptionValue.ProductOption.Name,
                    ValueId = pf.OptionValue.Id,
                    pf.OptionValue.Value
                })
                .ToListAsync();

            return data.Select(d => (d.ProductId, d.Id, d.Name, d.ValueId, d.Value))
                       .ToList();
        }

        public async Task SetOptionValuesAsync(Entities.Product product, IEnumerable<int> optionValueIds)
        {
            if (product.Id > 0)
            {
                var existing = await _db.ProductFilters.Where(pf => pf.ProductId == product.Id).ToListAsync();
                _db.ProductFilters.RemoveRange(existing);
            }

            var values = optionValueIds.Distinct();
            var filters = values.Select(id => new ProductFilter
            {
                Product = product,
                OptionValueId = id
            });

            await _db.ProductFilters.AddRangeAsync(filters);
        }

        public Task SaveChangesAsync() => _db.SaveChangesAsync();

        // ────────────────────────────────────────────────── Private helpers ──────────────────────────────────────────────────
        private async Task<IQueryable<Entities.Product>> BuildFilteredQueryAsync(ProductFilterSpec spec, bool includeDeleted)
        {
            var query = _db.Products.AsNoTracking();

            query = query.Where(p => p.IsDeleted == includeDeleted);

            if (!string.IsNullOrWhiteSpace(spec.Search))
            {
                var term = spec.Search.Trim();
                query = query.Where(p =>
                    EF.Functions.Like(p.Name, $"%{term}%") ||
                    EF.Functions.Like(p.Slug, $"%{term}%"));
            }

            if (spec.Category != null)
            {
                query = query.Where(p =>
                    p.Category != null &&
                    p.Category.Slug == spec.Category);
            }

            query = ApplyPriceFilter(query, spec.MinPrice, spec.MaxPrice);
            query = await ApplyOptionFilter(query, spec.SelectedOptionValueIds);
            query = ApplySortOrder(query, spec.SortOrder);

            return query;
        }

        private static IQueryable<Entities.Product> ApplyPriceFilter(IQueryable<Entities.Product> query, decimal min, decimal max)
        {
            if (min > 0) query = query.Where(p => p.BasePrice >= min);
            if (max < decimal.MaxValue) query = query.Where(p => p.BasePrice <= max);
            return query;
        }

        // OR within the same option, AND between different options
        private async Task<IQueryable<Entities.Product>> ApplyOptionFilter(IQueryable<Entities.Product> query, List<int> optionValueIds)
        {
            if (optionValueIds.Count == 0) return query;

            var optionGroupCount = await _db.ProductOptionValues
                .Where(ov => optionValueIds.Contains(ov.Id))
                .Select(ov => ov.ProductOptionId)
                .Distinct()
                .CountAsync();

            if (optionGroupCount == 0)
                return query.Where(p => false);

            var matchingProductIds = await _db.ProductFilters
                .Where(pf => optionValueIds.Contains(pf.OptionValueId))
                .Join(
                    _db.ProductOptionValues,
                    pf => pf.OptionValueId,
                    ov => ov.Id,
                    (pf, ov) => new { pf.ProductId, ov.ProductOptionId })
                .Distinct()
                .GroupBy(x => x.ProductId)
                .Where(g => g.Count() == optionGroupCount)
                .Select(g => g.Key)
                .ToListAsync();

            if (matchingProductIds.Count == 0)
                return query.Where(p => false);

            return query.Where(p => matchingProductIds.Contains(p.Id));
        }

        private static IQueryable<Entities.Product> ApplySortOrder(IQueryable<Entities.Product> query, string sortOrder)
        {
            return sortOrder switch
            {
                "ascending" => query.OrderBy(p => p.BasePrice),
                "descending" => query.OrderByDescending(p => p.BasePrice),
                "oldest" => query.OrderBy(p => p.Id),
                _ => query.OrderByDescending(p => p.Id) // "newest" default
            };
        }
    }
}