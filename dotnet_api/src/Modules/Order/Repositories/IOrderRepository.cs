using WebApp_API.DTOs;
using WebApp_API.Entities;
using WebApp_API.Specifications;

namespace WebApp_API.Repositories
{
    public interface IOrderRepository
    {
        // ────────────────────────────── Single Queries ──────────────────────────────
        Task<Order?> GetOrderByIdAsync(int orderId);
        Task<Order?> GetOrderWithItemsByIdAsync(int orderId);

        // ────────────────────────────── List Queries ──────────────────────────────
        Task<List<Order>> GetOrdersByUserIdAsync(int userId);
        Task<(List<Order> Orders, int TotalCount)> GetPaginatedOrdersAsync(OrderFiltersParameters spec);
        Task<List<Order>> GetAllOrdersWithItemsAsync();     // Admin
        Task<List<Order>> ExportOrdersCsvAsync(OrderFiltersParameters spec);

        // ────────────────────────────── Dashboard Features ──────────────────────────────
        int CountOrders();
        decimal GetTotalRevenue();
        List<OrderDTOs.RecentOrderDto> GetRecentOrders(int count);
        Task<List<LineChartPoint>> GetOrderChartDataAsync(int days);

        // ────────────────────────────── Write Commands ──────────────────────────────
        Task<Order> CreateOrderAsync(Order order, List<OrderItem> items);   // Customer
        Task UpdateOrderAsync(Order order);                 // Admin
        Task DeleteOrderAsync(Order order);                 // Admin
    }
}
