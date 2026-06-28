namespace WebApp_API.Modules.Categories.DTOs
{
    public class CategoryResponse
    {
        public int Id { get; set; }
        public required string Name { get; set; }
        public required string Slug { get; set; }
    }

    public class CreateCategoryRequest
    {
        public string Name { get; set; } = "";
        public string Slug { get; set; } = "";
    }

    public class UpdateCategoryRequest
    {
        public string Name { get; set; } = "";
        public string Slug { get; set; } = "";
    }
}