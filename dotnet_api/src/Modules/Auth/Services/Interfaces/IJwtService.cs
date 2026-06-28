using WebApp_API.Entities;

namespace WebApp_API.Modules.Users.Services
{
    public interface IJwtService
    {
        string GenerateToken(User user);
    }
}
