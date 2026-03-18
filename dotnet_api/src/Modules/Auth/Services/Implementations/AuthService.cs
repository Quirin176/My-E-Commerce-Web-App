using WebApp_API.DTOs;
using WebApp_API.Entities;
using WebApp_API.Repositories;

namespace WebApp_API.Services
{
    public class AuthService : IAuthService
    {
        private readonly IUserRepository _repo;
        private readonly IJwtService _jwtService;

        public AuthService(IUserRepository repo, IJwtService jwtService)
        {
            _repo = repo;
            _jwtService = jwtService;
        }

        public async Task<AuthDTOs.AuthResponse> RegisterAsync(AuthDTOs.SignupRequest signupRequest)
        {
            var existing = await _repo.GetByEmailAsync(signupRequest.Email);
            if (existing != null) throw new Exception("User Already Exists");

            var user = new User
            {
                Username = signupRequest.Username,
                Email = signupRequest.Email,
                Phone = signupRequest.Phone,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(signupRequest.Password),
                Role = "Customer",
                CreatedAt = DateTime.UtcNow
            };

            await _repo.CreateAsync(user);

            var token = _jwtService.GenerateToken(user);

            return new AuthDTOs.AuthResponse
            {
                Token = token,
                Id = user.Id,
                Username = user.Username,
                Email = user.Email,
                Role = user.Role
            };
        }

        public async Task<AuthDTOs.AuthResponse> LoginAsync(AuthDTOs.LoginRequest loginRequest)
        {
            var existing = await _repo.GetByEmailAsync(loginRequest.Email);
            if (existing == null) throw new Exception("Invalid Email");
            
            if (!BCrypt.Net.BCrypt.Verify(loginRequest.Password, existing.PasswordHash)) throw new Exception("Invalid Password");

            var token = _jwtService.GenerateToken(existing);

            return new AuthDTOs.AuthResponse
            {
                Token = token,
                Id = existing.Id,
                Username = existing.Username,
                Email = existing.Email,
                Role = existing.Role
            };
        }
    }
}
