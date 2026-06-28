using Microsoft.EntityFrameworkCore;
using WebApp_API.Data;
using WebApp_API.Specifications;

namespace WebApp_API.Modules.Users.Repositories
{
    public class UserRepository : IUserRepository
    {
        private readonly AppDbContext _db;
        public UserRepository(AppDbContext db) => _db = db;

        // ────────────────────────────────────────────────── Single product lookups ──────────────────────────────────────────────────
        public Task<Entities.User?> GetByIdAsync(int id) =>
        _db.Users.FindAsync(id).AsTask();

        public Task<Entities.User?> GetByEmailAsync(string email) =>
        _db.Users.FirstOrDefaultAsync(x => x.Email == email);

        public Task<Entities.User?> GetByPhoneAsync(string phone) =>
        _db.Users.FirstOrDefaultAsync(x => x.Phone == phone);

        public Task<List<Entities.User>> GetAllUsersAsync() =>
        _db.Users.ToListAsync();

        public Task<List<Entities.User>> GetUsersByRoleAsync(string role) =>
        _db.Users.Where(u => u.Role == role).ToListAsync();

        public async Task<(List<Entities.User> Users, int TotalCount)> GetUsersByFiltersAsync(UserFiltersSpec spec)
        {
            IQueryable<Entities.User> query = _db.Users;

            // Filtered By User's Role
            if (!string.IsNullOrWhiteSpace(spec.Role))
                query = query.Where(u => u.Role == spec.Role);

            if (!string.IsNullOrWhiteSpace(spec.Search))
            {
                var term = spec.Search.Trim().ToLower();
                query = query.Where(u =>
                    u.Username.ToLower().Contains(term) ||
                    u.Email.ToLower().Contains(term) ||
                    u.Phone.Contains(term));
            }

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
        // public int CountUsers()
        // {
        //     return _db.Users.Count();
        // }

        // ────────────────────────────────────────────────── Write operations ──────────────────────────────────────────────────
        public async Task CreateAsync(Entities.User user)
        {
            await _db.Users.AddAsync(user);
            await _db.SaveChangesAsync();
        }

        public async Task UpdateAsync(Entities.User user)
        {
            _db.Users.Update(user);
            await _db.SaveChangesAsync();
        }

        // public void Remove(User user) => _db.Users.Remove(user);
    }
}