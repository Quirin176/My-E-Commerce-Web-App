using WebApp_API.Entities;

namespace WebApp_API.Repositories
{
    public interface IOrderItemRepository
    {
        Task<OrderItem?> GetOrderItemByIdAsync(int id);
        Task AddRangeAsync(IEnumerable<OrderItem> items);
        Task RemoveRangeByOrderIdAsync(int orderId);
    }
}