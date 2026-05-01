using WebApp_API.DTOs;
using WebApp_API.Repositories;

namespace WebApp_API.Services
{
    public class AdminDashboardService : IAdminDashboardService
    {
        private readonly IUserRepository _usersRepo;
        private readonly IOrderRepository _ordersRepo;
        private readonly IOrderItemRepository _orderItemsRepo;
        public AdminDashboardService(IUserRepository usersRepo, IOrderRepository ordersRepo, IOrderItemRepository orderItemsRepo)
        {
            _usersRepo = usersRepo;
            _ordersRepo = ordersRepo;
            _orderItemsRepo = orderItemsRepo;
        }

        public async Task<AdminDashboardDTOs> GetSummary()
        {
            return new AdminDashboardDTOs
            {
                TotalUsers = _usersRepo.CountUsers(),
                TotalOrders = _ordersRepo.CountOrders(),
                TotalRevenue = _ordersRepo.GetTotalRevenue(),
                RecentOrders = _ordersRepo.GetRecentOrders(5),
                TopProducts = _orderItemsRepo.GetTopSellingProducts(5),
                LineChartPoints = await _ordersRepo.GetOrderChartDataAsync(120)
            };
        }
    }
}