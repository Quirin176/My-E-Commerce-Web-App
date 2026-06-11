using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MediatR;
using WebApp_API.DTOs;
using WebApp_API.Features.Orders.Queries.GetOrderById;
using WebApp_API.Features.Orders.Queries.GetOrderWithItemsById;
using WebApp_API.Features.Orders.Queries.GetOrdersByUserId;
using WebApp_API.Features.Orders.Queries.GenerateInvoicePdf;
using WebApp_API.Features.Orders.Commands.CreateOrder;

namespace WebApp_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "Customer")]
    public class UserOrdersController : ControllerBase // API URL: /api/orders
    {
        private readonly IMediator _mediator;

        public UserOrdersController(IMediator mediator)
        {
            _mediator = mediator;
        }

        // GET api/userorders/id/{id:int}/details - Get order by ID
        [HttpGet("id/{orderId:int}/details")]
        public async Task<IActionResult> GetOrderById(int orderId)
        {
            try
            {
                // Ensure the user can only access their own orders
                var userId = User.FindFirst("id")?.Value;
                if (string.IsNullOrEmpty(userId)) return Unauthorized();

                var order = await _mediator.Send(new GetOrderByIdQuery(orderId, int.Parse(userId)));
                if (order is null) return NotFound(new { message = "Order not found" });

                return Ok(order);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error fetching order", error = ex.Message });
            }
        }

        // GET api/userorders/id/{id:int}/detailswithitems - Get order with items by ID
        [HttpGet("id/{orderId:int}/detailswithitems")]
        public async Task<IActionResult> GetOrderWithItemsById(int orderId)
        {
            try
            {
                // Ensure the user can only access their own orders
                var userId = User.FindFirst("id")?.Value;
                if (string.IsNullOrEmpty(userId)) return Unauthorized();

                var order = await _mediator.Send(new GetOrderWithItemsByIdQuery(orderId, int.Parse(userId)));
                if (order is null) return NotFound(new { message = "Order not found" });

                return Ok(order);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error fetching order", error = ex.Message });
            }
        }

        // GET api/userorders/user/all - Get the current user's orders
        [HttpGet("user/all")]
        public async Task<IActionResult> GetAllOrdersByUserId()
        {
            try
            {
                var userId = User.FindFirst("id")?.Value;
                if (string.IsNullOrEmpty(userId)) return Unauthorized();

                var orders = await _mediator.Send(new GetOrdersByUserIdQuery(int.Parse(userId)));
                return Ok(orders);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error fetching orders", error = ex.Message });
            }
        }

        // GET: api/userorders/{id}/invoice - Download order detail in PDF format
        [HttpGet("{id}/invoice")]
        public async Task<IActionResult> DownloadInvoice(int id)
        {
            var pdfBytes = await _mediator.Send(new GenerateInvoicePdfQuery(id));

            return File(pdfBytes, "application/pdf", $"Invoice-{id}.pdf");
        }

        // POST api/userorders - Create new order
        [HttpPost]
        public async Task<IActionResult> CreateOrder([FromBody] OrderDTOs.CreateOrderRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.CustomerName))
                return BadRequest(new { message = "Customer name is required" });

            if (string.IsNullOrWhiteSpace(request.CustomerEmail))
                return BadRequest(new { message = "Email is required" });

            if (request.OrderItems == null || request.OrderItems.Count == 0)
                return BadRequest(new { message = "Order must contain at least one item" });

            if (request.TotalAmount <= 0)
                return BadRequest(new { message = "Total amount must be greater than 0" });

            var userId = User.FindFirst("id")?.Value;
            if (string.IsNullOrEmpty(userId)) return Unauthorized();

            try
            {
                var order = await _mediator.Send(new CreateOrderCommand(request, int.Parse(userId)));
                return CreatedAtAction(nameof(GetOrderById), new { id = order.Id }, new
                {
                    order.Id,
                    order.CustomerName,
                    order.TotalAmount,
                    order.Status,
                    order.OrderDate
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error creating order", error = ex.Message });
            }
        }
    }
}