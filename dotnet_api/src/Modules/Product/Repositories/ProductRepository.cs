using Microsoft.EntityFrameworkCore;
using WebApp_API.Data;
using WebApp_API.Entities;
using WebApp_API.Specifications;

namespace WebApp_API.Repositories
{
    public class ProductRepository : IProductRepository
    {
        private readonly AppDbContext _db;
        public ProductRepository(AppDbContext db) => _db = db;

        // ────────────────────────────────────────────────── Single product lookups ──────────────────────────────────────────────────
        public Task<Product?> GetByIdAsync(int id)
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

        public Task<Product?> GetBySlugAsync(string slug)
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
        public async Task<List<Product>> GetCategoryNewestAsync(int categoryId, int amount)
        {
            if (amount <= 0) return [];

            return await _db.Products.AsNoTracking()
                                     .Where(p => p.CategoryId == categoryId)
                                     .OrderByDescending(p => p.CreatedAt)
                                     .Take(amount)
                                     .ToListAsync();
        }

        public async Task<(List<Product> Items, int TotalCount)> GetPaginatedAsync(ProductFilterSpec spec)
        {
            var query = _db.Products.AsNoTracking();

            if (!string.IsNullOrWhiteSpace(spec.Search))
            {
                var term = spec.Search.Trim();
                query = query.Where(p => EF.Functions.Like(p.Name, $"%{term}%") ||
                                            EF.Functions.Like(p.Slug, $"%{term}%"));
            }

            if (spec.Category != null) query = query.Where(p => p.Category != null &&
                                                                p.Category.Slug == spec.Category);

            query = ApplyPriceFilter(query, spec.MinPrice, spec.MaxPrice);
            query = await ApplyOptionFilter(query, spec.SelectedOptionValueIds);
            query = ApplySortOrder(query, spec.SortOrder);

            // Pagination
            var totalCount = await query.CountAsync();

            var items = await query.Include(p => p.Category)
                                    .Skip((spec.Page - 1) * spec.PageSize)
                                    .Take(spec.PageSize)
                                    .ToListAsync();

            return (items, totalCount);
        }

        public async Task<(List<Product> Items, int TotalCount)> SearchAsync(ProductSearchSpec spec)
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
        public async Task<Product> AddAsync(Product product)
        {
            await _db.Products.AddAsync(product);
            return product;
        }

        public void Update(Product product) => _db.Products.Update(product);    // Update the entire product data
        public void Remove(Product product) => _db.Products.Remove(product);    // Remove the product

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

        // Returns a list of option groups: List of (OptionId + its List of OptionValueIds)
        public async Task<List<(int OptionId, List<int> OptionValueIds)>> GetOptionGroupsForValuesAsync(List<int> optionValueIds)
        {
            return (await _db.ProductOptionValues.Where(ov => optionValueIds.Contains(ov.Id))   // Get all the option values matching the provided Ids
                                                 .GroupBy(ov => ov.ProductOptionId)             // Group them by their OptionId
                                                 .Select(g => new { OptionId = g.Key, OptionValueIds = g.Select(ov => ov.Id).ToList() })    // Get the OptionId and list of OptionValueIds for each group
                                                 .ToListAsync())    // Return OptionId + List of OptionValueIds for each group
                    .Select(x => (x.OptionId, x.OptionValueIds))    // Convert to List of (OptionId, List of OptionValueIds)
                    .ToList();                                      // Return List of (OptionId, List of OptionValueIds)
        }

        public async Task<List<int>> GetProductIdsByOptionValuesAsync(List<int> optionValueIds)
        {
            return await _db.ProductFilters.Where(pf => optionValueIds.Contains(pf.OptionValueId))
                                           .Select(pf => pf.ProductId)
                                           .Distinct()
                                           .ToListAsync();
        }

        public async Task SetOptionValuesAsync(int productId, IEnumerable<int> optionValueIds)
        {
            var existing = await _db.ProductFilters.Where(pf => pf.ProductId == productId).ToListAsync();
            _db.ProductFilters.RemoveRange(existing);

            var filters = optionValueIds.Select(id => new ProductFilter
            {
                ProductId = productId,
                OptionValueId = id
            });

            await _db.ProductFilters.AddRangeAsync(filters);
        }

        public Task SaveChangesAsync() => _db.SaveChangesAsync();

        // ────────────────────────────────────────────────── Private helpers ──────────────────────────────────────────────────
        private static IQueryable<Product> ApplyPriceFilter(IQueryable<Product> query, decimal min, decimal max)
        {
            if (min > 0) query = query.Where(p => p.BasePrice >= min);
            if (max < decimal.MaxValue) query = query.Where(p => p.BasePrice <= max);
            return query;
        }

        // OR within the same option, AND between different options
        private async Task<IQueryable<Product>> ApplyOptionFilter(IQueryable<Product> query, List<int> optionValueIds)
        {
            // Validate
            if (optionValueIds.Count == 0) return query;

            // Get List of (OptionId, List of OptionValueIds)
            var optionGroups = await GetOptionGroupsForValuesAsync(optionValueIds);

            var productIds = await query.Select(p => p.Id).ToListAsync();   // Recently filtered product IDs

            foreach (var group in optionGroups)
            {
                var matching = await GetProductIdsByOptionValuesAsync(group.OptionValueIds);    // Get products that match any of the OptionValueIds in a same OptionId - OR logic
                productIds = productIds.Intersect(matching).ToList();                           // Get products that match all groups so far - AND logic
            }

            return query.Where(p => productIds.Contains(p.Id));

            // var optionGroups = await GetOptionGroupsForValuesAsync(optionValueIds);

            // foreach (var group in optionGroups)
            // {
            //     var ids = group.OptionValueIds;

            //     // Use Any for OR logic in a same Option group and Where for AND logic between groups
            //     query = query.Where(p => p.ProductFilters.Any(f => ids.Contains(f.OptionValueId)));
            // }

            // return query;
        }

        private static IQueryable<Product> ApplySortOrder(IQueryable<Product> query, string sortOrder)
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