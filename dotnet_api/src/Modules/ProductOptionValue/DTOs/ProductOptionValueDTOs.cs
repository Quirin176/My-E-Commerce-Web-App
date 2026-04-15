namespace WebApp_API.DTOs
{
    public class ProductOptionValueDTOs
    {
        public class CreateOptionValueRequest
        {
            public string Value { get; set; } = "";
            public int OptionId { get; set; }
        }

        public class UpdateOptionValueRequest
        {
            public string Value { get; set; } = "";
        }
    }
}