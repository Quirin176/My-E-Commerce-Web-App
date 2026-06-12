using MediatR;
using WebApp_API.DTOs;

namespace WebApp_API.Features.AdminDashboard.Queries
{
    public record GetAdminDashboardSummaryQuery : IRequest<AdminDashboardDTOs>;
}