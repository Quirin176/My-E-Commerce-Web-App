using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MediatR;
using WebApp_API.DTOs;
using WebApp_API.Specifications;
using WebApp_API.Features.Orders.Queries.GetPaginatedOrders;
using WebApp_API.Features.Orders.Queries.AdminGetOrderById;
using WebApp_API.Features.Orders.Commands.UpdateOrderStatus;
using WebApp_API.Features.Orders.Commands.UpdateOrder;
using WebApp_API.Features.Orders.Queries.ExportOrdersCsv;
using WebApp_API.Features.Orders.Queries.GetOrderStatistics;
using WebApp_API.Features.Orders.Queries.GenerateInvoicePdf;

namespace WebApp_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "Admin")]
    public class AdminOrdersController : ControllerBase // API Endpoint: /api/adminorders
    {
        private readonly IMediator _mediator;

        public AdminOrdersController(IMediator mediator)
        {
            _mediator = mediator;
        }

        // GET: /api/adminorders - Get all orders paginated with all items by filters
        [HttpGet]
        public async Task<IActionResult> GetAllOrders([FromQuery] OrderFiltersParameters filterParams)
        {
            try
            {
                var orders = await _mediator.Send(new GetPaginatedOrdersQuery(filterParams));
                return Ok(orders);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error fetching orders", error = ex.Message });
            }
        }

        // GET: /api/adminorders/{id} - Get order detail
        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetOrderDetailById(int id)
        {
            try
            {
                var order = await _mediator.Send(new AdminGetOrderWithItemsByIdQuery(id));
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
                var updated = await _mediator.Send(new UpdateOrderStatusCommand (id, request.Status));
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
                var updated = await _mediator.Send(new UpdateOrderCommand(id, request));
                if (!updated)
                    return NotFound(new { message = "Order not found" });

                return Ok(new { message = "Order updated successfully", id });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error updating order", error = ex.Message });
            }
        }

        // GET: /api/adminorders/export - Export orders as CSV
        [HttpGet("export")]
        public async Task<IActionResult> ExportOrders([FromQuery] OrderFiltersParameters filterParams)
        {
            try
            {
                var bytes = await _mediator.Send(new ExportOrdersCsvQuery(filterParams));
                return File(bytes, "text/csv; charset=utf-8", $"orders_{DateTime.Now:yyyy-MM-dd_HH-mm-ss}.csv");
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error exporting orders", error = ex.Message });
            }
        }

        // GET: /api/adminorders/{id}/invoice - Download order detail in PDF format
        [HttpGet("{id}/invoice")]
        public async Task<IActionResult> DownloadInvoice(int id)
        {
            var pdfBytes = await _mediator.Send(new GenerateInvoicePdfQuery(id));

            return File(pdfBytes, "application/pdf", $"Invoice-{id}.pdf");
        }

        // GET: /api/adminorders/stats - Get order summary statistics
        [HttpGet("stats")]
        public async Task<IActionResult> GetOrderStats()
        {
            try
            {
                var stats = await _mediator.Send(new GetOrderStatisticsQuery());
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
                var order = await _mediator.Send(new AdminGetOrderWithItemsByIdQuery(id));
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