using WebApp_API.Entities;
using WebApp_API.Modules.Orders.Specifications;

namespace WebApp_API.Modules.Orders.Repositories
{
    public interface IOrderRepository
    {
        // ────────────────────────────── Single Queries ──────────────────────────────
        Task<Entities.Order?> GetOrderByIdAsync(int orderId);
        Task<Entities.Order?> GetOrderWithItemsByIdAsync(int orderId);

        // ────────────────────────────── List Queries ──────────────────────────────
        Task<List<Entities.Order>> GetOrdersByUserIdAsync(int userId);
        Task<(List<Entities.Order> Orders, int TotalCount)> GetPaginatedOrdersAsync(OrderFiltersParameters spec);
        Task<List<Entities.Order>> GetAllOrdersWithItemsAsync();     // Admin
        Task<List<Entities.Order>> ExportOrdersCsvAsync(OrderFiltersParameters spec);

        // ────────────────────────────── Write Commands ──────────────────────────────
        Task<Entities.Order> CreateOrderAsync(Entities.Order order, List<OrderItem> items);   // Customer
        Task UpdateOrderAsync(Entities.Order order);                 // Admin
        Task DeleteOrderAsync(Entities.Order order);                 // Admin
    }
}
