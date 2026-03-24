using WebApp_API.Entities;
using WebApp_API.Specifications;

namespace WebApp_API.Repositories
{
    public interface IOrderRepository
    {
        // ────────────────────────────── Single Order Lookups ──────────────────────────────
        Task<Order?> GetOrderByIdAsync(int id);
        Task<Order?> GetOrderWithItemsByIdAsync(int id);

        // ────────────────────────────── List of Orders Lookups ──────────────────────────────
        Task<List<Order>> GetOrdersByUserIdAsync(int userId);
        Task<List<Order>> GetFilteredOrdersAsync(OrderFilterParameters filterParams);
        Task<List<Order>> GetAllOrdersWithItemsAsync();     // Admin

        // ────────────────────────────── Write Operations ──────────────────────────────
        Task<Order> CreateOrderAsync(Order order, List<OrderItem> items);   // Customer
        Task UpdateOrderAsync(Order order);                 // Admin
        Task UpdateOrderStatusAsync(Order order);           // Admin
        Task DeleteOrderAsync(Order order);                 // Admin
    }
}
