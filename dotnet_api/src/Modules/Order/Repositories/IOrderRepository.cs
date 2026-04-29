using WebApp_API.DTOs;
using WebApp_API.Entities;
using WebApp_API.Specifications;

namespace WebApp_API.Repositories
{
    public interface IOrderRepository
    {
        // ────────────────────────────── Single Order Lookups ──────────────────────────────
        Task<Order?> GetOrderByIdAsync(int orderId);
        Task<Order?> GetOrderWithItemsByIdAsync(int orderId);
        Task<Order?> AdminGetOrderWithItemsByIdAsync(int orderId);

        // ────────────────────────────── List of Orders Lookups ──────────────────────────────
        Task<List<Order>> GetOrdersByUserIdAsync(int userId);
        Task<List<Order>> GetFilteredOrdersAsync(OrderFiltersParameters filterParams);
        Task<List<Order>> GetAllOrdersWithItemsAsync();     // Admin

        // ────────────────────────────── Dashboard Features ──────────────────────────────
        int CountOrders();
        decimal GetTotalRevenue();
        List<OrderDTOs.RecentOrderDto> GetRecentOrders(int count);
        // Task<List<LineChartPoint>> GetOrderChartDataAsync(int days);

        // ────────────────────────────── Write Operations ──────────────────────────────
        Task<Order> CreateOrderAsync(Order order, List<OrderItem> items);   // Customer
        Task UpdateOrderAsync(Order order);                 // Admin
        Task DeleteOrderAsync(Order order);                 // Admin
    }
}
