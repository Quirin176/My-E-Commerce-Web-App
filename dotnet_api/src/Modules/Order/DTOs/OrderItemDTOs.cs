namespace WebApp_API.DTOs
{
    public class OrderItemDTOs
    {
        // DTO for each item in the order request from the client/frontend
        public class OrderItemRequest
        {
            public int ProductId { get; set; }
            public required string ProductName { get; set; }
            public int Quantity { get; set; }
            public decimal UnitPrice { get; set; }
            public decimal TotalPrice { get; set; }
        }

        // DTO for each item in the order response to the client/frontend
        public class OrderItemResponse
        {
            public int ProductId { get; set; }
            public required string ProductName { get; set; }
            public int Quantity { get; set; }
            public decimal UnitPrice { get; set; }
            public decimal TotalPrice { get; set; }
        }

        // DTO for each item in the order response to the client/frontend
        public class TopProductDto
        {
            public int ProductId { get; set; }
            public required string ProductName { get; set; }
            public decimal UnitPrice { get; set; }
            public int TotalQuantity { get; set; }
            public decimal TotalRevenue { get; set; }
        }
    }
}