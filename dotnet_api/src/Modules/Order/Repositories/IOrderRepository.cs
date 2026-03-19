using WebApp_API.Entities;

namespace WebApp_API.Repositories
{
    public interface IOrderRepository
    {
        // ────────────────────────────────────────────────── Single Order Lookups ──────────────────────────────────────────────────
        Task<Order?> GetOrderByIdAsync(int id);

        // ────────────────────────────────────────────────── List of Orders Lookups ──────────────────────────────────────────────────
        Task<List<Order>> GetOrderByUserIdAsync(int userId);

        // ────────────────────────────────────────────────── Write Operations ──────────────────────────────────────────────────
        Task CreateOrderAsync(Order order);
        Task UpdateOrderStatusAsync(Order order);    // Admin
        void RemoveOrder(Order order);
    }
}
