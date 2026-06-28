using Microsoft.EntityFrameworkCore;
using WebApp_API.Data;
using WebApp_API.Modules.Orders.Specifications;

namespace WebApp_API.Modules.Orders.Repositories
{
    public class OrderRepository : IOrderRepository
    {
        private readonly AppDbContext _db;
        public OrderRepository(AppDbContext db) => _db = db;

        // ────────────────────────────── Single Order Lookups ──────────────────────────────
        public async Task<Entities.Order?> GetOrderByIdAsync(int orderId)
        {
            return await _db.Orders.FindAsync(orderId);
        }

        public async Task<Entities.Order?> GetOrderWithItemsByIdAsync(int orderId)
        {
            return await _db.Orders
                        .Include(o => o.User)
                        .Include(o => o.OrderItems)
                        .FirstOrDefaultAsync(o => o.Id == orderId);
        }

        // ────────────────────────────── List of Orders Lookups ──────────────────────────────
        public async Task<List<Entities.Order>> GetOrdersByUserIdAsync(int userId)
        {
            return await _db.Orders
                .Where(o => o.UserId == userId)
                .Include(o => o.OrderItems)
                .OrderByDescending(o => o.OrderDate)
                .ToListAsync();
        }

        public async Task<(List<Entities.Order> Orders, int TotalCount)> GetPaginatedOrdersAsync(OrderFiltersParameters spec)
        {
            IQueryable<Entities.Order> query = _db.Orders.AsNoTracking()
                                                .Include(o => o.User)
                                                .Include(o => o.OrderItems);

            // Filtered By Order's Status
            if (spec.Status.HasValue)
            {
                query = query.Where(o => o.Status == spec.Status.Value);
            }

            // Filtered By Min Date and Max Date
            if (!string.IsNullOrWhiteSpace(spec.MinDate))
                query = query.Where(o => o.OrderDate >= DateTime.Parse(spec.MinDate));

            if (!string.IsNullOrWhiteSpace(spec.MaxDate))
                query = query.Where(o => o.OrderDate <= DateTime.Parse(spec.MaxDate)
                                                                    .AddDays(1).AddSeconds(-1));

            // Apply Sorting
            query = spec.SortBy switch
            {
                "customerName" => spec.SortOrder == "asc" ?
                    query.OrderBy(o => o.CustomerName) : query.OrderByDescending(o => o.CustomerName),
                "totalAmount" => spec.SortOrder == "asc" ?
                    query.OrderBy(o => o.TotalAmount) : query.OrderByDescending(o => o.TotalAmount),
                _ => spec.SortOrder == "asc" ?
                    query.OrderBy(o => o.OrderDate) : query.OrderByDescending(o => o.OrderDate),
            };

            var totalCount = await query.CountAsync();

            var orders = await query.Skip((spec.Page - 1) * spec.PageSize)
                                    .Take(spec.PageSize)
                                    .ToListAsync();

            return (orders, totalCount);
        }

        public async Task<List<Entities.Order>> ExportOrdersCsvAsync(OrderFiltersParameters spec)
        {
            IQueryable<Entities.Order> query = _db.Orders.AsNoTracking()
                                                .Include(o => o.User)
                                                .Include(o => o.OrderItems);

            // Filtered By Order's Status
            if (spec.Status.HasValue)
            {
                query = query.Where(o => o.Status == spec.Status.Value);
            }

            // Filtered By Min Date and Max Date
            if (!string.IsNullOrWhiteSpace(spec.MinDate))
                query = query.Where(o => o.OrderDate >= DateTime.Parse(spec.MinDate));

            if (!string.IsNullOrWhiteSpace(spec.MaxDate))
                query = query.Where(o => o.OrderDate <= DateTime.Parse(spec.MaxDate)
                                                                    .AddDays(1).AddSeconds(-1));

            // Apply Sorting
            query = spec.SortBy switch
            {
                "customerName" => spec.SortOrder == "asc" ?
                    query.OrderBy(o => o.CustomerName) : query.OrderByDescending(o => o.CustomerName),
                "totalAmount" => spec.SortOrder == "asc" ?
                    query.OrderBy(o => o.TotalAmount) : query.OrderByDescending(o => o.TotalAmount),
                _ => spec.SortOrder == "asc" ?
                    query.OrderBy(o => o.OrderDate) : query.OrderByDescending(o => o.OrderDate),
            };

            return await query.ToListAsync();
        }

        public async Task<List<Entities.Order>> GetAllOrdersWithItemsAsync()
        {
            return await _db.Orders.Include(o => o.OrderItems).ToListAsync();
        }

        // ────────────────────────────── Write Operations ──────────────────────────────
        public async Task<Entities.Order> CreateOrderAsync(Entities.Order order, List<Entities.OrderItem> orderItems)
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

        public async Task UpdateOrderAsync(Entities.Order order)
        {
            order.UpdatedAt = DateTime.UtcNow;
            _db.Orders.Update(order);
            await _db.SaveChangesAsync();
        }

        public async Task DeleteOrderAsync(Entities.Order order)
        {
            var items = await _db.OrderItems.Where(oi => oi.OrderId == order.Id).ToListAsync();
            _db.OrderItems.RemoveRange(items);

            _db.Orders.Remove(order);

            await _db.SaveChangesAsync();
        }
    }
}
