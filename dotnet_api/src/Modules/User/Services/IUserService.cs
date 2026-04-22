using WebApp_API.DTOs;
using WebApp_API.Specifications;
using static WebApp_API.DTOs.PaginationDTOs;

namespace WebApp_API.Services
{
    // Business Logic
    public interface IUserService
    {
        // ──────────────────── User Profile Query ────────────────────
        Task<UserDTOs.ProfileResponse?> GetByIdAsync(int id);
        Task<UserDTOs.ProfileResponse?> GetByEmailAsync(string email);
        Task<UserDTOs.ProfileResponse?> GetByPhoneAsync(string phone);
        Task<List<UserDTOs.ProfileResponse>> GetAllUsersAsync();
        Task<List<UserDTOs.ProfileResponse>> GetUsersByRoleAsync(string role);
        Task<PaginatedResponse<UserDTOs.ProfileResponse>> GetUsersByFiltersAsync(UserFiltersSpec spec);

        // ──────────────────── Write operations ────────────────────
        Task UpdateAsync(int id, UserDTOs.ProfileUpdateRequest request);

        // Task<bool> DeleteAsync(int id);
    }
}