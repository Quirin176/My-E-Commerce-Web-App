using MediatR;
using WebApp_API.Modules.AdminDashboard.DTOs;
using WebApp_API.Modules.AdminDashboard.Repositories;

namespace WebApp_API.Modules.AdminDashboard.Queries.GetAdminDashboardSummary
{
    public class GetAdminDashboardSummaryQueryHandler
        : IRequestHandler<GetAdminDashboardSummaryQuery, AdminDashboardDTOs>
    {
        private readonly IAdminDashboardReadRepository _repo;

        public GetAdminDashboardSummaryQueryHandler(IAdminDashboardReadRepository repo)
        {
            _repo = repo;
        }

        public async Task<AdminDashboardDTOs> Handle(
            GetAdminDashboardSummaryQuery request,
            CancellationToken cancellationToken)
        {
            var data = new AdminDashboardDTOs
            {
                TotalUsers = _repo.CountUsers(),
                TotalOrders = _repo.CountOrders(),
                TotalRevenue = _repo.GetTotalRevenue(),
                RecentOrders = await _repo.GetRecentOrders(request.topRecentOrdersAmount),
                TopSellingProducts = await _repo.GetTopSellingProducts(request.topSellingProductsAmount),
                TopNewestProducts = await _repo.GetTopNewestProducts(request.topNewestProductsAmount),
                LineChartPoints = await _repo.GetOrderChartDataAsync(120)
            };

            return data;
        }
    }
}