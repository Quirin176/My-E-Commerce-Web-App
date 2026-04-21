using WebApp_API.DTOs;
using WebApp_API.Entities;
using WebApp_API.Repositories;

namespace WebApp_API.Services
{
    public class UserService : IUserService
    {
        private readonly IUserRepository _repo;

        public UserService(IUserRepository repo) => _repo = repo;

        // ──────────────────── User Profile Query ────────────────────
        public async Task<UserDTOs.ProfileResponse?> GetByIdAsync(int id)
        {
            var userProfile = await _repo.GetByIdAsync(id);
            if (userProfile is null) return null;

            return new UserDTOs.ProfileResponse
            {
                Id = userProfile.Id,
                Username = userProfile.Username,
                Email = userProfile.Email,
                Phone = userProfile.Phone,
                Role = userProfile.Role,
                CreatedAt = userProfile.CreatedAt
            };
        }

        public async Task<UserDTOs.ProfileResponse?> GetByEmailAsync(string email)
        {
            var userProfile = await _repo.GetByEmailAsync(email);
            if (userProfile is null) return null;

            return new UserDTOs.ProfileResponse
            {
                Id = userProfile.Id,
                Username = userProfile.Username,
                Email = userProfile.Email,
                Phone = userProfile.Phone,
                Role = userProfile.Role,
                CreatedAt = userProfile.CreatedAt
            };
        }

        public async Task<UserDTOs.ProfileResponse?> GetByPhoneAsync(string phone)
        {
            var userProfile = await _repo.GetByPhoneAsync(phone);
            if (userProfile is null) return null;

            return new UserDTOs.ProfileResponse
            {
                Id = userProfile.Id,
                Username = userProfile.Username,
                Email = userProfile.Email,
                Phone = userProfile.Phone,
                Role = userProfile.Role,
                CreatedAt = userProfile.CreatedAt
            };
        }

        public async Task<List<UserDTOs.ProfileResponse>> GetAllUsersAsync()
        {
            var users = await _repo.GetAllUsersAsync();
            if (users is null) return new List<UserDTOs.ProfileResponse>();

            return await MapToResponseAsync(users);
        }

        public async Task<List<UserDTOs.ProfileResponse>> GetUsersByRoleAsync(string role)
        {
            var users = await _repo.GetUsersByRoleAsync(role);
            if (users is null) return new List<UserDTOs.ProfileResponse>();

            return await MapToResponseAsync(users);
        }

        // ──────────────────── Update User Profile ────────────────────
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

        private async Task<List<UserDTOs.ProfileResponse>> MapToResponseAsync(List<User> users)
        {
            var result = new List<UserDTOs.ProfileResponse>(users.Count);

            foreach (var u in users)
            {
                result.Add(new UserDTOs.ProfileResponse
                {
                    Id = u.Id,
                    Username = u.Username,
                    Email = u.Email,
                    Phone = u.Phone,
                    Role = u.Role,
                    CreatedAt = u.CreatedAt
                });
            }
            return result;
        }
    }
}
