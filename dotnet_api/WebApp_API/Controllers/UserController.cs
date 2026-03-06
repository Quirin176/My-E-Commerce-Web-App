using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WebApp_API.Data;
using WebApp_API.DTOs;
using WebApp_API.Models;

namespace WebApp_API.Controllers
{
    [ApiController]
    [Route("api/user")]
    public class UserController : ControllerBase    // API URL: /api/user
    {
        private readonly AppDbContext _db;

        public UserController(AppDbContext db)
        {
            _db = db;
        }

        // GET /api/user/profile
        [HttpGet("profile")]
        [Authorize]
        public async Task<IActionResult> GetProfile()
        {
            var userId = User.FindFirst("id")?.Value;
            if (userId == null) return Unauthorized();

            var user = await _db.Users.FindAsync(int.Parse(userId));
            if (user == null) return NotFound();

            return Ok(new UserDTOs.ProfileRequest
            {
                Username = user.Username,
                Email = user.Email,
                Phone = user.Phone,
                Role = user.Role,
                CreatedAt = user.CreatedAt,
            });
        }

        // PUT /api/user/profile
        [HttpPut("profile")]
        [Authorize]
        public async Task<IActionResult> UpdateProfile([FromBody] UserDTOs.ProfileUpdateRequest req)
        {
            var userId = User.FindFirst("id")?.Value;
            if (userId == null) return Unauthorized();

            var user = await _db.Users.FindAsync(int.Parse(userId));
            if (user == null) return NotFound();

            user.Username = req.Username;
            user.Email = req.Email;
            user.Phone = req.Phone;

            await _db.SaveChangesAsync();

            return Ok(new { message = "Profile updated" });
        }
    }
}
