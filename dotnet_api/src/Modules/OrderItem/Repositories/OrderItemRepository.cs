using Microsoft.EntityFrameworkCore;
using WebApp_API.Data;
using WebApp_API.DTOs;
using WebApp_API.Entities;

namespace WebApp_API.Repositories
{
    public class OrderItemRepository : IOrderItemRepository
    {
        private readonly AppDbContext _db;
        public OrderItemRepository(AppDbContext db) => _db = db;

        // ────────────────────────────── Order Item Lookups ──────────────────────────────
        public async Task<OrderItem?> GetOrderItemByIdAsync(int id) =>
            await _db.OrderItems.FindAsync(id);

        public List<OrderItemDTOs.TopProductDto> GetTopSellingProducts(int top)
        {
            return _db.OrderItems
                .GroupBy(oi => oi.ProductId)
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
    }
}