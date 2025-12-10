using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WebApp_API.Models
{
    public class ProductOptionValue
    {
        [Key] public int Id { get; set; }
        [Required, MaxLength(200)] public string Value { get; set; }
        public int ProductOptionId { get; set; }
        [ForeignKey("ProductOptionId")] public ProductOption ProductOption { get; set; }
    }
}