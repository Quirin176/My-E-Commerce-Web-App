using WebApp_API.DTOs;
using WebApp_API.Entities;

namespace WebApp_API.Specifications
{
    // Reusable Product Sort Order Method
    public static class ProductSortSpec
    {
        public static IQueryable<Product> Apply(IQueryable<Product> query, string sortOrder) =>
            sortOrder switch
            {
                "ascending" => query.OrderBy(p => p.Price),
                "descending" => query.OrderByDescending(p => p.Price),
                "oldest" => query.OrderBy(p => p.Id),
                _ => query.OrderByDescending(p => p.Id) // "newest" default
            };
    }

    // Reusable Product Filter By Category, Min Price, Max Price, OptionValues, Sort Order Specifications
    public class ProductFilterSpec
    {
        public string? Category { get; init; }
        public decimal MinPrice { get; init; }
        public decimal MaxPrice { get; init; }
        public List<int> SelectedOptionValueIds { get; init; } = new();
        public string SortOrder { get; init; } = "newest";

        // Use in Customer Viewing Product Pages
        public static ProductFilterSpec From(ProductListDTOs.ProductFilterParams p) => new()
        {
            Category = p.Category,
            MinPrice = p.MinPrice,
            MaxPrice = p.MaxPrice,
            SelectedOptionValueIds = ParseOptionIds(p.Options),
            SortOrder = p.SortOrder
        };

        // Use in Admin Product Management Page
        public static ProductFilterSpec From(ProductListDTOs.AdminProductFilterParams p) => new()
        {
            Category = p.Category,
            MinPrice = p.MinPrice,
            MaxPrice = p.MaxPrice,
            SelectedOptionValueIds = ParseOptionIds(p.Options),
            SortOrder = p.SortOrder
        };

        private static List<int> ParseOptionIds(string? raw)
        {
            if (string.IsNullOrWhiteSpace(raw))
            {
                return new List<int>();
            }

            return raw.Split(',')
                     .Select(s => int.TryParse(s.Trim(), out var id) ? (int?)id : null)
                     .Where(id => id.HasValue)
                     .Select(id => id!.Value)
                     .ToList();
        }
    }

    // Holds parsed search parameters for the public search endpoint.
    public class ProductSearchSpec
    {
        public string Query { get; init; } = "";
        public int Page { get; init; } = 1;
        public int PageSize { get; init; } = 10;
        public decimal MinPrice { get; init; }
        public decimal MaxPrice { get; init; }
        public string SortOrder { get; init; } = "relevance";

        public static ProductSearchSpec From(ProductListDTOs.ProductSearchParams p)
        {
            var q = p.Q?.Trim() ?? "";
            if (q.Length > 200) q = q[..200];

            return new ProductSearchSpec
            {
                Query = q.ToLower(),
                Page = Math.Max(1, p.Page),
                PageSize = Math.Clamp(p.PageSize, 1, 100),
                MinPrice = p.MinPrice,
                MaxPrice = p.MaxPrice,
                SortOrder = p.SortOrder
            };
        }
    }

    // Encapsulates filtering by category slug for the public category endpoint.
    public class ProductByCategorySpec
    {
        public string CategorySlug { get; init; } = "";

        public static ProductByCategorySpec From(string slug) => new() { CategorySlug = slug };
    }
}