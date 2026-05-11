using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WebApp_API.Entities
{
    public class ProductImage
    {
        [Key] public int Id { get; set; }
        
        [Required, MaxLength(1000)] public required string ImageUrl { get; set; }
        public int DisplayOrder { get; set; }
        public bool IsMain { get; set; }

        public int? ProductId { get; set; }
        public int? VariantId { get; set; }
        [ForeignKey("ProductId")] public Product? Product { get; set; }
        [ForeignKey("VariantId")] public ProductVariant? ProductVariant { get; set; }
    }
}
