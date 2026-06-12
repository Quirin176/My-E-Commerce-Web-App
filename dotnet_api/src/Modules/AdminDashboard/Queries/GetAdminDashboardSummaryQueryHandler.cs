using MediatR;
using WebApp_API.DTOs;
using WebApp_API.Repositories;

namespace WebApp_API.Features.AdminDashboard.Queries
{
    public class GetAdminDashboardSummaryQueryHandler
        : IRequestHandler<GetAdminDashboardSummaryQuery, AdminDashboardDTOs>
    {
        private readonly IAdminDashboardReadRepository _repo;

        public GetAdminDashboardSummaryQueryHandler(
            IAdminDashboardReadRepository repo)
        {
            _repo = repo;
        }

        public async Task<AdminDashboardDTOs> Handle(
            GetAdminDashboardSummaryQuery request,
            CancellationToken cancellationToken)
        {
            return new AdminDashboardDTOs
            {
                TotalUsers = _repo.CountUsers(),
                TotalOrders = _repo.CountOrders(),
                TotalRevenue = _repo.GetTotalRevenue(),
                RecentOrders = await _repo.GetRecentOrders(5),
                TopProducts = await _repo.GetTopSellingProducts(5),
                LineChartPoints = await _repo.GetOrderChartDataAsync(120)
            };
        }
    }
}