using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using WebApp_API.DTOs;
using WebApp_API.Services;

namespace WebApp_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "Customer")]
    public class OrdersController : ControllerBase // API URL: /api/orders
    {
        private readonly IOrderService _orderService;

        public OrdersController(IOrderService orderService)
        {
            _orderService = orderService;
        }

        // POST api/orders - Create new order
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
            if (string.IsNullOrEmpty(userId))
                return Unauthorized();

            try
            {
                var order = await _orderService.CreateOrderAsync(request, int.Parse(userId));
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

        // GET api/orders/id/{id:int}/details - Get order by ID
        [HttpGet("id/{orderId:int}/details")]
        public async Task<IActionResult> GetOrderById(int orderId)
        {
            try
            {
                // Ensure the user can only access their own orders
                var userId = User.FindFirst("id")?.Value;
                if (string.IsNullOrEmpty(userId)) return Unauthorized();

                var order = await _orderService.GetOrderByIdAsync(orderId, int.Parse(userId));
                if (order is null) return NotFound(new { message = "Order not found" });

                return Ok(order);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error fetching order", error = ex.Message });
            }
        }

        // GET api/orders/id/{id:int}/detailswithitems - Get order by ID
        [HttpGet("id/{orderId:int}/detailswithitems")]
        public async Task<IActionResult> GetOrderWithItemsById(int orderId)
        {
            try
            {
                // Ensure the user can only access their own orders
                var userId = User.FindFirst("id")?.Value;
                if (string.IsNullOrEmpty(userId)) return Unauthorized();

                var order = await _orderService.GetOrderWithItemsByIdAsync(orderId, int.Parse(userId));
                if (order is null) return NotFound(new { message = "Order not found" });

                return Ok(order);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error fetching order", error = ex.Message });
            }
        }

        // GET api/orders/user/all - Get the current user's orders
        [HttpGet("user/all")]
        public async Task<IActionResult> GetAllOrdersByUserId()
        {
            try
            {
                var userId = User.FindFirst("id")?.Value;
                if (string.IsNullOrEmpty(userId)) return Unauthorized();

                var orders = await _orderService.GetOrdersByUserIdAsync(int.Parse(userId));
                return Ok(orders);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error fetching orders", error = ex.Message });
            }
        }
    }
}