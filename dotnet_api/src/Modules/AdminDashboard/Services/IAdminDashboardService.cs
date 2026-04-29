using WebApp_API.DTOs;

namespace WebApp_API.Services
{
    public interface IAdminDashboardService
    {
        Task<AdminDashboardDTOs> GetSummary();
    }
}