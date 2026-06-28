using WebApp_API.Infrastructure.Middleware;

namespace WebApp_API.Infrastructure.Extensions
{
    public static class SecurityHeadersExtensions
    {
        public static IApplicationBuilder UseSecurityHeaders(this IApplicationBuilder app)
        {
            return app.UseMiddleware<SecurityHeadersMiddleware>();
        }
    }
}