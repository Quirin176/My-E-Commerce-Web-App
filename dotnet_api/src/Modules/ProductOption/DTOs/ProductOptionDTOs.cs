namespace WebApp_API.DTOs
{
    public class ProductOptionDTOs
    {
        // ────────────────────────────── Requests ──────────────────────────────
        public class CreateProductOptionRequest
        {
            public string Name { get; set; } = "";
            public int? CategoryId { get; set; }
        }

        // ────────────────────────────── Responses ──────────────────────────────
        public class ProductOptionResponse
        {
            public int Id { get; set; }
            public string Name { get; set; } = "";
            public int CategoryId { get; set; }
            public List<OptionValueResponse> OptionValues { get; set; } = new();
        }

        public class OptionValueResponse
        {
            public int Id { get; set; }
            public string Value { get; set; } = "";
            public int ProductOptionId { get; set; }
        }

        // Lightweight response used when listing options grouped by category
        public class ProductOptionGroupResponse
        {
            public int OptionId { get; set; }
            public string OptionName { get; set; } = "";
            public List<OptionValueResponse> OptionValues { get; set; } = new();
        }
    }
}