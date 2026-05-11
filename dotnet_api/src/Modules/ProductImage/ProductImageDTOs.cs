namespace WebApp_API
{
    public class ProductImageDTOs
    {
        public record ImageUrlDto(string ImageUrl, int DisplayOrder, bool IsMain);
    }
}