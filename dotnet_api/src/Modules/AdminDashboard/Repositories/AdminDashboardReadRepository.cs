using Microsoft.EntityFrameworkCore;
using WebApp_API.Data;
using WebApp_API.DTOs;

namespace WebApp_API.Repositories
{
    public class AdminDashboardReadRepository : IAdminDashboardReadRepository
    {
        private readonly AppDbContext _db;
        public AdminDashboardReadRepository(AppDbContext db) => _db = db;

        public int CountUsers()
        {
            return _db.Users.Count();
        }

        public async Task<List<OrderItemDTOs.TopProductDto>> GetTopSellingProducts(int top)
        {
            return _db.OrderItems.GroupBy(oi => oi.ProductId)
                                 .Select(g => new OrderItemDTOs.TopProductDto
                                 {
                                     ProductId = g.Key,
                                     ProductName = g.First().ProductName,
                                     TotalQuantity = g.Sum(x => x.Quantity),
                                     TotalRevenue = g.Sum(x => x.TotalPrice)
                                 })
                                 .OrderByDescending(x => x.TotalQuantity)
                                 .Take(top)
                                 .ToList();
        }

        public int CountOrders() => _db.Orders.Count();

        public decimal GetTotalRevenue() => _db.Orders.Sum(o => o.TotalAmount);

        public async Task<List<OrderDTOs.RecentOrderDto>> GetRecentOrders(int count)
        {
            return _db.Orders
                .OrderByDescending(o => o.CreatedAt)
                .Take(count)
                .Select(o => new OrderDTOs.RecentOrderDto
                {
                    Id = o.Id,
                    CustomerName = o.CustomerName,
                    TotalAmount = o.TotalAmount,
                    Status = o.Status
                })
                .ToList();
        }

        public async Task<List<LineChartPoint>> GetOrderChartDataAsync(int days)
        {
            DateTime fromDate = DateTime.Today.AddDays(-days + 1);

            var result = await _db.Orders
                .Where(o => o.CreatedAt.Date >= fromDate)
                .GroupBy(o => o.CreatedAt.Date)
                .Select(g => new LineChartPoint
                {
                    Date = g.Key,
                    OrderCount = g.Count(),
                    TotalRevenue = g.Sum(x => x.TotalAmount)
                })
                .OrderBy(x => x.Date)
                .ToListAsync();

            return result;
        }
    }
}