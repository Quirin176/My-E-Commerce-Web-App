using WebApp_API.Data;
using WebApp_API.Entities;

namespace WebApp_API.Repositories
{
    public class OrderItemRepository : IOrderItemRepository
    {
        private readonly AppDbContext _db;
        public OrderItemRepository(AppDbContext db) => _db = db;
        public async Task<OrderItem> GetOrderItemByIdAsync(int id)
        {
            return await _db.OrderItems.FindAsync(id) ?? throw new KeyNotFoundException($"Order Item with ID {id} not found.");
        }
    }
}