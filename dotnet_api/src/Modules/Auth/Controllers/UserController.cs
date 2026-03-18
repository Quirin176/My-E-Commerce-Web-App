// using Microsoft.AspNetCore.Authorization;
// using Microsoft.AspNetCore.Mvc;
// using Microsoft.EntityFrameworkCore;
// using WebApp_API.Data;
// using WebApp_API.DTOs;

// namespace WebApp_API.Controllers
// {
//     [ApiController]
//     [Route("api/user")]
//     public class UserController : ControllerBase    // API URL: /api/user
//     {
//         private readonly AppDbContext _db;

//         public UserController(AppDbContext db)
//         {
//             _db = db;
//         }

//         // GET /api/user/profile
//         [HttpGet("profile")]
//         [Authorize]
//         public async Task<IActionResult> GetProfile()
//         {
//             var userId = User.FindFirst("id")?.Value;
//             if (userId == null) return Unauthorized();

//             var user = await _db.Users.FindAsync(int.Parse(userId));
//             if (user == null) return NotFound();

//             return Ok(new UserDTOs.ProfileResponse
//             {
//                 Username = user.Username,
//                 Email = user.Email,
//                 Phone = user.Phone,
//                 Role = user.Role,
//                 CreatedAt = user.CreatedAt,
//             });
//         }

//         // PUT /api/user/profile
//         [HttpPut("profile")]
//         [Authorize]
//         public async Task<IActionResult> UpdateProfile([FromBody] UserDTOs.ProfileUpdateRequest req)
//         {
//             var userIdClaim = User.FindFirst("id")?.Value;
//             if (userIdClaim == null) return Unauthorized();

//             int userId = int.Parse(userIdClaim);

//             var user = await _db.Users.FindAsync(userId);
//             if (user == null) return NotFound();

//             bool emailTaken = await _db.Users
//                 .AnyAsync(u => u.Email == req.Email && u.Id != userId);

//             bool phoneTaken = await _db.Users
//                 .AnyAsync(u => u.Phone == req.Phone && u.Id != userId);

//             if (emailTaken)
//                 return Conflict(new { message = "Email already in use" });

//             if (phoneTaken)
//                 return Conflict(new { message = "Phone number already in use" });

//             user.Username = req.Username;
//             user.Email = req.Email;
//             user.Phone = req.Phone;

//             await _db.SaveChangesAsync();

//             return Ok(new { message = "Profile updated" });
//         }
//     }
// }
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WebApp_API.DTOs;
using WebApp_API.Services;

namespace WebApp_API.Controllers
{
    [ApiController]
    [Route("api/user")]
    public class UserController : ControllerBase    // API Endpoint: /api/user
    {
        private readonly IUserService _userService;

        public UserController(IUserService userService)
        {
            _userService = userService;
        }

        [HttpGet("profile")]
        [Authorize]
        public async Task<IActionResult> GetProfile()
        {
            var userId = int.Parse(User.FindFirst("id").Value);
            var profile = await _userService.GetByIdAsync(userId);
            return Ok(profile);
        }

        [HttpPut("profile")]
        [Authorize]
        public async Task<IActionResult> UpdateProfile(UserDTOs.ProfileUpdateRequest dto)
        {
            var userId = int.Parse(User.FindFirst("id").Value);
            await _userService.UpdateAsync(userId, dto);
            return Ok(new { message = "Profile updated" });
        }
    }
}
