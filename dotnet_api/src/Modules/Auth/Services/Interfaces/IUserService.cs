using WebApp_API.DTOs;

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

        // ──────────────────── Write operations ────────────────────
        Task UpdateAsync(int id, UserDTOs.ProfileUpdateRequest request);

        // Task<bool> DeleteAsync(int id);
    }
}