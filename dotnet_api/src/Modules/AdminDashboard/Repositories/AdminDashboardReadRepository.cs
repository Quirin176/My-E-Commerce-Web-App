using Microsoft.EntityFrameworkCore;
using WebApp_API.Data;
using WebApp_API.Modules.AdminDashboard.DTOs;
using WebApp_API.Modules.Orders.DTOs;
using WebApp_API.Modules.OrderItems.DTOs;

namespace WebApp_API.Modules.AdminDashboard.Repositories
{
    public class AdminDashboardReadRepository : IAdminDashboardReadRepository
    {
        private readonly AppDbContext _db;
        public AdminDashboardReadRepository(AppDbContext db) => _db = db;

        public int CountUsers()
        {
            return _db.Users.Count();
        }

        public async Task<List<TopProductDto>> GetTopSellingProducts(int top)
        {
            return _db.OrderItems.GroupBy(oi => oi.ProductId)
                                 .Select(g => new TopProductDto
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

        public async Task<List<Entities.Product>> GetTopNewestProducts(int top)
        {
            return await _db.Products.AsNoTracking()
                                     .OrderByDescending(p => p.CreatedAt)
                                     .Take(top)
                                     .ToListAsync();
        }

        public int CountOrders() => _db.Orders.Count();

        public decimal GetTotalRevenue() => _db.Orders.Sum(o => o.TotalAmount);

        public async Task<List<RecentOrderDto>> GetRecentOrders(int count)
        {
            return _db.Orders.AsNoTracking()
                             .OrderByDescending(o => o.CreatedAt)
                             .Take(count)
                             .Select(o => new RecentOrderDto
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