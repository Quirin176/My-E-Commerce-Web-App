namespace WebApp_API.Modules.ProductImages.DTOs
{
    // ────────────────────────────────────────────────── Responses ──────────────────────────────────────────────────
    public record ImageUrlDto(string ImageUrl, int DisplayOrder, bool IsMain);  // Used in Product Detail Response DTO

    public class ProductImageResponse
    {
        public int Id { get; set; }

        public required string ImageUrl { get; set; }
        public int DisplayOrder { get; set; }
        public bool IsMain { get; set; }

        public int? ProductId { get; set; }
        public int? VariantId { get; set; }
    }

    // ────────────────────────────────────────────────── Requests ──────────────────────────────────────────────────
    public class AddProductImageRequest
    {
        public required string ImageUrl { get; set; }
        public int DisplayOrder { get; set; }
        public bool IsMain { get; set; }
        public int ProductId { get; set; }
        public int VariantId { get; set; }
    }

    public class ProductImageUpdateRequest
    {
        public required string ImageUrl { get; set; }
        public int DisplayOrder { get; set; }
        public bool IsMain { get; set; }
    }
}