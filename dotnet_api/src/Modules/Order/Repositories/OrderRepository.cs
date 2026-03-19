using Microsoft.EntityFrameworkCore;
using WebApp_API.Data;
using WebApp_API.Entities;

namespace WebApp_API.Repositories
{
    public class OrderRepository : IOrderRepository
    {
        private readonly AppDbContext _db;
        public OrderRepository(AppDbContext db) => _db = db;

        public async Task<Order?> GetOrderByIdAsync(int id)
        {
            return await _db.Orders.FindAsync(id) ?? throw new KeyNotFoundException($"Order with ID {id} not found.");
        }

        public async Task<List<Order>> GetOrderByUserIdAsync(int userId)
        {
            return await _db.Orders.Where(o => o.UserId == userId)
                .Include(o => o.OrderItems)
                .OrderByDescending(o => o.OrderDate)
                .ToListAsync() ?? throw new KeyNotFoundException($"Order with User's ID {userId} not found.");
        }

        public async Task CreateOrderAsync(Order order)
        {
            await _db.Orders.AddAsync(order);
            await _db.SaveChangesAsync();
        }

        public async Task UpdateOrderStatusAsync(Order order)
        {
            _db.Orders.Update(order);
            await _db.SaveChangesAsync();
        }

        public void RemoveOrder(Order order)
        {
            _db.Orders.Remove(order);
        }
    }
}
