using WebApp_API.Entities;
using WebApp_API.Specifications;

namespace WebApp_API.Repositories
{
    public interface IUserRepository
    {
        // ────────────────────────────────────────────────── Single user lookups ──────────────────────────────────────────────────
        Task<User?> GetByIdAsync(int id);
        Task<User?> GetByEmailAsync(string email);
        Task<User?> GetByPhoneAsync(string phone);
        Task<List<User>> GetAllUsersAsync();
        Task<List<User>> GetUsersByRoleAsync(string role);
        Task<(List<User> Users, int TotalCount)> GetUsersByFiltersAsync(UserFiltersSpec spec);

        // ────────────────────────────────────────────────── Write operations ──────────────────────────────────────────────────
        Task CreateAsync(User user);
        Task UpdateAsync(User user);
        // void Remove(User user);
    }
}
