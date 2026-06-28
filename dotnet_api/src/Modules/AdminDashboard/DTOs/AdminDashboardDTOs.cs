using WebApp_API.Modules.Orders.DTOs;
using WebApp_API.Modules.OrderItems.DTOs;

namespace WebApp_API.Modules.AdminDashboard.DTOs
{
    public class LineChartPoint
    {
        public DateTime Date { get; set; }
        public int OrderCount { get; set; }
        public decimal TotalRevenue { get; set; }
    }

    public class AdminDashboardDTOs
    {
        public int TotalUsers { get; set; }
        public int TotalOrders { get; set; }
        public decimal TotalRevenue { get; set; }
        public List<RecentOrderDto>? RecentOrders { get; set; }
        public List<TopProductDto>? TopSellingProducts { get; set; }
        public List<Entities.Product>? TopNewestProducts { get; set; }
        public List<LineChartPoint>? LineChartPoints { get; set; }
    }
}