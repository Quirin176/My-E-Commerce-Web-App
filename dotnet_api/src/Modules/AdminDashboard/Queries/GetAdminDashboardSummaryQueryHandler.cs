using MediatR;
using Microsoft.Extensions.Caching.Memory;
using WebApp_API.DTOs;
using WebApp_API.Repositories;

namespace WebApp_API.Features.AdminDashboard.Queries
{
    public class GetAdminDashboardSummaryQueryHandler
        : IRequestHandler<GetAdminDashboardSummaryQuery, AdminDashboardDTOs>
    {
        private readonly IAdminDashboardReadRepository _repo;
        private readonly IMemoryCache _cache;

        public GetAdminDashboardSummaryQueryHandler(
            IAdminDashboardReadRepository repo, IMemoryCache cache)
        {
            _repo = repo;
            _cache = cache;
        }

        public async Task<AdminDashboardDTOs> Handle(
            GetAdminDashboardSummaryQuery request,
            CancellationToken cancellationToken)
        {
            // const string cacheKey = "admindashboard";

            // if (_cache.TryGetValue(cacheKey, out AdminDashboardDTOs? cached))
            //     return cached!;

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

            // _cache.Set(cacheKey, data, TimeSpan.FromMinutes(5));

            return data;
        }
    }
}