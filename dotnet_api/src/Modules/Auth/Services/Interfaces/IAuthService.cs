using WebApp_API.DTOs;

namespace WebApp_API.Services
{
    public interface IAuthService
    {
        Task<AuthDTOs.AuthResponse> RegisterAsync(AuthDTOs.SignupRequest dto);
        Task<AuthDTOs.AuthResponse> LoginAsync(AuthDTOs.LoginRequest dto);
    }
}