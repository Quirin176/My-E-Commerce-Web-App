using WebApp_API.Entities;

namespace WebApp_API.DTOs
{
    public class ProductVariantDTOs
    {
        // ────────────────────────────────────────────────── Requests ──────────────────────────────────────────────────
        public class CreateProductVariantRequest
        {
            public required string VariantName { get; set; }
            public string? SKU { get; set; }
            public decimal Price { get; set; }
            public decimal OriginalPrice { get; set; }
            public int Stock { get; set; }
            public required int ProductId { get; set; }
            // public ICollection<ProductImage> Images { get; set; } = new List<ProductImage>();
            public List<string> ImageUrls { get; set; } = new();
            public List<int> OptionValueIds { get; set; } = new();
        }

        public class UpdateProductVariantRequest
        {
            public string? VariantName { get; set; }
            public string? SKU { get; set; }
            public decimal? Price { get; set; }
            public decimal? OriginalPrice { get; set; }
            public int? Stock { get; set; }

            public List<string>? ImageUrls { get; set; }
            public List<int>? OptionValueIds { get; set; }
        }

        // ────────────────────────────────────────────────── Responses ──────────────────────────────────────────────────
        public class ProductVariantResponse
        {
            public int Id { get; set; }
            public string VariantName { get; set; } = "";
            public string? SKU { get; set; } = "";
            public decimal Price { get; set; }
            public decimal OriginalPrice { get; set; }
            public int Stock { get; set; }
            public int ProductId { get; set; }
            // public ICollection<ProductImage> Images { get; set; } = new List<ProductImage>();
            public List<VariantImageDto> Images { get; set; } = new();
            public List<VariantOptionValueDto> OptionValues { get; set; } = new();
        }

        public class VariantImageDto
        {
            public int Id { get; set; }
            public string ImageUrl { get; set; } = "";
            public int DisplayOrder { get; set; }
            public bool IsMain { get; set; }
        }

        public class VariantOptionValueDto
        {
            public int OptionValueId { get; set; }
            public string OptionName { get; set; } = "";
            public string Value { get; set; } = "";
        }
    }
}