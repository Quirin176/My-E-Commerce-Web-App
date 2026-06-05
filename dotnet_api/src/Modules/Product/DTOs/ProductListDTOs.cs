namespace WebApp_API.DTOs
{
    public class ProductListDTOs
    {
        // ────────────────────────────────────────────────── Responses ──────────────────────────────────────────────────
        // Lightweight summary used in list / filter / search results
        public class ProductSummaryResponse
        {
            public int Id { get; set; }
            public string Name { get; set; } = "";
            public string Slug { get; set; } = "";
            public decimal BasePrice { get; set; }
            public int Stock { get; set; }
            public string? ThumbnailUrl { get; set; }
            public string? ShortDescription { get; set; }
            public int CategoryId { get; set; }
            public List<ProductOptionGroupResponse> Options { get; set; } = new();
        }

        public class ProductOptionGroupResponse
        {
            public string OptionName { get; set; } = "";
            public List<string> Values { get; set; } = new List<string>();
        }

        // Product Filter Params
        public class ProductFilterParams
        {
            public string? Category { get; set; }
            public decimal MinPrice { get; set; } = 0;
            public decimal MaxPrice { get; set; } = decimal.MaxValue;
            public string? selectedOptions { get; set; }    // Comma-separated ProductOptionValue IDs, e.g. "1,3,7".
            public string SortOrder { get; set; } = "newest";
            public int Page { get; set; } = 1;
            public int PageSize { get; set; } = 10;
            public string? Search { get; set; }
        }

        // Query parameters for the public search endpoint.
        public class ProductSearchParams
        {
            public string QueryPhrase { get; set; } = "";
            public int Page { get; set; } = 1;
            public int PageSize { get; set; } = 10;
            public decimal MinPrice { get; set; } = 0;
            public decimal MaxPrice { get; set; } = decimal.MaxValue;
            public string SortOrder { get; set; } = "relevance";
        }
    }
}