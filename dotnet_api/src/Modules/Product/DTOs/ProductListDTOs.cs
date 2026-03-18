namespace WebApp_API.DTOs
{
    public class ProductListDTOs
    {
        /// <summary>Lightweight summary used in list / filter / search results.</summary>
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

        /// <summary>Query parameters shared by public filter and admin paginated endpoints.</summary>
        public class ProductFilterParams
        {
            public string? Category { get; set; }
            public decimal MinPrice { get; set; } = 0;
            public decimal MaxPrice { get; set; } = decimal.MaxValue;

            /// <summary>Comma-separated ProductOptionValue IDs, e.g. "1,3,7".</summary>
            public string? Options { get; set; }

            public string SortOrder { get; set; } = "newest";
        }

        /// <summary>Admin-only extensions on top of the base filter.</summary>
        public class AdminProductFilterParams : ProductFilterParams
        {
            public int Page { get; set; } = 1;
            public int PageSize { get; set; } = 10;
            public string? Search { get; set; }
        }

        /// <summary>Query parameters for the public search endpoint.</summary>
        public class ProductSearchParams
        {
            public string Q { get; set; } = "";
            public int Page { get; set; } = 1;
            public int PageSize { get; set; } = 10;
            public decimal MinPrice { get; set; } = 0;
            public decimal MaxPrice { get; set; } = decimal.MaxValue;
            public string SortOrder { get; set; } = "relevance";
        }
    }
}