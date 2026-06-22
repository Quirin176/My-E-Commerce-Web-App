using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.OutputCaching;
using MediatR;
using WebApp_API.Features.AdminDashboard.Queries;

namespace WebApp_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "Admin")]
    public class AdminDashboardController : ControllerBase // API Endpoint: /api/admindashboard
    {
        private readonly IMediator _mediator;
        public AdminDashboardController(IMediator mediator)
        {
            _mediator = mediator;
        }

        // GET: /api/admindashboard - Get all dashboard data
        // [OutputCache(PolicyName = "Admin_Dashboard")]
        [HttpGet]
        public async Task<IActionResult> GetDashboardData([FromQuery] int topRecentOrdersAmount, int topSellingProductsAmount, int topNewestProductsAmount)
        {
            try
            {
                var result = await _mediator.Send(new GetAdminDashboardSummaryQuery(topRecentOrdersAmount, topSellingProductsAmount, topNewestProductsAmount));

                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error fetching dashboard data", error = ex.Message });
            }
        }
    }
}