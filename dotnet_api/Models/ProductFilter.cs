using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WebApp_API.Models
{
    public class ProductFilter
    {
        [Key] public int Id { get; set; }
        public int ProductId { get; set; }
        [ForeignKey("ProductId")] public Product Product { get; set; }
        
        public int OptionValueId { get; set; }
        [ForeignKey("OptionValueId")] public ProductOptionValue OptionValue { get; set; }
    }
}