using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WebApp_API.Services;

namespace WebApp_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "Admin")]
    public class AdminDashboardController : ControllerBase // API Endpoint: /api/admindashboard
    {
        private readonly IAdminDashboardService _service;
        public AdminDashboardController(IAdminDashboardService service)
        {
            _service = service;
        }

        // GET: /api/admindashboard - Get all dashboard data
        [HttpGet]
        public async Task<IActionResult> GetDashboardData()
        {
            try
            {
                var res = await _service.GetSummary();
                return Ok(res);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error fetching dashboard data", error = ex.Message });
            }
        }
    }
}