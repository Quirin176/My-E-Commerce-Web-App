
namespace WebApp_API.DTOs
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
        public List<OrderDTOs.RecentOrderDto>? RecentOrders { get; set; }
        public List<OrderItemDTOs.TopProductDto>? TopProducts { get; set; }
        // public List<LineChartPoint>? LineChartPoints { get; set; }
    }
}