using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WebApp_API.Models
{
    public class Product
    {
        [Key] public int Id { get; set; }
        [Required, MaxLength(300)] public string Name { get; set; }
        [Required, MaxLength(300)] public string Slug { get; set; }
        [MaxLength(1000)] public string? ShortDescription { get; set; }
        public string? Description { get; set; }
        [Column(TypeName = "decimal(18,2)")] public decimal Price { get; set; }
        [MaxLength(1000)] public string? ImageUrl { get; set; }
        public int? CategoryId { get; set; }
        [ForeignKey("CategoryId")] public Category? Category { get; set; }
    }
}
