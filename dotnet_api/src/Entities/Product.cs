using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WebApp_API.Entities
{
    public class Product
    {
        [Key] public int Id { get; set; }
        [Required, MaxLength(300)] public required string Name { get; set; }
        [Required, MaxLength(300)] public required string Slug { get; set; }

        [MaxLength(1000)] public string? ShortDescription { get; set; }
        public string? Description { get; set; }
        [Column(TypeName = "decimal(18,2)")] public decimal BasePrice { get; set; }
        public int Stock { get; set; }
        [MaxLength(1000)] public string? ThumbnailUrl { get; set; }

        public required int CategoryId { get; set; }
        [ForeignKey("CategoryId")] public Category? Category { get; set; }

        public bool HasVariants { get; set; }

        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }

        public ICollection<ProductVariant> Variants { get; set; } = new List<ProductVariant>();
        public ICollection<ProductImage> Images { get; set; } = new List<ProductImage>();
        public ICollection<ProductFilter> ProductFilters { get; set; } = new List<ProductFilter>();
    }
}