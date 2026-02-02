using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebApp_API.Data;
using WebApp_API.DTOs;
using WebApp_API.Models;

namespace WebApp_API.Controllers
{
    // Route: api/orders
    [Route("api/[controller]")]
    [ApiController]
    public class OrdersController : ControllerBase
    {
        private readonly AppDbContext _db;
        public OrdersController(AppDbContext db) => _db = db;

        // ==================== CUSTOMER METHODS ====================
        // POST api/orders - Create new order
        [HttpPost]
        [Authorize(Roles = "Customer")]
        public async Task<IActionResult> CreateOrder([FromBody] OrderDTOs.CreateOrderRequest request)
        {
            try
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

                var order = new Order
                {
                    UserId = int.Parse(userId),
                    CustomerName = request.CustomerName,
                    CustomerEmail = request.CustomerEmail,
                    CustomerPhone = request.CustomerPhone,
                    ShippingAddress = request.ShippingAddress,
                    City = request.City,
                    TotalAmount = request.TotalAmount,
                    PaymentMethod = request.PaymentMethod,
                    Status = request.Status ?? "Pending",
                    Notes = request.Notes,
                    CreatedAt = DateTime.UtcNow,
                    OrderDate = DateTime.UtcNow
                };

                _db.Orders.Add(order);
                await _db.SaveChangesAsync();

                foreach (var item in request.OrderItems)
                {
                    var orderItem = new OrderItem
                    {
                        OrderId = order.Id,
                        ProductId = item.ProductId,
                        ProductName = item.ProductName,
                        Quantity = item.Quantity,
                        UnitPrice = item.UnitPrice,
                        TotalPrice = item.TotalPrice
                    };
                    _db.OrderItems.Add(orderItem);
                }

                await _db.SaveChangesAsync();

                Console.WriteLine($"[ORDER] Order created: {order.Id} for user {userId}");

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
                Console.WriteLine($"[ORDER] Error creating order: {ex.Message}");
                return StatusCode(500, new { message = "Error creating order", error = ex.Message });
            }
        }

        // GET api/orders/{id} - Get order by ID with full details including items
        [HttpGet("{id}")]
        [Authorize]
        public async Task<IActionResult> GetOrder(int id)
        {
            try
            {
                var order = await _db.Orders
                    .Include(o => o.OrderItems)
                    .FirstOrDefaultAsync(o => o.Id == id);

                if (order == null)
                    return NotFound(new { message = "Order not found" });

                // Check if user is authorized to view this order
                var userId = User.FindFirst("id")?.Value;
                var userRole = User.FindFirst("role")?.Value;

                if (userRole != "Admin" && order.UserId != int.Parse(userId))
                    return Forbid();

                return Ok(new
                {
                    order.Id,
                    order.CustomerName,
                    order.CustomerEmail,
                    order.CustomerPhone,
                    order.ShippingAddress,
                    order.City,
                    order.TotalAmount,
                    order.PaymentMethod,
                    order.Status,
                    order.OrderDate,
                    order.Notes,
                    Items = order.OrderItems.Select(oi => new
                    {
                        oi.ProductId,
                        oi.ProductName,
                        oi.Quantity,
                        oi.UnitPrice,
                        oi.TotalPrice
                    }).ToList()
                });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[ORDER] Error fetching order: {ex.Message}");
                return StatusCode(500, new { message = "Error fetching order", error = ex.Message });
            }
        }

        // GET api/orders/user/my-orders - Get user's orders with summary information
        [HttpGet("user/my-orders")]
        [Authorize(Roles = "Customer")]
        public async Task<IActionResult> GetUserOrders()
        {
            try
            {
                var userId = User.FindFirst("id")?.Value;
                if (string.IsNullOrEmpty(userId))
                    return Unauthorized();

                var orders = await _db.Orders
                    .Where(o => o.UserId == int.Parse(userId))
                    .Include(o => o.OrderItems)
                    .OrderByDescending(o => o.OrderDate)
                    .ToListAsync();

                // Return with full item details
                var response = orders.Select(o => new
                {
                    o.Id,
                    o.CustomerName,
                    o.CustomerEmail,
                    o.CustomerPhone,
                    o.ShippingAddress,
                    o.City,
                    o.TotalAmount,
                    o.Status,
                    o.PaymentMethod,
                    o.OrderDate,
                    o.Notes,
                    ItemCount = o.OrderItems.Count,
                    Items = o.OrderItems.Select(oi => new
                    {
                        oi.ProductId,
                        oi.ProductName,
                        oi.Quantity,
                        oi.UnitPrice,
                        oi.TotalPrice
                    }).ToList()
                }).ToList();

                return Ok(response);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[ORDER] Error fetching user orders: {ex.Message}");
                return StatusCode(500, new { message = "Error fetching orders", error = ex.Message });
            }
        }

        // ==================== ADMIN METHODS ====================
        // PUT api/orders/{id}/status - Update order status (Admin only)
        [HttpPut("{id}/status")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UpdateOrderStatus(int id, [FromBody] OrderDTOs.UpdateOrderStatusRequest request)
        {
            try
            {
                var order = await _db.Orders.FindAsync(id);
                if (order == null)
                    return NotFound();

                Console.WriteLine($"[ORDER] Updating order {id} status from {order.Status} to {request.Status}");

                order.Status = request.Status;
                order.UpdatedAt = DateTime.UtcNow;

                _db.Orders.Update(order);
                await _db.SaveChangesAsync();

                Console.WriteLine($"[ORDER] Order {id} status updated successfully");

                return Ok(new { message = "Order status updated", status = order.Status });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[ORDER] Error updating order status: {ex.Message}");
                return StatusCode(500, new { message = "Error updating order", error = ex.Message });
            }
        }

        // GET api/orders/admin/all-orders - Get all orders (Admin only)
        [HttpGet("admin/all-orders")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetAllOrders(
            [FromQuery] string status = null,
            [FromQuery] string minDate = null,
            [FromQuery] string maxDate = null,
            [FromQuery] string sortBy = "orderDate",
            [FromQuery] string sortOrder = "desc")
        {
            try
            {
                Console.WriteLine("[ORDER] GetAllOrders called with filters");
                Console.WriteLine($"[ORDER] Status: {status}, MinDate: {minDate}, MaxDate: {maxDate}");

                IQueryable<Order> query = _db.Orders
                    .Include(o => o.OrderItems)
                    .AsQueryable();

                // Filter by status
                if (!string.IsNullOrWhiteSpace(status))
                    query = query.Where(o => o.Status == status);

                // Filter by date range
                if (!string.IsNullOrWhiteSpace(minDate) && DateTime.TryParse(minDate, out var min))
                    query = query.Where(o => o.OrderDate >= min);

                if (!string.IsNullOrWhiteSpace(maxDate) && DateTime.TryParse(maxDate, out var max))
                {
                    var maxWithTime = max.AddDays(1).AddSeconds(-1);
                    query = query.Where(o => o.OrderDate <= maxWithTime);
                }

                // Apply sorting
                query = sortBy switch
                {
                    "customerName" => sortOrder == "asc"
                        ? query.OrderBy(o => o.CustomerName)
                        : query.OrderByDescending(o => o.CustomerName),
                    "totalAmount" => sortOrder == "asc"
                        ? query.OrderBy(o => o.TotalAmount)
                        : query.OrderByDescending(o => o.TotalAmount),
                    "status" => sortOrder == "asc"
                        ? query.OrderBy(o => o.Status)
                        : query.OrderByDescending(o => o.Status),
                    _ => sortOrder == "asc"
                        ? query.OrderBy(o => o.OrderDate)
                        : query.OrderByDescending(o => o.OrderDate)
                };

                var orders = await query.ToListAsync();

                var response = orders.Select(o => new
                {
                    o.Id,
                    o.CustomerName,
                    o.CustomerEmail,
                    o.CustomerPhone,
                    o.ShippingAddress,
                    o.City,
                    o.TotalAmount,
                    o.PaymentMethod,
                    o.Status,
                    o.OrderDate,
                    o.Notes,
                    ItemCount = o.OrderItems.Count,
                    Items = o.OrderItems.Select(oi => new
                    {
                        oi.ProductId,
                        oi.ProductName,
                        oi.Quantity,
                        oi.UnitPrice,
                        oi.TotalPrice
                    }).ToList()
                }).ToList();

                Console.WriteLine($"[ORDER] Returning {orders.Count} orders");
                return Ok(response);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[ORDER] Error: {ex.Message}");
                return StatusCode(500, new { message = "Error fetching orders", error = ex.Message });
            }
        }
    }
}
