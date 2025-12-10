    namespace WebApp_API.DTOs
{
    public class UpdateProductRequest
    {
        public string? Name { get; set; }
        public string? Slug { get; set; }
        public string ShortDescription { get; set; }
        public string Description { get; set; }
        public decimal? Price { get; set; }
        public string ImageUrl { get; set; }
        public int? CategoryId { get; set; }
    }
}
