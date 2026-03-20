using Microsoft.EntityFrameworkCore;
using WebApp_API.Data;
using WebApp_API.Entities;

namespace WebApp_API.Repositories
{
    public class OrderItemRepository : IOrderItemRepository
    {
        private readonly AppDbContext _db;
        public OrderItemRepository(AppDbContext db) => _db = db;
        public async Task<OrderItem?> GetOrderItemByIdAsync(int id) =>
            await _db.OrderItems.FindAsync(id);
 
        public async Task AddRangeAsync(IEnumerable<OrderItem> items) =>
            await _db.OrderItems.AddRangeAsync(items);
 
        public async Task RemoveRangeByOrderIdAsync(int orderId)
        {
            var items = await _db.OrderItems.Where(oi => oi.OrderId == orderId).ToListAsync();
            _db.OrderItems.RemoveRange(items);
        }
    }
}