using WebApp_API.Modules.Users.DTOs;

namespace WebApp_API.Modules.Users.Services
{
    public interface IAuthService
    {
        Task<AuthDTOs.AuthResponse> RegisterAsync(AuthDTOs.SignupRequest dto);
        Task<AuthDTOs.AuthResponse> LoginAsync(AuthDTOs.LoginRequest dto);
    }
}