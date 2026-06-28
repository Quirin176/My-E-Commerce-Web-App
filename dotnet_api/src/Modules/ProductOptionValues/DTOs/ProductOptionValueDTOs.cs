namespace WebApp_API.Modules.ProductOptionValues.DTOs
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