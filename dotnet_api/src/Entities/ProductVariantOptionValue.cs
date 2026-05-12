using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WebApp_API.Entities
{
    public class ProductVariantOptionValue
    {
        public int ProductVariantId { get; set; }
        [ForeignKey("ProductVariantId")] public required ProductVariant ProductVariant { get; set; }

        // [Required] public required ProductVariant ProductVariant { get; set; }

        public int ProductOptionValueId { get; set; }
        [ForeignKey("ProductOptionValueId")] public required ProductOptionValue ProductOptionValue { get; set; }

        // [Required] public required ProductOptionValue ProductOptionValue { get; set; }
    }
}