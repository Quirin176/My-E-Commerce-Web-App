    namespace WebApp_API.DTOs
{
    public class CreateProductRequest
    {
        public string Name { get; set; }
        public string Slug { get; set; }
        public string ShortDescription { get; set; }
        public string Description { get; set; }
        public decimal Price { get; set; }
        public string ImageUrl { get; set; }
        public List<string> ImageUrls { get; set; } = new();
        public int? CategoryId { get; set; }
        public List<int> SelectedOptionValueIds { get; set; } = new();
    }

}
