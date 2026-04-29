using Microsoft.EntityFrameworkCore;
using WebApp_API.Data;
using WebApp_API.Entities;
using WebApp_API.Specifications;

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

        public Task<List<User>> GetUsersByRoleAsync(string role) =>
        _db.Users.Where(u => u.Role == role).ToListAsync();

        public async Task<(List<User> Users, int TotalCount)> GetUsersByFiltersAsync(UserFiltersSpec spec)
        {
            IQueryable<User> query = _db.Users;

            // Filtered By User's Role
            if (!string.IsNullOrWhiteSpace(spec.Role))
                query = query.Where(u => u.Role == spec.Role);

            // Normalize sort order
            var sortOrder = spec.SortOrder?.ToLower() == "desc" ? "desc" : "asc";

            // Apply Sorting
            query = spec.SortBy switch
            {
                "Id" => spec.SortOrder == "asc" ?
                    query.OrderBy(o => o.Id) : query.OrderByDescending(o => o.Id),
                "Joining Date" => spec.SortOrder == "asc" ?
                    query.OrderBy(o => o.CreatedAt) : query.OrderByDescending(o => o.CreatedAt),
                _ => spec.SortOrder == "asc" ?
                query.OrderBy(o => o.Id) : query.OrderByDescending(o => o.Id),
            };

            // Pagination
            int totalCount = await query.CountAsync();

            var users = await query
                .Skip((spec.Page - 1) * spec.PageSize)
                .Take(spec.PageSize)
                .ToListAsync();

            return (users, totalCount);
        }

        // ────────────────────────────────────────────────── Dashboard Features ──────────────────────────────────────────────────
        public int CountUsers()
        {
            return _db.Users.Count();
        }

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