namespace WebApp_API.DTOs
{
    public class OrderDTOs
    {
        //////////////////// Order Creation DTOs for client/frontend creating a new order ////////////////////
        // DTO used for creating a new order from the client/frontend
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
            public List<OrderItemDTOs.OrderItemRequest> OrderItems { get; set; } = new();
        }

        //////////////////// Order Details DTOs to return to client/frontend and admin users ////////////////////
        // DTO used for returning order details in responses to the client/frontend
        public class OrderResponse
        {
            public int Id { get; set; }
            public string CustomerName { get; set; }
            public string CustomerEmail { get; set; }
            public string CustomerPhone { get; set; }
            public string ShippingAddress { get; set; }
            public string City { get; set; }
            public decimal TotalAmount { get; set; }
            public string PaymentMethod { get; set; }
            public string Status { get; set; }
            public DateTime OrderDate { get; set; }
            public string? Notes { get; set; }
            public int ItemCount { get; set; }
            public List<OrderItemDTOs.OrderItemResponse> Items { get; set; } = new();
        }
        // DTO used for returning order details to admin client/frontend
        public class AdminOrderResponse
        {
            public int Id { get; set; }
            public string CustomerName { get; set; }
            public string CustomerEmail { get; set; }
            public string CustomerPhone { get; set; }
            public string ShippingAddress { get; set; }
            public string City { get; set; }
            public decimal TotalAmount { get; set; }
            public string PaymentMethod { get; set; }
            public string Status { get; set; }
            public DateTime OrderDate { get; set; }
            public string? Notes { get; set; }
            public int? UserId { get; set; }        // Admin-specific
            public string? UserName { get; set; }   // Admin-specific
            public List<OrderItemDTOs.OrderItemResponse> Items { get; set; } = new();
        }

        // DTO used for updating order status from the client/frontend
        public class UpdateOrderStatusRequest
        {
            public string Status { get; set; }
        }

        // DTO used for updating entire order details from the client/frontend
        public class UpdateOrderRequest
        {
            public string CustomerName { get; set; }
            public string CustomerEmail { get; set; }
            public string CustomerPhone { get; set; }
            public string ShippingAddress { get; set; }
            public string City { get; set; }
            public string Status { get; set; }
            public string Notes { get; set; }
        }
        
        //////////////////// Order Stats DTOs for admin dashboard ////////////////////
        // DTO for a single status group count
        public class OrderStatusCountDto
        {
            public string Status { get; set; }
            public int Count { get; set; }
        }

        // DTO for a single payment method group count
        public class OrderPaymentMethodCountDto
        {
            public string Method { get; set; }
            public int Count { get; set; }
        }

        // DTO returned by GET /api/adminorders/stats
        public class OrderStatsResponse
        {
            public int TotalOrders { get; set; }
            public decimal TotalRevenue { get; set; }
            public int TotalItems { get; set; }
            public decimal AverageOrderValue { get; set; }
            public List<OrderStatusCountDto> ByStatus { get; set; } = new();
            public List<OrderPaymentMethodCountDto> ByPaymentMethod { get; set; } = new();
            public decimal Last30DaysRevenue { get; set; }
            public int Last30DaysOrders { get; set; }
        }
    }
}
