namespace WebApp_API.DTOs
{
    public class ProductOptionDTOs
    {
        public class CreateProductOptionRequest
        {
            public string Name { get; set; }
            public int? CategoryId { get; set; }
        }

        public class CreateOptionValueRequest
        {
            public int OptionId { get; set; }
            public string Value { get; set; }
        }

        public class UpdateOptionValueRequest
        {
            public string Value { get; set; }
        }
    }
}