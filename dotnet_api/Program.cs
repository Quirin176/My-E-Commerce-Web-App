using System.Text;
using System.Text.Json.Serialization;
using System.Threading.RateLimiting;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using WebApp_API.Hubs;
using WebApp_API.Data;
using WebApp_API.Repositories;
using WebApp_API.Services;
using QuestPDF.Infrastructure;
using MediatR;

// ──────────────────────────────────────── 1. DI (DEPENDENCY INJECTION) SERVICE CONTAINER ────────────────────────────────────────
var builder = WebApplication.CreateBuilder(args);

// ──────────────────────────────────────── 2. CONFIGURE SERVICES (DEPENDENCIES INJECTION REGISTRATION) ────────────────────────────────────────
QuestPDF.Settings.License = LicenseType.Community;

// Configure JSON options to handle reference loops
builder.Services.AddControllers()
                .AddJsonOptions(options =>
                {
                    options.JsonSerializerOptions.ReferenceHandler =
                        ReferenceHandler.IgnoreCycles;

                    options.JsonSerializerOptions.Converters.Add(
                        new JsonStringEnumConverter());
                });

// Generate API documentation with Swagger/OpenAPI
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
// Configure DbContext with SQL Server (set the connection string in appsettings.json)
builder.Services.AddDbContext<AppDbContext>(options => options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));
// Configure CORS to allow requests from the frontend
builder.Services.AddCors(options =>
                            options.AddPolicy("AllowFrontend", policy =>
                                                                    policy.WithOrigins("http://localhost:5173", "http://localhost:3000", "https://your-prod-frontend.com")
                                                                    //   .WithHeaders("Authorization", "Content-Type")
                                                                    .WithMethods("GET", "POST", "PUT", "DELETE")
                                                                    .AllowAnyHeader()
                                                                    //   .AllowAnyMethod()
                                                                    .AllowCredentials()));
// Rate Limiting - limit to 3 login attempts per minute per IP
builder.Services.AddRateLimiter(options =>
{
    options.RejectionStatusCode = 429;

    // Add Retry-After header on rejection
    options.OnRejected = async (context, cancellationToken) =>
    {
        if (context.Lease.TryGetMetadata(MetadataName.RetryAfter, out var retryAfter))
        {
            context.HttpContext.Response.Headers.RetryAfter = ((int)retryAfter.TotalSeconds).ToString();
        }
        else
        {
            context.HttpContext.Response.Headers.RetryAfter = "60";
        }

        context.HttpContext.Response.StatusCode = 429;
        await context.HttpContext.Response.WriteAsync("{\"message\":\"Too many login attempts. Please try again later.\"}", cancellationToken);
    };

    options.AddPolicy("auth", httpContext =>
    {
        var ip = httpContext.Connection.RemoteIpAddress?.ToString() ?? "unknown-ip";

        return RateLimitPartition.GetFixedWindowLimiter(
            partitionKey: ip,
            factory: _ => new FixedWindowRateLimiterOptions
            {
                PermitLimit = 3,                     // allow 3 requests
                Window = TimeSpan.FromMinutes(1),    // per 1 minute window
                QueueLimit = 0,
                QueueProcessingOrder = QueueProcessingOrder.OldestFirst
            }
        );
    });
});

builder.Services.AddMediatR(cfg =>
{
    cfg.RegisterServicesFromAssemblyContaining<Program>();
});

// Add custom DI (Dependency Injection)
builder.Services.AddScoped<ICategoryRepository, CategoryRepository>();

builder.Services.AddScoped<IProductOptionRepository, ProductOptionRepository>();
builder.Services.AddScoped<IProductOptionService, ProductOptionService>();

builder.Services.AddScoped<IProductOptionValueRepository, ProductOptionValueRepository>();
builder.Services.AddScoped<IProductOptionValueService, ProductOptionValueService>();

builder.Services.AddScoped<IProductRepository, ProductRepository>();
builder.Services.AddScoped<IProductService, ProductService>();

builder.Services.AddScoped<IProductImageRepository, ProductImageRepository>();
builder.Services.AddScoped<IProductImageService, ProductImageService>();

builder.Services.AddScoped<IProductVariantOptionValueRepository, ProductVariantOptionValueRepository>();

builder.Services.AddScoped<IProductVariantRepository, ProductVariantRepository>();
builder.Services.AddScoped<IProductVariantService, ProductVariantService>();

builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IJwtService, JwtService>();

builder.Services.AddScoped<IOrderRepository, OrderRepository>();

builder.Services.AddScoped<IAdminDashboardReadRepository, AdminDashboardReadRepository>();
builder.Services.AddScoped<IAdminDashboardService, AdminDashboardService>();

builder.Services.AddScoped<IChatRepository, ChatRepository>();
builder.Services.AddScoped<IMessageRepository, MessageRepository>();

// builder.Services.AddHttpClient<GeminiClient>();
builder.Services.AddScoped<IGeminiAgentRepository, GeminiAgentRepository>();
builder.Services.AddScoped<IGeminiAgentService, GeminiAgentService>();
builder.Services.AddHttpClient<IGeminiAgentService, GeminiAgentService>(client =>
{
    client.Timeout = TimeSpan.FromSeconds(30);
});

builder.Services.AddScoped<MessageService>();

builder.Services.AddSignalR();

// JWT auth
if (string.IsNullOrEmpty(builder.Configuration["Jwt:Key"]))
{
    throw new InvalidOperationException("JWT Key is not configured in appsettings.json");
}

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = builder.Configuration["Jwt:Issuer"],
        ValidAudience = builder.Configuration["Jwt:Audience"],
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]!)),
        ValidateLifetime = true,
        ClockSkew = TimeSpan.Zero
    };

    options.Events = new JwtBearerEvents
    {
        OnMessageReceived = context =>
        {
            var cookieToken = context.Request.Cookies["auth_token"];
            if (!string.IsNullOrEmpty(cookieToken))
            {
                context.Token = cookieToken;    // Read token from HttpOnly cookie
                // Console.WriteLine("[JWT] Token read from cookie: " + cookieToken);
            }

            return Task.CompletedTask;
        },

        OnAuthenticationFailed = context =>
        {
            // Console.WriteLine($"[JWT] Authentication Failed: {context.Exception.Message}");
            return Task.CompletedTask;
        },

        OnTokenValidated = context =>
        {
            // Console.WriteLine("[JWT] Token Validated Successfully");
            return Task.CompletedTask;
        },

        OnChallenge = context =>
        {
            Console.WriteLine($"[JWT] Challenge: {context.ErrorDescription}");
            return Task.CompletedTask;
        }
    };
});

// ──────────────────────────────────────── 3. BUILD THE APPLICATION ────────────────────────────────────────
var app = builder.Build();

// ──────────────────────────────────────── 4. CONFIGURE THE HTTP REQUEST PIPELINE (CONFIGURE MIDDLEWARE) ────────────────────────────────────────
if (app.Environment.IsDevelopment())    // Enable Swagger only in Development
{
    // Swagger JSON is available at http://localhost:5159/swagger/v1/swagger.json
    // Swagger UI is available at http://localhost:5159/swagger/index.html
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("AllowFrontend");

app.UseRateLimiter();

app.UseAuthentication();
app.UseAuthorization();

// Security Headers Middleware
app.Use(async (context, next) =>
{
    var headers = context.Response.Headers;

    headers["XContentTypeOptions"] = "nosniff";                     // Prevent MIME type sniffing
    headers["XFrameOptions"] = "DENY";                              // Prevent clickjacking by disallowing framing
    headers["Referrer-Policy"] = "strict-origin-when-cross-origin"; // Control referrer information sent with requests
    headers["Permissions-Policy"] = "geolocation=()";               // Disable geolocation API for all origins

    headers["ContentSecurityPolicy"] = "default-src 'self'";        // Restrict content to same origin to mitigate XSS and data injection attacks

    headers["XXSSProtection"] = "1; mode=block";                    // Enable XSS protection in browsers (deprecated but still supported by some)

    headers.Remove("Server");                                       // Hide server information for security
    await next();
});

// ──────────────────────────────────────── 5. ENDPOINT MAPPING METHOD ────────────────────────────────────────
app.MapControllers();

app.MapHub<ChatHub>("/chatHub");

// ──────────────────────────────────────── 6. RUN THE APPLICATION ────────────────────────────────────────
// Log startup info
Console.WriteLine("Starting WebApp API...");
Console.WriteLine($"Listening on: http://localhost:5159");
Console.WriteLine($"Swagger JSON: http://localhost:5159/swagger/v1/swagger.json");
Console.WriteLine($"Swagger UI: http://localhost:5159/swagger/index.html");

app.Run();