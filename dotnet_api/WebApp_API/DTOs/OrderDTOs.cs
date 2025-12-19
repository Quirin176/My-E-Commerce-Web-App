namespace WebApp_API.DTOs
{
    public class OrderDTOs
    {
        public class CreateOrderRequest
        {
            public string CustomerName { get; set; }
            public string CustomerEmail { get; set; }
            public string CustomerPhone { get; set; }
            public string ShippingAddress { get; set; }
            public string City { get; set; }
            public decimal TotalAmount { get; set; }
            public string PaymentMethod { get; set; } = "Card";
            public string Status { get; set; }
            public string Notes { get; set; }
            public List<OrderItemRequest> OrderItems { get; set; } = new();
        }

        public class OrderItemRequest
        {
            public int ProductId { get; set; }
            public string ProductName { get; set; }
            public int Quantity { get; set; }
            public decimal UnitPrice { get; set; }
            public decimal TotalPrice { get; set; }
        }

        public class UpdateOrderStatusRequest
        {
            public string Status { get; set; }
        }
    }
}
