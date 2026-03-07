using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WebApp_API.Models
{
    public class ProductImage
    {
        [Key] public int Id { get; set; }
        [Required, MaxLength(1000)] public string ImageUrl { get; set; }
        public int DisplayOrder { get; set; } = 0; // For ordering images
        public int ProductId { get; set; }
        [ForeignKey("ProductId")] public Product Product { get; set; }
    }
}
