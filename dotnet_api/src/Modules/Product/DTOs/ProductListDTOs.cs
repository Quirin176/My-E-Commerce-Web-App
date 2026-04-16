namespace WebApp_API.DTOs
{
    public class ProductListDTOs
    {
        /// Lightweight summary used in list / filter / search results
        public class ProductSummaryResponse
        {
            public int Id { get; set; }
            public string Name { get; set; } = "";
            public string Slug { get; set; } = "";
            public decimal Price { get; set; }
            public string? ImageUrl { get; set; }
            public string? ShortDescription { get; set; }
            public int CategoryId { get; set; }
            public List<ProductOptionFlatResponse> Options { get; set; } = new();
        }

        public class ProductOptionFlatResponse
        {
            public string OptionName { get; set; } = "";
            public string Value { get; set; } = "";
        }

        /// Query parameters shared by public filter and admin paginated endpoints.
        public class ProductFilterParams
        {
            public string? Category { get; set; }
            public decimal MinPrice { get; set; } = 0;
            public decimal MaxPrice { get; set; } = decimal.MaxValue;
            public string? Options { get; set; }    // Comma-separated ProductOptionValue IDs, e.g. "1,3,7".
            public string SortOrder { get; set; } = "newest";
        }

        /// Admin-only extensions on top of the base filter.
        public class AdminProductFilterParams
        {
            public string? Category { get; set; }
            public decimal MinPrice { get; set; } = 0;
            public decimal MaxPrice { get; set; } = decimal.MaxValue;
            public string? Options { get; set; }    // Comma-separated ProductOptionValue IDs, e.g. "1,3,7".
            public string SortOrder { get; set; } = "newest";
            public int Page { get; set; } = 1;
            public int PageSize { get; set; } = 10;
            public string? Search { get; set; }
        }

        /// Query parameters for the public search endpoint.
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