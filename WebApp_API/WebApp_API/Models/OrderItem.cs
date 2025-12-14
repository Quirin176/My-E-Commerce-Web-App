using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WebApp_API.Models
{
    public class OrderItem
    {
        [Key] public int Id { get; set; }
        public int OrderId { get; set; }
        [ForeignKey("OrderId")] public Order Order { get; set; }
        
        public int ProductId { get; set; }
        [MaxLength(300)] public string ProductName { get; set; }
        
        public int Quantity { get; set; }
        [Column(TypeName = "decimal(18,2)")] public decimal UnitPrice { get; set; }
        [Column(TypeName = "decimal(18,2)")] public decimal TotalPrice { get; set; }
    }
}
