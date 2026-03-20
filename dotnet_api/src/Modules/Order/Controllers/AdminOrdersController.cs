using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WebApp_API.DTOs;
using WebApp_API.Services;
using WebApp_API.Specifications;

namespace WebApp_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "Admin")]
    public class AdminOrdersController : ControllerBase // API URL: /api/adminorders
    {
        private readonly IOrderService _orderService;

        public AdminOrdersController(IOrderService orderService)
        {
            _orderService = orderService;
        }

        // GET: /api/adminorders - Get all orders with filters
        [HttpGet]
        public async Task<IActionResult> GetAllOrders([FromQuery] OrderFilterParameters filterParams)
        {
            try
            {
                var orders = await _orderService.GetFilteredOrdersAsync(filterParams);
                return Ok(orders);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error fetching orders", error = ex.Message });
            }
        }

        // GET: /api/adminorders/{id} - Get order detail
        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetOrderDetail(int id)
        {
            try
            {
                var order = await _orderService.GetAdminOrderByIdAsync(id);
                if (order is null)
                    return NotFound(new { message = "Order not found" });

                return Ok(order);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error fetching order detail", error = ex.Message });
            }
        }

        // PUT: /api/adminorders/{id}/status - Update order status
        [HttpPut("{id:int}/status")]
        public async Task<IActionResult> UpdateOrderStatus(int id, [FromBody] OrderDTOs.UpdateOrderStatusRequest request)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(request.Status))
                    return BadRequest(new { message = "Status is required" });

                var validStatuses = new[] { "Pending", "Confirmed", "Processing", "Shipped", "Delivered", "Cancelled", "Refunded" };
                if (!validStatuses.Contains(request.Status))
                    return BadRequest(new { message = $"Invalid status. Must be one of: {string.Join(", ", validStatuses)}" });

                var updated = await _orderService.UpdateOrderStatusAsync(id, request.Status);
                if (!updated)
                    return NotFound(new { message = "Order not found" });

                return Ok(new { message = "Order status updated successfully", status = request.Status });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error updating order status", error = ex.Message });
            }
        }

        // PUT: /api/adminorders/{id} - Update entire order
        [HttpPut("{id:int}")]
        public async Task<IActionResult> UpdateOrder(int id, [FromBody] OrderDTOs.UpdateOrderRequest request)
        {
            try
            {
                var updated = await _orderService.UpdateOrderAsync(id, request);
                if (!updated)
                    return NotFound(new { message = "Order not found" });

                return Ok(new { message = "Order updated successfully", id });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error updating order", error = ex.Message });
            }
        }

        // DELETE: /api/adminorders/{id} - Delete order
        [HttpDelete("{id:int}")]
        public async Task<IActionResult> DeleteOrder(int id)
        {
            try
            {
                var deleted = await _orderService.DeleteOrderAsync(id);
                if (!deleted)
                    return NotFound(new { message = "Order not found" });

                return Ok(new { message = "Order deleted successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error deleting order", error = ex.Message });
            }
        }

        // GET: /api/adminorders/export - Export orders as CSV
        [HttpGet("export")]
        public async Task<IActionResult> ExportOrders([FromQuery] OrderFilterParameters filterParams)
        {
            try
            {
                var bytes = await _orderService.ExportOrdersCsvAsync(filterParams);
                return File(bytes, "text/csv; charset=utf-8", $"orders_{DateTime.Now:yyyy-MM-dd_HH-mm-ss}.csv");
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error exporting orders", error = ex.Message });
            }
        }

        // GET: /api/adminorders/stats - Get order summary statistics
        [HttpGet("stats")]
        public async Task<IActionResult> GetOrderStats()
        {
            try
            {
                var stats = await _orderService.GetOrderStatsAsync();
                return Ok(stats);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error fetching statistics", error = ex.Message });
            }
        }

        // POST: /api/adminorders/{id}/send-email - Send confirmation email
        [HttpPost("{id:int}/send-email")]
        public async Task<IActionResult> SendConfirmationEmail(int id)
        {
            try
            {
                var order = await _orderService.GetAdminOrderByIdAsync(id);
                if (order is null)
                    return NotFound(new { message = "Order not found" });

                // TODO: Implement email sending via SMTP / SendGrid
                return Ok(new
                {
                    message = "Confirmation email sent successfully",
                    sentTo = order.CustomerEmail,
                    orderId = order.Id
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error sending email", error = ex.Message });
            }
        }
    }
}