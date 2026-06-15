namespace WebApp_API.Infrastructure.Middleware
{
    public class SecurityHeadersMiddleware
    {
        private readonly RequestDelegate _next;

        public SecurityHeadersMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            context.Response.OnStarting(() =>
            {
                var headers = context.Response.Headers;

                headers["XContentTypeOptions"] = "nosniff";                     // Prevent MIME type sniffing
                headers["XFrameOptions"] = "DENY";                              // Prevent clickjacking by disallowing framing
                headers["Referrer-Policy"] = "strict-origin-when-cross-origin"; // Control referrer information sent with requests
                headers["Permissions-Policy"] = "geolocation=()";               // Disable geolocation API for all origins

                headers["ContentSecurityPolicy"] = "default-src 'self'";        // Restrict content to same origin to mitigate XSS and data injection attacks

                headers.Remove("Server");

                return Task.CompletedTask;
            });

            await _next(context);
        }
    }
}