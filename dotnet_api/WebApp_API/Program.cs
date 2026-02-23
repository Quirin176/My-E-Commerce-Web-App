using System.Text;
using System.Threading.RateLimiting;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using WebApp_API.Data;
using WebApp_API.Models;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// DbContext
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// CORS - allow your frontend origin
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
        policy.WithOrigins("http://localhost:5173", "http://localhost:3000")
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials());
});

builder.Services.AddRateLimiter(options =>
{
    options.RejectionStatusCode = 429;
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

// JWT auth
var jwtKey = builder.Configuration["Jwt:Key"];
var jwtIssuer = builder.Configuration["Jwt:Issuer"];
var jwtAudience = builder.Configuration["Jwt:Audience"];
var jwtExpiresInMinutes = builder.Configuration.GetValue<int>("Jwt:ExpiresInMinutes");

Console.WriteLine("========== JWT Configuration ==========");
Console.WriteLine($"Key exists: {!string.IsNullOrEmpty(jwtKey)}");
Console.WriteLine($"Issuer: {jwtIssuer}");
Console.WriteLine($"Audience: {jwtAudience}");
Console.WriteLine($"ExpiresInMinutes: {jwtExpiresInMinutes}");
Console.WriteLine("=======================================");

if (string.IsNullOrEmpty(jwtKey))
{
    throw new InvalidOperationException("JWT Key is not configured in appsettings.json");
}

var key = Encoding.UTF8.GetBytes(jwtKey);
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
        ValidIssuer = jwtIssuer,
        ValidAudience = jwtAudience,
        IssuerSigningKey = new SymmetricSecurityKey(key),
        ValidateLifetime = true,
        ClockSkew = TimeSpan.Zero
    };
    options.Events = new JwtBearerEvents
    {
        OnAuthenticationFailed = context =>
        {
            Console.WriteLine($"[JWT] Authentication Failed: {context.Exception.Message}");
            return Task.CompletedTask;
        },
        OnTokenValidated = context =>
        {
            Console.WriteLine("[JWT] Token Validated Successfully");
            return Task.CompletedTask;
        },
        OnChallenge = context =>
        {
            Console.WriteLine($"[JWT] Challenge: {context.ErrorDescription}");
            return Task.CompletedTask;
        }
    };
});

var app = builder.Build();

// Configure the HTTP request pipeline
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("AllowFrontend");

app.UseAuthentication();
app.UseAuthorization();

app.UseRateLimiter();

app.MapControllers();

// Log startup info
Console.WriteLine("Starting WebApp API...");
Console.WriteLine($"Listening on: http://localhost:5159");
Console.WriteLine($"Swagger: http://localhost:5159/swagger");

app.Run();
