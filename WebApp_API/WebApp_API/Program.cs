using System.Text;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
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

// JWT auth
var jwtKey = builder.Configuration["Jwt:Key"];
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
        ValidIssuer = builder.Configuration["Jwt:Issuer"],
        ValidAudience = builder.Configuration["Jwt:Audience"],
        IssuerSigningKey = new SymmetricSecurityKey(key),
        ValidateLifetime = true
    };
    options.Events = new JwtBearerEvents
    {
        OnAuthenticationFailed = context =>
        {
            Console.WriteLine($"JWT Authentication Failed: {context.Exception.Message}");
            return Task.CompletedTask;
        },
        OnTokenValidated = context =>
        {
            Console.WriteLine("JWT Token Validated");
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

app.MapControllers();

// Log startup info
Console.WriteLine("Starting WebApp API...");
Console.WriteLine($"Listening on: http://localhost:5159");
Console.WriteLine($"Swagger: http://localhost:5159/swagger");

// Seed sample data
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();

    try
    {
        // Check if category exists before seeding
        var category = db.Categories.FirstOrDefault(c => c.Id == 3);
        if (category == null)
        {
            Console.WriteLine("Warning: Category with ID 3 (Keyboard) not found. Skipping filter seeding.");
        }
        else if (!db.ProductOptions.Any(po => po.CategoryId == 3))
        {
            Console.WriteLine("Seeding ProductOptions and ProductOptionValues...");

            // Add ProductOptions
            var colorOption = new ProductOption { Name = "Color", CategoryId = 3 };
            var sizeOption = new ProductOption { Name = "Size", CategoryId = 3 };

            db.ProductOptions.Add(colorOption);
            db.ProductOptions.Add(sizeOption);
            db.SaveChanges();

            Console.WriteLine("ProductOptions created");

            // Add ProductOptionValues
            var blackValue = new ProductOptionValue { Value = "Black", ProductOptionId = colorOption.Id };
            var whiteValue = new ProductOptionValue { Value = "White", ProductOptionId = colorOption.Id };
            var redValue = new ProductOptionValue { Value = "Red", ProductOptionId = colorOption.Id };

            var smallValue = new ProductOptionValue { Value = "Small", ProductOptionId = sizeOption.Id };
            var mediumValue = new ProductOptionValue { Value = "Medium", ProductOptionId = sizeOption.Id };
            var largeValue = new ProductOptionValue { Value = "Large", ProductOptionId = sizeOption.Id };

            db.ProductOptionValues.AddRange(blackValue, whiteValue, redValue, smallValue, mediumValue, largeValue);
            db.SaveChanges();

            Console.WriteLine("ProductOptionValues created");

            // Link to products in Keyboard category
            var keyboardProducts = db.Products.Where(p => p.CategoryId == 3).ToList();

            if (keyboardProducts.Count > 0)
            {
                foreach (var product in keyboardProducts)
                {
                    // Only add if not already linked
                    var existingFilters = db.ProductFilters.Where(pf => pf.ProductId == product.Id).Count();

                    if (existingFilters == 0)
                    {
                        // Link first product to Black and Small
                        db.ProductFilters.Add(new ProductFilter { ProductId = product.Id, OptionValueId = blackValue.Id });
                        db.ProductFilters.Add(new ProductFilter { ProductId = product.Id, OptionValueId = smallValue.Id });
                        break; // Only seed first product
                    }
                }
                db.SaveChanges();
                Console.WriteLine("ProductFilters created");
            }
            else
            {
                Console.WriteLine("No products found in Keyboard category. Skipping ProductFilter seeding.");
            }
        }
        else
        {
            Console.WriteLine("ProductOptions already seeded. Skipping.");
        }
    }
    catch (Exception ex)
    {
        Console.WriteLine($"Error during seeding: {ex.Message}");
        Console.WriteLine($"Inner Exception: {ex.InnerException?.Message}");
        Console.WriteLine($"Stack Trace: {ex.StackTrace}");
    }
}

app.Run();
