namespace WebApp_API.DTOs
{
    public class ProductDTOs
    {
        // ────────────────────────────────────────────────── Requests ──────────────────────────────────────────────────
        public class CreateProductRequest
        {
            public required string Name { get; set; }
            public required string Slug { get; set; }
            public string? ShortDescription { get; set; }
            public string? Description { get; set; }
            public decimal BasePrice { get; set; }
            public string? ThumbnailUrl { get; set; }
            public required int CategoryId { get; set; }
            public List<int> SelectedOptionValueIds { get; set; } = new();
            public bool HasVariants { get; set; }
        }

        public class UpdateProductRequest
        {
            public required string Name { get; set; }
            public required string Slug { get; set; }
            public string? ShortDescription { get; set; }
            public string? Description { get; set; }
            public decimal? BasePrice { get; set; }
            public string? ThumbnailUrl { get; set; }
            public int? CategoryId { get; set; }
            public List<int> SelectedOptionValueIds { get; set; } = new();
            public bool HasVariants { get; set; }
        }

        // ────────────────────────────────────────────────── Responses ──────────────────────────────────────────────────
        // Full product detail (Product's detail page, admin product edit)
        public class ProductDetailResponse
        {
            public int Id { get; set; }
            public string Name { get; set; } = "";
            public string Slug { get; set; } = "";
            public string? ShortDescription { get; set; }
            public string? Description { get; set; }
            public decimal BasePrice { get; set; }
            public string? ThumbnailUrl { get; set; }
            public int CategoryId { get; set; }
            public CategoryInfo? Category { get; set; }
            public List<ProductImageDTOs.ImageUrlDto> Images { get; set; } = new();
            public List<ProductOptionGroupResponse> Options { get; set; } = new();
            public bool HasVariants { get; set; }
        }

        // ────────────────────────────────────────────────── Nested types ──────────────────────────────────────────────────

        public class CategoryInfo
        {
            public int Id { get; set; }
            public string Name { get; set; } = "";
            public string Slug { get; set; } = "";
        }

        public class ProductOptionGroupResponse
        {
            public int OptionId { get; set; }
            public string OptionName { get; set; } = "";
            public List<ProductOptionValueItem> OptionValues { get; set; } = new();
        }

        public class ProductOptionValueItem
        {
            public int OptionValueId { get; set; }
            public string Value { get; set; } = "";
        }

        public class SearchResponse
        {
            public bool Success { get; set; } = true;
            public string Query { get; set; } = "";
            public int TotalCount { get; set; }
            public int PageNumber { get; set; }
            public int PageSize { get; set; }
            public int TotalPages { get; set; }
            public bool HasNextPage { get; set; }
            public bool HasPreviousPage { get; set; }
            public List<ProductListDTOs.ProductSummaryResponse> Products { get; set; } = new();
        }
    }
}