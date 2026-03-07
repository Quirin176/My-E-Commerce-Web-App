using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using WebApp_API.Data;
using WebApp_API.DTOs;
using WebApp_API.Models;

namespace WebApp_API.Controllers
{
    // Route : api/auth
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly AppDbContext _db;
        private readonly IConfiguration _config;

        public AuthController(AppDbContext db, IConfiguration config)
        {
            _db = db;
            _config = config;
        }

        // -------------------- SIGNUP --------------------
        [HttpPost("signup")]
        public async Task<IActionResult> Signup([FromBody] AuthDTOs.SignupRequest req)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(req.Username) ||
                    string.IsNullOrWhiteSpace(req.Email) ||
                    string.IsNullOrWhiteSpace(req.Password) ||
                    string.IsNullOrWhiteSpace(req.Phone))
                    return BadRequest(new { message = "Missing Sign Up Information" });

                if (await _db.Users.AnyAsync(u => u.Email == req.Email))
                    return Conflict(new { message = "Email already registered" });

                if (await _db.Users.AnyAsync(u => u.Phone == req.Phone))
                    return Conflict(new { message = "Phone number already registered" });

                var hash = BCrypt.Net.BCrypt.HashPassword(req.Password);

                var user = new User
                {
                    Username = req.Username,
                    Email = req.Email,
                    PasswordHash = hash,
                    CreatedAt = DateTime.UtcNow,
                    Role = "Customer",
                    Phone = req.Phone,
                };

                _db.Users.Add(user);
                await _db.SaveChangesAsync();

                var token = GenerateJwt(user);

                var resp = new AuthDTOs.AuthResponse(token, user.Id, user.Username, user.Email, user.Phone, user.Role, user.CreatedAt);
                return Created("", resp);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Server error", error = ex.Message });
            }
        }

        // -------------------- LOGIN --------------------
        [HttpPost("login")]
        [EnableRateLimiting("auth")]
        public async Task<IActionResult> Login([FromBody] AuthDTOs.LoginRequest req)
        {
            try
            {
                var user = await _db.Users.SingleOrDefaultAsync(u => u.Email == req.Email);

                if (user == null)
                    return Unauthorized(new { message = "Invalid credentials" });

                bool verified = BCrypt.Net.BCrypt.Verify(req.Password, user.PasswordHash);
                if (!verified)
                    return Unauthorized(new { message = "Invalid credentials" });

                var token = GenerateJwt(user);

                var resp = new AuthDTOs.AuthResponse(token, user.Id, user.Username, user.Email, user.Phone, user.Role, user.CreatedAt);
                return Ok(resp);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Server error", error = ex.Message });
            }
        }

        // -------------------- JWT GENERATOR --------------------
        private string GenerateJwt(User user)
        {
            try
            {
                var jwtSection = _config.GetSection("Jwt");
                var key = Encoding.UTF8.GetBytes(jwtSection.GetValue<string>("Key"));
                var issuer = jwtSection.GetValue<string>("Issuer");
                var audience = jwtSection.GetValue<string>("Audience");
                var expiresInMinutes = jwtSection.GetValue<int>("ExpiresInMinutes");

                Console.WriteLine($"[JWT] Generating token for user: {user.Username}");
                Console.WriteLine($"[JWT] ExpiresInMinutes from config: {expiresInMinutes}");

                var claims = new List<Claim>
                {
                    new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
                    new Claim("id", user.Id.ToString()),
                    // new Claim("username", user.Username),
                    // new Claim("email", user.Email),
                    new Claim(ClaimTypes.Role, user.Role)
                };

                var creds = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256);
                
                var expiration = DateTime.UtcNow.AddMinutes(expiresInMinutes);
                Console.WriteLine($"[JWT] Token created: {DateTime.UtcNow:O}");
                Console.WriteLine($"[JWT] Token expires: {expiration:O}");
                Console.WriteLine($"[JWT] Duration: {expiresInMinutes} minutes");

                var token = new JwtSecurityToken(
                    issuer: issuer,
                    audience: audience,
                    claims: claims,
                    expires: expiration,
                    signingCredentials: creds
                );

                var tokenString = new JwtSecurityTokenHandler().WriteToken(token);
                Console.WriteLine($"[JWT] Token generated successfully");
                return tokenString;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[JWT] Error generating token: {ex.Message}");
                throw;
            }
        }
    }
}
