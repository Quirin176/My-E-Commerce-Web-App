// using Microsoft.AspNetCore.Authorization;
// using Microsoft.AspNetCore.Mvc;
// using Microsoft.EntityFrameworkCore;
// using System.Security.Claims;
// using WebApp_API.Data;
// using WebApp_API.DTOs;
// using WebApp_API.Entities;

// namespace WebApp_API.Controllers
// {
//     [Route("api/[controller]")]
//     [ApiController]
//     [Authorize(Roles = "Customer")]
//     public class OrdersController : ControllerBase // API URL: /api/orders
//     {
//         private readonly AppDbContext _db;
//         public OrdersController(AppDbContext db) => _db = db;

//         // ==================== CUSTOMER METHODS ====================
//         // POST api/orders - Create new order
//         [HttpPost]
//         public async Task<IActionResult> CreateOrder([FromBody] OrderDTOs.CreateOrderRequest request)
//         {
//             try
//             {
//                 if (string.IsNullOrWhiteSpace(request.CustomerName))
//                     return BadRequest(new { message = "Customer name is required" });

//                 if (string.IsNullOrWhiteSpace(request.CustomerEmail))
//                     return BadRequest(new { message = "Email is required" });

//                 if (request.OrderItems == null || request.OrderItems.Count == 0)
//                     return BadRequest(new { message = "Order must contain at least one item" });

//                 if (request.TotalAmount <= 0)
//                     return BadRequest(new { message = "Total amount must be greater than 0" });

//                 var userId = User.FindFirst("id")?.Value;
//                 if (string.IsNullOrEmpty(userId))
//                     return Unauthorized();

//                 var order = new Order
//                 {
//                     UserId = int.Parse(userId),
//                     CustomerName = request.CustomerName,
//                     CustomerEmail = request.CustomerEmail,
//                     CustomerPhone = request.CustomerPhone,
//                     ShippingAddress = request.ShippingAddress,
//                     City = request.City,
//                     TotalAmount = request.TotalAmount,
//                     PaymentMethod = request.PaymentMethod,
//                     Status = request.Status ?? "Pending",
//                     Notes = request.Notes,
//                     CreatedAt = DateTime.UtcNow,
//                     OrderDate = DateTime.UtcNow
//                 };

//                 _db.Orders.Add(order);
//                 await _db.SaveChangesAsync();

//                 foreach (var item in request.OrderItems)
//                 {
//                     var orderItem = new OrderItem
//                     {
//                         OrderId = order.Id,
//                         ProductId = item.ProductId,
//                         ProductName = item.ProductName,
//                         Quantity = item.Quantity,
//                         UnitPrice = item.UnitPrice,
//                         TotalPrice = item.TotalPrice
//                     };
//                     _db.OrderItems.Add(orderItem);
//                 }

//                 await _db.SaveChangesAsync();

//                 // Console.WriteLine($"[ORDER] Order created: {order.Id} for user {userId}");

//                 return CreatedAtAction(nameof(GetOrder), new { id = order.Id }, new
//                 {
//                     order.Id,
//                     order.CustomerName,
//                     order.TotalAmount,
//                     order.Status,
//                     order.OrderDate
//                 });
//             }
//             catch (Exception ex)
//             {
//                 // Console.WriteLine($"[ORDER] Error creating order: {ex.Message}");
//                 return StatusCode(500, new { message = "Error creating order", error = ex.Message });
//             }
//         }

//         // GET api/orders/{id} - Get order by ID with full details including items
//         [HttpGet("{id}")]
//         public async Task<IActionResult> GetOrder(int id)
//         {
//             try
//             {
//                 var order = await _db.Orders
//                     .Include(o => o.OrderItems)
//                     .FirstOrDefaultAsync(o => o.Id == id);

//                 if (order == null)
//                     return NotFound(new { message = "Order not found" });

//                 // Check if user is authorized to view this order
//                 var userId = User.FindFirst("id")?.Value;
//                 var userRole = User.FindFirst(ClaimTypes.Role)?.Value;

//                 if (string.IsNullOrEmpty(userId))
//                     return Unauthorized();

//                 if (userRole != "Admin" && order.UserId != int.Parse(userId))
//                     return Forbid();

//                 return Ok(new OrderDTOs.OrderResponse
//                 {
//                     Id = order.Id,
//                     CustomerName = order.CustomerName,
//                     CustomerEmail = order.CustomerEmail,
//                     CustomerPhone = order.CustomerPhone,
//                     ShippingAddress = order.ShippingAddress,
//                     City = order.City,
//                     TotalAmount = order.TotalAmount,
//                     PaymentMethod = order.PaymentMethod,
//                     Status = order.Status,
//                     OrderDate = order.OrderDate,
//                     Notes = order.Notes,
//                     Items = order.OrderItems.Select(orderitem => new OrderItemDTOs.OrderItemResponse
//                     {
//                         ProductId = orderitem.ProductId,
//                         ProductName = orderitem.ProductName,
//                         Quantity = orderitem.Quantity,
//                         UnitPrice = orderitem.UnitPrice,
//                         TotalPrice = orderitem.TotalPrice
//                     }).ToList()
//                 });
//             }
//             catch (Exception ex)
//             {
//                 // Console.WriteLine($"[ORDER] Error fetching order: {ex.Message}");
//                 return StatusCode(500, new { message = "Error fetching order", error = ex.Message });
//             }
//         }

//         // GET api/orders/user/my-orders - Get user's orders with summary information
//         [HttpGet("user/my-orders")]
//         public async Task<IActionResult> GetUserOrders()
//         {
//             try
//             {
//                 var userId = User.FindFirst("id")?.Value;
//                 if (string.IsNullOrEmpty(userId))
//                     return Unauthorized();

//                 var orders = await _db.Orders
//                     .Where(o => o.UserId == int.Parse(userId))
//                     .Include(o => o.OrderItems)
//                     .OrderByDescending(o => o.OrderDate)
//                     .ToListAsync();

//                 // Return with full item details
//                 var response = orders.Select(o => new OrderDTOs.OrderResponse
//                 {
//                     Id = o.Id,
//                     CustomerName = o.CustomerName,
//                     CustomerEmail = o.CustomerEmail,
//                     CustomerPhone = o.CustomerPhone,
//                     ShippingAddress = o.ShippingAddress,
//                     City = o.City,
//                     TotalAmount = o.TotalAmount,
//                     Status = o.Status,
//                     PaymentMethod = o.PaymentMethod,
//                     OrderDate = o.OrderDate,
//                     Notes = o.Notes,
//                     ItemCount = o.OrderItems.Count,
//                     Items = o.OrderItems.Select(oi => new OrderItemDTOs.OrderItemResponse
//                     {
//                         ProductId = oi.ProductId,
//                         ProductName = oi.ProductName,
//                         Quantity = oi.Quantity,
//                         UnitPrice = oi.UnitPrice,
//                         TotalPrice = oi.TotalPrice
//                     }).ToList()
//                 }).ToList();

//                 return Ok(response);
//             }
//             catch (Exception ex)
//             {
//                 // Console.WriteLine($"[ORDER] Error fetching user orders: {ex.Message}");
//                 return StatusCode(500, new { message = "Error fetching orders", error = ex.Message });
//             }
//         }
//     }
// }
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
                return CreatedAtAction(nameof(GetOrder), new { id = order.Id }, new
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

        // GET api/orders/{id} - Get order by ID
        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetOrder(int id)
        {
            try
            {
                var order = await _orderService.GetOrderByIdAsync(id);
                if (order is null)
                    return NotFound(new { message = "Order not found" });

                // Customers can only view their own orders
                var userId = User.FindFirst("id")?.Value;
                var userRole = User.FindFirst(ClaimTypes.Role)?.Value;

                if (string.IsNullOrEmpty(userId))
                    return Unauthorized();

                // Note: OrderResponse doesn't expose UserId, so we re-fetch from service if needed.
                // A cleaner approach is to let the service enforce ownership:
                var fullOrder = await _orderService.GetAdminOrderByIdAsync(id);
                if (userRole != "Admin" && fullOrder?.UserId != int.Parse(userId))
                    return Forbid();

                return Ok(order);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error fetching order", error = ex.Message });
            }
        }

        // GET api/orders/user/my-orders - Get the current user's orders
        [HttpGet("user/my-orders")]
        public async Task<IActionResult> GetUserOrders()
        {
            try
            {
                var userId = User.FindFirst("id")?.Value;
                if (string.IsNullOrEmpty(userId))
                    return Unauthorized();

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