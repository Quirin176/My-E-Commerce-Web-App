using WebApp_API.DTOs;
using static WebApp_API.DTOs.PaginationDTOs;

namespace WebApp_API.Services
{
    // Business Logic
    public interface IUserService
    {
        // ────────────────────────────────────────────────── User Profile Query ──────────────────────────────────────────────────
        Task<UserDTOs.ProfileResponse?> GetByIdAsync(int id);

        // ────────────────────────────────────────────────── Write operations ──────────────────────────────────────────────────

        // Returns the updated user or null if not found
        Task UpdateAsync(int id, UserDTOs.ProfileUpdateRequest request);

        // Returns false if user not found
        // Task<bool> DeleteAsync(int id);
    }
}