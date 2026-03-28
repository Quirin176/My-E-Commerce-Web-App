namespace WebApp_API
{
    public class CategoryDTOs
    {
        public class CreateCategoryRequest
        {
            public string Name { get; set; } = "";
            public string Slug { get; set; } = "";
        }
    }
}