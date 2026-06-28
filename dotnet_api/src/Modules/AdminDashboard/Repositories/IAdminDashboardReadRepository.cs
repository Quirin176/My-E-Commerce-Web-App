using WebApp_API.Modules.AdminDashboard.DTOs;
using WebApp_API.Modules.Orders.DTOs;
using WebApp_API.Modules.OrderItems.DTOs;

namespace WebApp_API.Modules.AdminDashboard.Repositories
{
    public interface IAdminDashboardReadRepository
    {
        int CountUsers();
        Task<List<TopProductDto>> GetTopSellingProducts(int top);
        Task<List<Entities.Product>> GetTopNewestProducts(int top);
        int CountOrders();
        decimal GetTotalRevenue();
        Task<List<RecentOrderDto>> GetRecentOrders(int count);
        Task<List<LineChartPoint>> GetOrderChartDataAsync(int days);
    }
}