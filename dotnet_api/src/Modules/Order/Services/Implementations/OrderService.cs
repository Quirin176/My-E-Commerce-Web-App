using WebApp_API.DTOs;
using WebApp_API.Entities;
using WebApp_API.Repositories;
using WebApp_API.Specifications;

namespace WebApp_API.Services
{
    public class OrderService : IOrderService
    {
        private readonly IOrderRepository _repo;
        public OrderService(IOrderRepository repo) => _repo = repo;

        // ────────────────────────────── Order Lookups ──────────────────────────────
        public async Task<OrderDTOs.OrderResponse?> GetOrderByIdAsync(int id)
        {
            var order = await _repo.GetOrderByIdAsync(id);
            return order is null ? null : MapToOrderResponse(order);
        }
 
        public async Task<OrderDTOs.OrderStatsResponse?> GetOrderStatsAsync()
        {
            var orders = await _repo.GetAllOrdersWithItemsAsync();
 
            return new OrderDTOs.OrderStatsResponse
            {
                TotalOrders        = orders.Count,
                TotalRevenue       = orders.Sum(o => o.TotalAmount),
                TotalItems         = orders.Sum(o => o.OrderItems.Count),
                AverageOrderValue  = orders.Count > 0 ? orders.Average(o => o.TotalAmount) : 0,
                Last30DaysRevenue  = orders.Where(o => o.OrderDate >= DateTime.UtcNow.AddDays(-30)).Sum(o => o.TotalAmount),
                Last30DaysOrders   = orders.Count(o => o.OrderDate >= DateTime.UtcNow.AddDays(-30)),
                ByStatus = orders
                    .GroupBy(o => o.Status)
                    .Select(g => new OrderDTOs.OrderStatusCountDto { Status = g.Key, Count = g.Count() })
                    .ToList(),
                ByPaymentMethod = orders
                    .GroupBy(o => o.PaymentMethod)
                    .Select(g => new OrderDTOs.OrderPaymentMethodCountDto { Method = g.Key, Count = g.Count() })
                    .ToList()
            };
        }

        public async Task<List<OrderDTOs.OrderResponse>> GetOrdersByUserIdAsync(int userId)
        {
            var orders = await _repo.GetOrdersByUserIdAsync(userId);
            return orders.Select(MapToOrderResponse).ToList();
        }

        public async Task<List<OrderDTOs.OrderResponse>> GetFilteredOrdersAsync(OrderFilterParameters filterParams)
        {
            var orders = await _repo.GetFilteredOrdersAsync(filterParams);
            return orders.Select(MapToOrderResponse).ToList();
        }
 
        public async Task<OrderDTOs.AdminOrderResponse?> GetAdminOrderByIdAsync(int id)
        {
            var order = await _repo.GetOrderWithItemsByIdAsync(id);
            if (order is null) return null;
 
            return new OrderDTOs.AdminOrderResponse
            {
                Id = order.Id,
                CustomerName = order.CustomerName,
                CustomerEmail = order.CustomerEmail,
                CustomerPhone = order.CustomerPhone,
                ShippingAddress = order.ShippingAddress,
                City = order.City,
                TotalAmount = order.TotalAmount,
                PaymentMethod = order.PaymentMethod,
                Status = order.Status,
                OrderDate = order.OrderDate,
                Notes = order.Notes,
                UserId = order.User?.Id,
                UserName = order.User?.Username,
                Items = order.OrderItems.Select(MapToItemResponse).ToList()
            };
        }

        // ────────────────────────────── Write Operations ──────────────────────────────
        public async Task<OrderDTOs.OrderResponse> CreateOrderAsync(OrderDTOs.CreateOrderRequest orderRequest, int userId)
        {
            var order = new Order
            {
                UserId = userId,
                CustomerName = orderRequest.CustomerName,
                CustomerEmail = orderRequest.CustomerEmail,
                CustomerPhone = orderRequest.CustomerPhone,
                ShippingAddress = orderRequest.ShippingAddress,
                City = orderRequest.City,
                TotalAmount = orderRequest.TotalAmount,
                PaymentMethod = orderRequest.PaymentMethod,
                Status = orderRequest.Status ?? "Pending",
                Notes = orderRequest.Notes,
                CreatedAt = DateTime.UtcNow,
                OrderDate = DateTime.UtcNow
            };

            var items = orderRequest.OrderItems.Select(i => new OrderItem
            {
                ProductId = i.ProductId,
                ProductName = i.ProductName,
                Quantity = i.Quantity,
                UnitPrice = i.UnitPrice,
                TotalPrice = i.TotalPrice
            }).ToList();

            var created = await _repo.CreateOrderAsync(order, items);
            return MapToOrderResponse(created);
        }
 
        public async Task<bool> UpdateOrderStatusAsync(int id, string status)
        {
            var order = await _repo.GetOrderByIdAsync(id);
            if (order is null) return false;
 
            order.Status = status;
            await _repo.UpdateOrderAsync(order);
            return true;
        }
 
        public async Task<bool> UpdateOrderAsync(int id, OrderDTOs.UpdateOrderRequest request)
        {
            var order = await _repo.GetOrderByIdAsync(id);
            if (order is null) return false;
 
            if (!string.IsNullOrWhiteSpace(request.CustomerName))  order.CustomerName    = request.CustomerName;
            if (!string.IsNullOrWhiteSpace(request.CustomerEmail)) order.CustomerEmail   = request.CustomerEmail;
            if (!string.IsNullOrWhiteSpace(request.CustomerPhone)) order.CustomerPhone   = request.CustomerPhone;
            if (!string.IsNullOrWhiteSpace(request.ShippingAddress)) order.ShippingAddress = request.ShippingAddress;
            if (!string.IsNullOrWhiteSpace(request.City))          order.City            = request.City;
            if (!string.IsNullOrWhiteSpace(request.Status))        order.Status          = request.Status;
            if (!string.IsNullOrWhiteSpace(request.Notes))         order.Notes           = request.Notes;
 
            await _repo.UpdateOrderAsync(order);
            return true;
        }
 
        public async Task<bool> DeleteOrderAsync(int id)
        {
            var order = await _repo.GetOrderByIdAsync(id);
            if (order is null) return false;
 
            await _repo.DeleteOrderAsync(order);
            return true;
        }
 
        public async Task<byte[]> ExportOrdersCsvAsync(OrderFilterParameters filterParams)
        {
            var orders = await _repo.GetFilteredOrdersAsync(filterParams);
 
            var csv = new System.Text.StringBuilder();
            csv.AppendLine(
                "Order ID,Order Number,Customer Name,Email,Phone,Address,City," +
                "Status,Total Amount (VND),Items Count,Payment Method," +
                "Order Date,Products (Name x Quantity)");
 
            foreach (var order in orders)
            {
                var itemsCount   = order.OrderItems?.Count ?? 0;
                var itemsSummary = order.OrderItems?.Count > 0
                    ? string.Join(" | ", order.OrderItems.Select(i => $"{i.ProductName} x{i.Quantity}"))
                    : "";
 
                csv.AppendLine(
                    $"\"{order.Id}\",\"ORDER-{order.Id}\"," +
                    $"\"{order.CustomerName}\",\"{order.CustomerEmail}\",\"{order.CustomerPhone}\"," +
                    $"\"{order.ShippingAddress}\",\"{order.City}\"," +
                    $"\"{order.Status}\",\"{order.TotalAmount}\",\"{itemsCount}\",\"{order.PaymentMethod}\"," +
                    $"\"{order.OrderDate:yyyy-MM-dd HH:mm:ss}\",\"{itemsSummary}\"");
            }
 
            return System.Text.Encoding.UTF8.GetPreamble()
                .Concat(System.Text.Encoding.UTF8.GetBytes(csv.ToString()))
                .ToArray();
        }

        // ────────────────────────────── Mapping Helpers ──────────────────────────────
        private static OrderDTOs.OrderResponse MapToOrderResponse(Order order) => new()
        {
            Id = order.Id,
            CustomerName = order.CustomerName,
            CustomerEmail = order.CustomerEmail,
            CustomerPhone = order.CustomerPhone,
            ShippingAddress = order.ShippingAddress,
            City = order.City,
            TotalAmount = order.TotalAmount,
            PaymentMethod = order.PaymentMethod,
            Status = order.Status,
            OrderDate = order.OrderDate,
            Notes = order.Notes,
            ItemCount = order.OrderItems?.Count ?? 0,
            Items = order.OrderItems?.Select(MapToItemResponse).ToList() ?? new()
        };

        private static OrderItemDTOs.OrderItemResponse MapToItemResponse(OrderItem item) => new()
        {
            ProductId = item.ProductId,
            ProductName = item.ProductName,
            Quantity = item.Quantity,
            UnitPrice = item.UnitPrice,
            TotalPrice = item.TotalPrice
        };
    }
}