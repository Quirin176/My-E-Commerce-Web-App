using WebApp_API.Entities;

namespace WebApp_API.Repositories
{
    public interface IUserRepository
    {
        // ────────────────────────────────────────────────── Single user lookups ──────────────────────────────────────────────────
        Task<User?> GetByIdAsync(int id);
        Task<User?> GetByEmailAsync(string email);
        Task<User?> GetByPhoneAsync(string phone);
        // Task<List<User>> GetAllUsersAsync();

        // ────────────────────────────────────────────────── Write operations ──────────────────────────────────────────────────
        Task CreateAsync(User user);
        Task UpdateAsync(User user);
        // void Remove(User user);
    }
}
