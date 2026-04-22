using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WebApp_API.DTOs;
using WebApp_API.Services;
using WebApp_API.Specifications;

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
            var userIdClaim = User.FindFirst("id")?.Value;
            if (userIdClaim == null) return Unauthorized();
            var userId = int.Parse(userIdClaim);

            try
            {
                var profile = await _userService.GetByIdAsync(userId);
                return Ok(profile);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
        }

        [HttpGet("admin/email/{email}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetProfileByEmail(string email)
        {
            try
            {
                var profile = await _userService.GetByEmailAsync(email);
                return Ok(profile);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
        }

        [HttpGet("admin/phone/{phone}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetProfileByPhone(string phone)
        {
            try
            {
                var profile = await _userService.GetByPhoneAsync(phone);
                return Ok(profile);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
        }

        [HttpGet("admin")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetAll()
        {
            try
            {
                var usesprofile = await _userService.GetAllUsersAsync();
                return Ok(usesprofile);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
        }

        [HttpGet("admin/role/{role}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetUsersByRole(string role)
        {
            try
            {
                var usesprofile = await _userService.GetUsersByRoleAsync(role);
                return Ok(usesprofile);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
        }

        [HttpGet("admin/filters")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetUsersByFilters([FromQuery] UserDTOs.UsersFiltersParams parameter)
        {
            var spec = UserFiltersSpec.From(parameter);

            try
            {
                var usesprofile = await _userService.GetUsersByFiltersAsync(spec);
                return Ok(usesprofile);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
        }

        [HttpGet("admin/users")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetUsers(string role)
        {
            try
            {
                var usesprofile = await _userService.GetUsersByRoleAsync(role);
                return Ok(usesprofile);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
        }

        [HttpPut("profile")]
        [Authorize]
        public async Task<IActionResult> UpdateProfile(UserDTOs.ProfileUpdateRequest dto)
        {
            var userIdClaim = User.FindFirst("id")?.Value;
            if (userIdClaim == null) return Unauthorized();
            var userId = int.Parse(userIdClaim);

            await _userService.UpdateAsync(userId, dto);

            return Ok(new { message = "Profile updated" });
        }
    }
}
