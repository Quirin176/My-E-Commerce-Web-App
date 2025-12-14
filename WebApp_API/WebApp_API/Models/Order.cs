using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WebApp_API.Models
{
    public class Order
    {
        [Key] public int Id { get; set; }
        public int UserId { get; set; }
        [ForeignKey("UserId")] public User User { get; set; }
        
        [Required, MaxLength(200)] public string CustomerName { get; set; }
        [Required, MaxLength(256)] public string CustomerEmail { get; set; }
        [MaxLength(20)] public string CustomerPhone { get; set; }
        [Required] public string ShippingAddress { get; set; }
        [MaxLength(100)] public string City { get; set; }
        
        [Column(TypeName = "decimal(18,2)")] public decimal TotalAmount { get; set; }
        [MaxLength(50)] public string PaymentMethod { get; set; } = "Card"; // Card, COD, Bank Transfer
        [MaxLength(50)] public string Status { get; set; } = "Pending"; // Pending, Confirmed, Shipped, Delivered, Cancelled
        
        [MaxLength(1000)] public string Notes { get; set; }
        public DateTime OrderDate { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
        
        // Navigation property
        public ICollection<OrderItem> OrderItems { get; set; } = new List<OrderItem>();
    }
}
