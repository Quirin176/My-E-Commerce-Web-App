namespace WebApp_API.DTOs
{
    public class OrderDTOs
    {
        //////////////////// Order Creation DTOs for client/frontend creating a new order ////////////////////
        // DTO used for creating a new order from the client/frontend
        public class CreateOrderRequest
        {
            public required string CustomerName { get; set; }
            public required string CustomerEmail { get; set; }
            public required string CustomerPhone { get; set; }
            public required string ShippingAddress { get; set; }
            public required string City { get; set; }
            public decimal TotalAmount { get; set; }
            public string PaymentMethod { get; set; } = "Card";
            public required string Status { get; set; }
            public string? Notes { get; set; }
            public List<OrderItemDTOs.OrderItemRequest> OrderItems { get; set; } = new();
        }

        //////////////////// Order Details DTOs to return to client/frontend and admin users ////////////////////
        // DTO used for returning order details in responses to the client/frontend
        public class OrderResponse
        {
            public int Id { get; set; }
            public required string CustomerName { get; set; }
            public required string CustomerEmail { get; set; }
            public required string CustomerPhone { get; set; }
            public required string ShippingAddress { get; set; }
            public required string City { get; set; }
            public decimal TotalAmount { get; set; }
            public required string PaymentMethod { get; set; }
            public required string Status { get; set; }
            public DateTime OrderDate { get; set; }
            public string? Notes { get; set; }
            public int ItemCount { get; set; }
            public List<OrderItemDTOs.OrderItemResponse> Items { get; set; } = new();
        }

        // DTO used for returning order details to admin client/frontend
        public class AdminOrderResponse
        {
            public int Id { get; set; }
            public required string CustomerName { get; set; }
            public required string CustomerEmail { get; set; }
            public required string CustomerPhone { get; set; }
            public required string ShippingAddress { get; set; }
            public required string City { get; set; }
            public decimal TotalAmount { get; set; }
            public required string PaymentMethod { get; set; }
            public required string Status { get; set; }
            public DateTime OrderDate { get; set; }
            public string? Notes { get; set; }
            public int? UserId { get; set; }        // Admin-specific
            public string? UserName { get; set; }   // Admin-specific
            public List<OrderItemDTOs.OrderItemResponse> Items { get; set; } = new();
        }

        // DTO used for updating order status from the client/frontend
        public class UpdateOrderStatusRequest
        {
            public required string Status { get; set; }
        }

        // DTO used for updating entire order details from the client/frontend
        public class UpdateOrderRequest
        {
            public required string CustomerName { get; set; }
            public required string CustomerEmail { get; set; }
            public required string CustomerPhone { get; set; }
            public required string ShippingAddress { get; set; }
            public required string City { get; set; }
            public required string Status { get; set; }
            public string? Notes { get; set; }
        }
        
        // ──────────────────── Admin ────────────────────
        // DTO for a single status group count
        public class OrderStatusCountDto
        {
            public required string Status { get; set; }
            public int Count { get; set; }
        }

        // DTO for a single payment method group count
        public class OrderPaymentMethodCountDto
        {
            public required string Method { get; set; }
            public int Count { get; set; }
        }

        // DTO returned by GET /api/adminorders/stats
        public class OrderStatisticsResponse
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

        // DTO used for returning order details (shorter version) to admin dashboard
        public class RecentOrderDto
        {
            public int Id { get; set; }
            public required string CustomerName { get; set; }
            public decimal TotalAmount { get; set; }
            public required string Status { get; set; }
        }
    }
}
