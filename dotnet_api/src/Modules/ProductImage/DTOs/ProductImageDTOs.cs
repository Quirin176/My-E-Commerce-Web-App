namespace WebApp_API.DTOs
{
    public class ProductImageDTOs
    {
        public record ImageUrlDto(string ImageUrl, int DisplayOrder, bool IsMain);
        // ────────────────────────────────────────────────── Requests ──────────────────────────────────────────────────
        public class AddProductImageRequest
        {
            public required string ImageUrl { get; set; }
            public int DisplayOrder { get; set; }
            public bool IsMain { get; set; }
            public int ProductId { get; set; }
            public int VariantId { get; set; }
        }
    }
}