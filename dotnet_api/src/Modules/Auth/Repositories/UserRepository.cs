using Microsoft.EntityFrameworkCore;
using WebApp_API.Data;
using WebApp_API.Entities;

namespace WebApp_API.Repositories
{
    public class UserRepository : IUserRepository
    {
        private readonly AppDbContext _db;
        public UserRepository(AppDbContext db) => _db = db;

        // ────────────────────────────────────────────────── Single product lookups ──────────────────────────────────────────────────
        public Task<User?> GetByIdAsync(int id) =>
        _db.Users.FindAsync(id).AsTask();

        public Task<User?> GetByEmailAsync(string email) =>
        _db.Users.FirstOrDefaultAsync(x => x.Email == email);

        public Task<User?> GetByPhoneAsync(string phone) =>
        _db.Users.FirstOrDefaultAsync(x => x.Phone == phone);

        public Task<List<User>> GetAllUsersAsync() =>
        _db.Users.ToListAsync();

        // ────────────────────────────────────────────────── Write operations ──────────────────────────────────────────────────
        public async Task CreateAsync(User user)
        {
            await _db.Users.AddAsync(user);
            await _db.SaveChangesAsync();
        }

        public async Task UpdateAsync(User user)
        {
            _db.Users.Update(user);
            await _db.SaveChangesAsync();
        }

        // public void Remove(User user) => _db.Users.Remove(user);
    }
}