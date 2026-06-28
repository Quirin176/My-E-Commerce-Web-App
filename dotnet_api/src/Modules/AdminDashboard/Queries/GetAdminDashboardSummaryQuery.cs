using MediatR;
using WebApp_API.Modules.AdminDashboard.DTOs;

namespace WebApp_API.Modules.AdminDashboard.Queries.GetAdminDashboardSummary
{
    public record GetAdminDashboardSummaryQuery(
        int topRecentOrdersAmount,
        int topSellingProductsAmount,
        int topNewestProductsAmount) : IRequest<AdminDashboardDTOs>;
}