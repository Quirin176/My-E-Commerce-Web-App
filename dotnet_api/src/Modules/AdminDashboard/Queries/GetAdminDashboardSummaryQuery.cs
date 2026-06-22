using MediatR;
using WebApp_API.DTOs;

namespace WebApp_API.Features.AdminDashboard.Queries
{
    public record GetAdminDashboardSummaryQuery(
        int topRecentOrdersAmount,
        int topSellingProductsAmount,
        int topNewestProductsAmount) : IRequest<AdminDashboardDTOs>;
}