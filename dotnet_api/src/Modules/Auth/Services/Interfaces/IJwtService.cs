using WebApp_API.Entities;

namespace WebApp_API.Services
{
    public interface IJwtService
    {
        string GenerateToken(User user);
    }
}
