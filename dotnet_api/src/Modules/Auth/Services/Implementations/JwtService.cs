using WebApp_API.Entities;

namespace WebApp_API.Services
{
    public class JwtService : IJwtService
    {
        public string GenerateToken(User user)
        {
            // create claims
            // sign token
            // return JWT string
            return "token";
        }
    }
}