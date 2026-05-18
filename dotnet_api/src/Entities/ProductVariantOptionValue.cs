using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WebApp_API.Entities
{
    public class ProductVariantOptionValue
    {
        public int ProductVariantId { get; set; }
        [ForeignKey("ProductVariantId")] public ProductVariant? ProductVariant { get; set; }

        public int ProductOptionValueId { get; set; }
        [ForeignKey("ProductOptionValueId")] public ProductOptionValue? ProductOptionValue { get; set; }
    }
}