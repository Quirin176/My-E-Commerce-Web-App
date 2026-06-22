using WebApp_API.DTOs;
using WebApp_API.Entities;

namespace WebApp_API.Repositories
{
    public interface IAdminDashboardReadRepository
    {
        int CountUsers();
        Task<List<OrderItemDTOs.TopProductDto>> GetTopSellingProducts(int top);
        Task<List<Product>> GetTopNewestProducts(int top);
        int CountOrders();
        decimal GetTotalRevenue();
        Task<List<OrderDTOs.RecentOrderDto>> GetRecentOrders(int count);
        Task<List<LineChartPoint>> GetOrderChartDataAsync(int days);
    }
}