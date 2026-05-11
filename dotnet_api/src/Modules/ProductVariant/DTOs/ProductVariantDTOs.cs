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
            public ICollection<ProductImage> Images { get; set; } = new List<ProductImage>();
        }
    }
}