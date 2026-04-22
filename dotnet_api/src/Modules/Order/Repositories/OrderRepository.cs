using Microsoft.EntityFrameworkCore;
using WebApp_API.Data;
using WebApp_API.Entities;
using WebApp_API.Specifications;

namespace WebApp_API.Repositories
{
    public class OrderRepository : IOrderRepository
    {
        private readonly AppDbContext _db;
        public OrderRepository(AppDbContext db) => _db = db;

        // ────────────────────────────── Single Order Lookups ──────────────────────────────
        public async Task<Order?> GetOrderByIdAsync(int orderId)
        {
            return await _db.Orders.FindAsync(orderId);
        }

        public async Task<Order?> GetOrderWithItemsByIdAsync(int orderId)
        {
            return await _db.Orders
                        .Include(o => o.User)
                        .Include(o => o.OrderItems)
                        .FirstOrDefaultAsync(o => o.Id == orderId);
        }

        public async Task<Order?> AdminGetOrderWithItemsByIdAsync(int orderId)
        {
            return await _db.Orders
                        .Include(o => o.User)
                        .Include(o => o.OrderItems)
                        .FirstOrDefaultAsync(o => o.Id == orderId);
        }

        // ────────────────────────────── List of Orders Lookups ──────────────────────────────
        public async Task<List<Order>> GetOrdersByUserIdAsync(int userId)
        {
            return await _db.Orders
                .Where(o => o.UserId == userId)
                .Include(o => o.OrderItems)
                .OrderByDescending(o => o.OrderDate)
                .ToListAsync();
        }

        public async Task<List<Order>> GetFilteredOrdersAsync(OrderFiltersParameters filterParams)
        {
            IQueryable<Order> query = _db.Orders
                .Include(o => o.User)
                .Include(o => o.OrderItems);

            // Filtered By Order's Status
            if (!string.IsNullOrWhiteSpace(filterParams.Status))
            {
                if (!filterParams.Status.ToLower().Equals("all", StringComparison.OrdinalIgnoreCase))
                    query = query.Where(o => o.Status == filterParams.Status);
            }

            // Filtered By Min Date and Max Date
            if (!string.IsNullOrWhiteSpace(filterParams.MinDate))
                query = query.Where(o => o.OrderDate >= DateTime.Parse(filterParams.MinDate));

            if (!string.IsNullOrWhiteSpace(filterParams.MaxDate))
                query = query.Where(o => o.OrderDate <= DateTime.Parse(filterParams.MaxDate).AddDays(1).AddSeconds(-1));

            // Apply Sorting
            query = filterParams.SortBy switch
            {
                "customerName" => filterParams.SortOrder == "asc" ?
                    query.OrderBy(o => o.CustomerName) : query.OrderByDescending(o => o.CustomerName),
                "totalAmount" => filterParams.SortOrder == "asc" ?
                    query.OrderBy(o => o.TotalAmount) : query.OrderByDescending(o => o.TotalAmount),
                _ => filterParams.SortOrder == "asc" ?
                    query.OrderBy(o => o.OrderDate) : query.OrderByDescending(o => o.OrderDate),
            };

            return await query.ToListAsync();
        }

        public async Task<List<Order>> GetAllOrdersWithItemsAsync()
        {
            return await _db.Orders.Include(o => o.OrderItems).ToListAsync();
        }

        // ────────────────────────────── Write Operations ──────────────────────────────
        public async Task<Order> CreateOrderAsync(Order order, List<OrderItem> orderItems)
        {
            await _db.Orders.AddAsync(order);
            await _db.SaveChangesAsync();

            foreach (var item in orderItems)
            {
                item.OrderId = order.Id;
                _db.OrderItems.Add(item);
            }
            await _db.SaveChangesAsync();

            return order;
        }

        public async Task UpdateOrderAsync(Order order)
        {
            order.UpdatedAt = DateTime.UtcNow;
            _db.Orders.Update(order);
            await _db.SaveChangesAsync();
        }

        public async Task DeleteOrderAsync(Order order)
        {
            var items = await _db.OrderItems.Where(oi => oi.OrderId == order.Id).ToListAsync();
            _db.OrderItems.RemoveRange(items);

            _db.Orders.Remove(order);

            await _db.SaveChangesAsync();
        }
    }
}
