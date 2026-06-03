using WebApp_API.DTOs;

namespace WebApp_API.Specifications
{
    // Product Filter By Category, Min Price, Max Price, OptionValues, Sort Order Specifications
    public class ProductFilterSpec
    {
        public string? Category { get; init; }
        public decimal MinPrice { get; init; }
        public decimal MaxPrice { get; init; }
        public List<int> SelectedOptionValueIds { get; init; } = new();
        public string SortOrder { get; init; } = "newest";
        public string? Search { get; init; }
        public int Page { get; init; } = 1;
        public int PageSize { get; init; } = 10;

        // Converts client's query parameters ProductFilterParams into a ProductFilterSpec instance used in service/repository layers.
        public static ProductFilterSpec From(ProductListDTOs.ProductFilterParams p) => new()
        {
            Category = p.Category,
            MinPrice = p.MinPrice,
            MaxPrice = p.MaxPrice,
            SelectedOptionValueIds = ParseOptionIds(p.selectedOptions),
            SortOrder = p.SortOrder,
            Search = p.Search,
            Page = p.Page,
            PageSize = p.PageSize
        };

        // Parses a comma-separated string of option value IDs into a list of integers.
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
            var q = p.QueryPhrase?.Trim() ?? "";
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
}