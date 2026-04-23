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
        public Task<Product?> GetByIdAsync(int id) =>
            _db.Products.Include(p => p.Category).FirstOrDefaultAsync(p => p.Id == id);

        public Task<Product?> GetBySlugAsync(string slug) =>
            _db.Products.Include(p => p.Category).FirstOrDefaultAsync(p => p.Slug == slug);

        // ────────────────────────────────────────────────── List queries ──────────────────────────────────────────────────
        public async Task<List<Product>> GetFilteredAsync(ProductFilterSpec spec, int? resolvedCategoryId)
        {
            var query = _db.Products.Include(p => p.Category).AsQueryable();

            if (resolvedCategoryId.HasValue)
                query = query.Where(p => p.CategoryId == resolvedCategoryId.Value);

            query = ApplyPriceFilter(query, spec.MinPrice, spec.MaxPrice);
            query = await ApplyOptionFilter(query, spec.SelectedOptionValueIds);
            query = ProductSortSpec.Apply(query, spec.SortOrder);

            return await query.ToListAsync();
        }

        public async Task<(List<Product> Items, int TotalCount)> GetPaginatedAsync(ProductFilterSpec spec)
        {
            var query = _db.Products.Include(p => p.Category).AsQueryable();

            if (!string.IsNullOrWhiteSpace(spec.Search))
            {
                var term = spec.Search.ToLower().Trim();
                query = query.Where(p =>
                    p.Name.ToLower().Contains(term) ||
                    p.Slug.ToLower().Contains(term));
            }

            if (spec.Category != null)
                query = query.Where(p => p.Category.Slug == spec.Category);

            query = ApplyPriceFilter(query, spec.MinPrice, spec.MaxPrice);
            query = await ApplyOptionFilter(query, spec.SelectedOptionValueIds);
            query = ProductSortSpec.Apply(query, spec.SortOrder);

            // Pagination
            var totalCount = await query.CountAsync();

            var items = await query
                .Skip((spec.Page - 1) * spec.PageSize)
                .Take(spec.PageSize)
                .ToListAsync();

            return (items, totalCount);
        }

        public async Task<(List<Product> Items, int TotalCount)> SearchAsync(ProductSearchSpec spec)
        {
            var query = _db.Products
                .Include(p => p.Category)
                .Where(p =>
                    p.Name.ToLower().Contains(spec.Query) ||
                    (p.ShortDescription != null && p.ShortDescription.ToLower().Contains(spec.Query)) ||
                    (p.Description != null && p.Description.ToLower().Contains(spec.Query)) ||
                    (p.Category != null && p.Category.Name.ToLower().Contains(spec.Query)));

            query = ApplyPriceFilter(query, spec.MinPrice, spec.MaxPrice);

            query = spec.SortOrder switch
            {
                "price_asc" => query.OrderBy(p => p.Price),
                "price_desc" => query.OrderByDescending(p => p.Price),
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

        public async Task<List<Product>> GetByCategoryAsync(int categoryId) =>
            await _db.Products
                .Where(p => p.CategoryId == categoryId)
                .Include(p => p.Category)
                .OrderByDescending(p => p.Id)
                .ToListAsync();

        // ────────────────────────────────────────────────── Related data ──────────────────────────────────────────────────
        public async Task<List<string>> GetImageUrlsAsync(int productId) =>
            await _db.ProductImages
                .Where(pi => pi.ProductId == productId)
                .OrderBy(pi => pi.DisplayOrder)
                .Select(pi => pi.ImageUrl)
                .ToListAsync();

        public async Task<List<(int OptionId, string OptionName, int ValueId, string Value)>> GetOptionsRawAsync(int productId) =>
            await _db.ProductFilters
                .Where(pf => pf.ProductId == productId)
                .Select(pf => new
                {
                    pf.OptionValue.ProductOption.Id,
                    pf.OptionValue.ProductOption.Name,
                    ValueId = pf.OptionValue.Id,
                    pf.OptionValue.Value
                })
                .ToListAsync()
                .ContinueWith(t => t.Result.Select(x => (x.Id, x.Name, x.ValueId, x.Value)).ToList());

        public async Task<List<(int OptionId, List<int> ValueIds)>> GetOptionGroupsForValuesAsync(List<int> valueIds) =>
            (await _db.ProductOptionValues
                .Where(pov => valueIds.Contains(pov.Id))
                .GroupBy(pov => pov.ProductOptionId)
                .Select(g => new { OptionId = g.Key, ValueIds = g.Select(pov => pov.Id).ToList() })
                .ToListAsync())
            .Select(x => (x.OptionId, x.ValueIds))
            .ToList();

        public async Task<List<int>> GetProductIdsByOptionValuesAsync(List<int> optionValueIds) =>
            await _db.ProductFilters
                .Where(pf => optionValueIds.Contains(pf.OptionValueId))
                .Select(pf => pf.ProductId)
                .Distinct()
                .ToListAsync();

        // ────────────────────────────────────────────────── Category resolution ──────────────────────────────────────────────────
        public async Task<int?> ResolveCategoryIdAsync(string slug)
        {
            var category = await _db.Categories.FirstOrDefaultAsync(c => c.Slug == slug);
            return category?.Id;
        }

        public Task<bool> CategoryExistsAsync(int id) =>
            _db.Categories.AnyAsync(c => c.Id == id);

        // ────────────────────────────────────────────────── Validation helpers ──────────────────────────────────────────────────
        public Task<bool> SlugExistsAsync(string slug) =>
            _db.Products.AnyAsync(p => p.Slug == slug);

        public async Task<List<int>> GetValidOptionValueIdsForCategoryAsync(int categoryId) =>
            await _db.ProductOptionValues
                .Where(pov => _db.ProductOptions
                    .Where(po => po.CategoryId == categoryId)
                    .Select(po => po.Id)
                    .Contains(pov.ProductOptionId))
                .Select(pov => pov.Id)
                .ToListAsync();

        // ────────────────────────────────────────────────── Write operations ──────────────────────────────────────────────────
        public async Task AddAsync(Product product) => await _db.Products.AddAsync(product);

        public void Update(Product product) => _db.Products.Update(product);

        public void Remove(Product product) => _db.Products.Remove(product);

        public async Task AddImagesAsync(IEnumerable<ProductImage> images) =>
            await _db.ProductImages.AddRangeAsync(images);

        public async Task RemoveImagesAsync(int productId)
        {
            var existing = await _db.ProductImages.Where(pi => pi.ProductId == productId).ToListAsync();
            _db.ProductImages.RemoveRange(existing);
        }

        public async Task SetOptionValuesAsync(int productId, IEnumerable<int> optionValueIds)
        {
            var existing = await _db.ProductFilters.Where(pf => pf.ProductId == productId).ToListAsync();
            _db.ProductFilters.RemoveRange(existing);

            await _db.ProductFilters.AddRangeAsync(
                optionValueIds.Select(id => new ProductFilter { ProductId = productId, OptionValueId = id }));
        }

        public Task SaveChangesAsync() => _db.SaveChangesAsync();

        // ────────────────────────────────────────────────── Private helpers ──────────────────────────────────────────────────
        private static IQueryable<Product> ApplyPriceFilter(IQueryable<Product> query, decimal min, decimal max)
        {
            if (min > 0) query = query.Where(p => p.Price >= min);
            if (max < decimal.MaxValue) query = query.Where(p => p.Price <= max);
            return query;
        }

        // OR within the same option, AND between different options
        private async Task<IQueryable<Product>> ApplyOptionFilter(IQueryable<Product> query, List<int> selectedValueIds)
        {
            if (selectedValueIds.Count == 0) return query;

            var groups = await GetOptionGroupsForValuesAsync(selectedValueIds);
            var productIds = await query.Select(p => p.Id).ToListAsync();

            foreach (var (_, valueIds) in groups)
            {
                var matching = await GetProductIdsByOptionValuesAsync(valueIds);
                productIds = productIds.Intersect(matching).ToList();
            }

            return query.Where(p => productIds.Contains(p.Id));
        }
    }
}