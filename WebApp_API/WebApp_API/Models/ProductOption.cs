using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WebApp_API.Models
{
    public class ProductOption
    {
        [Key] public int Id { get; set; }
        [Required, MaxLength(100)] public string Name { get; set; }
        public int CategoryId { get; set; }
        [ForeignKey("CategoryId")] public Category Category { get; set; }

        // Add this navigation property
        public ICollection<ProductOptionValue> ProductOptionValues { get; set; } = new List<ProductOptionValue>();
    }
}