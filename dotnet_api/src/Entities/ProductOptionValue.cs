using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WebApp_API.Entities
{
    public class ProductOptionValue
    {
        [Key] public int Id { get; set; }
        [Required, MaxLength(200)] public required string Value { get; set; }
        public int ProductOptionId { get; set; }
        [ForeignKey("ProductOptionId")] public ProductOption ProductOption { get; set; }

        public ICollection<ProductVariantOptionValue> ProductVariantOptionValues { get; set; } = new List<ProductVariantOptionValue>();
        public ICollection<ProductFilter> ProductFilters { get; set; } = new List<ProductFilter>();
    }
}