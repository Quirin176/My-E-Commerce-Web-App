using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WebApp_API.Entities
{
    public class ProductVariant
    {
        [Key] public int Id { get; set; }
        public string VariantName { get; set; } = string.Empty;
        [Required, MaxLength(100)] public string SKU { get; set; } = string.Empty;
        [Column(TypeName = "decimal(18,2)")] public decimal Price { get; set; }
        [Column(TypeName = "decimal(18,2)")] public decimal OriginalPrice { get; set; }
        public int Stock { get; set; }
        [MaxLength(1000)] public string? ImageUrl { get; set; }

        public required int ProductId { get; set; }
        [ForeignKey("ProductId")] public Product? Product { get; set; }

        public ICollection<ProductImage> Images { get; set; } = new List<ProductImage>();
        public ICollection<ProductVariantOptionValue> ProductVariantOptionValues { get; set; } = new List<ProductVariantOptionValue>();
    }
}