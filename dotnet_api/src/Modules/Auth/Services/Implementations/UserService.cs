using WebApp_API.DTOs;
using WebApp_API.Repositories;

namespace WebApp_API.Services
{
    public class UserService : IUserService
    {
        private readonly IUserRepository _repo;

        public UserService(IUserRepository repo) => _repo = repo;

        // ────────────────────────────────────────────────── User Profile Query ──────────────────────────────────────────────────
        public async Task<UserDTOs.ProfileResponse?> GetByIdAsync(int id)
        {
            var userProfile = await _repo.GetByIdAsync(id);
            if (userProfile is null) return null;
            
            return new UserDTOs.ProfileResponse
            {
                Username = userProfile.Username,
                Email = userProfile.Email,
                Phone = userProfile.Phone,
                Role = userProfile.Role,
                CreatedAt = userProfile.CreatedAt
            };
        }

        // ────────────────────────────────────────────────── Update User Profile ──────────────────────────────────────────────────
        public async Task UpdateAsync(int id, UserDTOs.ProfileUpdateRequest request)
        {
            var user = await _repo.GetByIdAsync(id);
            if (user is null) throw new KeyNotFoundException("User not found.");

            if (!string.IsNullOrWhiteSpace(request.Username)) user.Username = request.Username;
            if (!string.IsNullOrWhiteSpace(request.Email)) user.Email = request.Email;
            if (!string.IsNullOrWhiteSpace(request.Phone)) user.Phone = request.Phone;

            await _repo.UpdateAsync(user);
        }

        // public async Task<bool> DeleteAsync(int id)
        // {
        //     var user = await _repo.GetByIdAsync(id);
        //     if (user is null) return false;

        //     _repo.Remove(user);
        //     await _repo.SaveChangesAsync();
        //     return true;
        // }
    }
}
