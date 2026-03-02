using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebApp_API.Data;
using WebApp_API.DTOs;
using WebApp_API.Models;
using System.Globalization;

namespace WebApp_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "Admin")]
    public class AdminOrdersController : ControllerBase // API URL: /api/adminorders
    {
        private readonly AppDbContext _db;
        public AdminOrdersController(AppDbContext db) => _db = db;

        // GET: /api/adminorders - Get all orders with filters
        [HttpGet]
        public async Task<IActionResult> GetAllOrders([FromQuery] OrderDTOs.OrderFilterParameters filterParams)
        {
            try
            {
                IQueryable<Order> query = _db.Orders
                    .Include(o => o.User)
                    .Include(o => o.OrderItems);

                // Filter by status
                if (!string.IsNullOrWhiteSpace(filterParams.Status))
                    if (string.Equals(filterParams.Status, "all"))
                        query = query.Where(o => o.Status != null); // Include all orders regardless of status
                    else
                        query = query.Where(o => o.Status == filterParams.Status);

                // Filter by date range
                if (!string.IsNullOrWhiteSpace(filterParams.MinDate) && DateTime.TryParse(filterParams.MinDate, out var min))
                    query = query.Where(o => o.OrderDate >= min);

                if (!string.IsNullOrWhiteSpace(filterParams.MaxDate) && DateTime.TryParse(filterParams.MaxDate, out var max))
                {
                    // Include entire day
                    var maxWithTime = max.AddDays(1).AddSeconds(-1);
                    query = query.Where(o => o.OrderDate <= maxWithTime);
                }

                // Apply sorting
                query = filterParams.SortBy switch
                {
                    "customerName" => filterParams.SortOrder == "asc"
                        ? query.OrderBy(o => o.CustomerName)
                        : query.OrderByDescending(o => o.CustomerName),
                    "totalAmount" => filterParams.SortOrder == "asc"
                        ? query.OrderBy(o => o.TotalAmount)
                        : query.OrderByDescending(o => o.TotalAmount),
                    "orderDate" or _ => filterParams.SortOrder == "asc"
                        ? query.OrderBy(o => o.OrderDate)
                        : query.OrderByDescending(o => o.OrderDate)
                };

                var orders = await query.ToListAsync();

                // Map to response DTO
                var response = orders.Select(order => new OrderDTOs.OrderResponse
                {
                    Id = order.Id,
                    CustomerName = order.CustomerName,
                    CustomerEmail = order.CustomerEmail,
                    CustomerPhone = order.CustomerPhone,
                    ShippingAddress = order.ShippingAddress,
                    City = order.City,
                    TotalAmount = order.TotalAmount,
                    PaymentMethod = order.PaymentMethod,
                    Status = order.Status,
                    OrderDate = order.OrderDate,
                    Notes = order.Notes,
                    ItemCount = order.OrderItems.Count,
                    Items = order.OrderItems.Select(orderitem => new OrderDTOs.OrderItemResponse
                    {
                        ProductId = orderitem.ProductId,
                        ProductName = orderitem.ProductName,
                        Quantity = orderitem.Quantity,
                        UnitPrice = orderitem.UnitPrice,
                        TotalPrice = orderitem.TotalPrice
                    }).ToList()
                }).ToList();

                return Ok(response);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[ADMIN-ORDERS] Error in GetAllOrders: {ex.Message}");
                Console.WriteLine($"[ADMIN-ORDERS] Stack trace: {ex.StackTrace}");
                return StatusCode(500, new { message = "Error fetching orders", error = ex.Message });
            }
        }

        // GET: /api/adminorders/{id} - Get order detail
        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetOrderDetail(int id)
        {
            try
            {
                Console.WriteLine($"[ADMIN-ORDERS] GetOrderDetail called for order: {id}");

                var order = await _db.Orders
                    .Include(o => o.User)
                    .Include(o => o.OrderItems)
                    .FirstOrDefaultAsync(o => o.Id == id);

                if (order == null)
                {
                    Console.WriteLine($"[ADMIN-ORDERS] Order not found: {id}");
                    return NotFound(new { message = "Order not found" });
                }

                var response = new OrderDTOs.AdminOrderResponse
                {
                    Id = order.Id,
                    CustomerName = order.CustomerName,
                    CustomerEmail = order.CustomerEmail,
                    CustomerPhone = order.CustomerPhone,
                    ShippingAddress = order.ShippingAddress,
                    City = order.City,
                    TotalAmount = order.TotalAmount,
                    PaymentMethod = order.PaymentMethod,
                    Status = order.Status,
                    OrderDate = order.OrderDate,
                    Notes = order.Notes,
                    UserId = order.User?.Id,
                    UserName = order.User?.Username,
                    Items = order.OrderItems.Select(oi => new OrderDTOs.OrderItemResponse
                    {
                        ProductId = oi.ProductId,
                        ProductName = oi.ProductName,
                        Quantity = oi.Quantity,
                        UnitPrice = oi.UnitPrice,
                        TotalPrice = oi.TotalPrice
                    }).ToList()
                };

                return Ok(response);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[ADMIN-ORDERS] Error in GetOrderDetail: {ex.Message}");
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

                var order = await _db.Orders.FindAsync(id);
                if (order == null)
                    return NotFound(new { message = "Order not found" });

                // Validate status
                var validStatuses = new[] { "Pending", "Confirmed", "Processing", "Shipped", "Delivered", "Cancelled", "Refunded" };
                if (!validStatuses.Contains(request.Status))
                    return BadRequest(new { message = $"Invalid status. Must be one of: {string.Join(", ", validStatuses)}" });

                order.Status = request.Status;
                order.UpdatedAt = DateTime.UtcNow;

                _db.Orders.Update(order);
                await _db.SaveChangesAsync();

                return Ok(new
                {
                    message = "Order status updated successfully",
                    status = order.Status,
                    // order.UpdatedAt
                });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[ADMIN-ORDERS] Error in UpdateOrderStatus: {ex.Message}");
                return StatusCode(500, new { message = "Error updating order status", error = ex.Message });
            }
        }

        // PUT: /api/adminorders/{id} - Update entire order
        [HttpPut("{id:int}")]
        public async Task<IActionResult> UpdateOrder(int id, [FromBody] OrderDTOs.UpdateOrderRequest request)
        {
            try
            {
                Console.WriteLine($"[ADMIN-ORDERS] UpdateOrder called for order: {id}");

                var order = await _db.Orders.FindAsync(id);
                if (order == null)
                    return NotFound(new { message = "Order not found" });

                // Update fields
                if (!string.IsNullOrWhiteSpace(request.CustomerName))
                    order.CustomerName = request.CustomerName;

                if (!string.IsNullOrWhiteSpace(request.CustomerEmail))
                    order.CustomerEmail = request.CustomerEmail;

                if (!string.IsNullOrWhiteSpace(request.CustomerPhone))
                    order.CustomerPhone = request.CustomerPhone;

                if (!string.IsNullOrWhiteSpace(request.ShippingAddress))
                    order.ShippingAddress = request.ShippingAddress;

                if (!string.IsNullOrWhiteSpace(request.City))
                    order.City = request.City;

                if (!string.IsNullOrWhiteSpace(request.Status))
                    order.Status = request.Status;

                if (!string.IsNullOrWhiteSpace(request.Notes))
                    order.Notes = request.Notes;

                order.UpdatedAt = DateTime.UtcNow;

                _db.Orders.Update(order);
                await _db.SaveChangesAsync();

                Console.WriteLine($"[ADMIN-ORDERS] Order {id} updated successfully");

                return Ok(new { message = "Order updated successfully", order.Id });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[ADMIN-ORDERS] Error in UpdateOrder: {ex.Message}");
                return StatusCode(500, new { message = "Error updating order", error = ex.Message });
            }
        }

        // DELETE: /api/adminorders/{id} - Delete order
        [HttpDelete("{id:int}")]
        public async Task<IActionResult> DeleteOrder(int id)
        {
            try
            {
                Console.WriteLine($"[ADMIN-ORDERS] DeleteOrder called for order: {id}");

                var order = await _db.Orders.Include(o => o.OrderItems).FirstOrDefaultAsync(o => o.Id == id);
                if (order == null)
                    return NotFound(new { message = "Order not found" });

                // Delete order items first (cascade will handle, but being explicit)
                _db.OrderItems.RemoveRange(order.OrderItems);
                _db.Orders.Remove(order);
                await _db.SaveChangesAsync();

                Console.WriteLine($"[ADMIN-ORDERS] Order {id} deleted successfully");

                return Ok(new { message = "Order deleted successfully" });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[ADMIN-ORDERS] Error in DeleteOrder: {ex.Message}");
                return StatusCode(500, new { message = "Error deleting order", error = ex.Message });
            }
        }

        // GET: /api/adminorders/export - Export orders as CSV
        [HttpGet("export")]
        public async Task<IActionResult> ExportOrders([FromQuery] string status = null)
        {
            try
            {
                Console.WriteLine("[ADMIN-ORDERS] ExportOrders called");

                IQueryable<Order> query = _db.Orders
                    .Include(o => o.OrderItems)
                    .OrderByDescending(o => o.OrderDate);

                if (!string.IsNullOrWhiteSpace(status))
                    query = query.Where(o => o.Status == status);

                var orders = await query.ToListAsync();
                Console.WriteLine($"[ADMIN-ORDERS] Exporting {orders.Count} orders");

                // Create CSV content
                var csv = new System.Text.StringBuilder();
                csv.AppendLine("Order ID,Order Number,Customer Name,Email,Phone,Address,City,Status,Total Amount (VND),Items Count,Payment Method,Order Date");

                foreach (var order in orders)
                {
                    var escapedAddress = order.ShippingAddress?.Replace("\"", "\"\"") ?? "";
                    var escapedCity = order.City?.Replace("\"", "\"\"") ?? "";
                    csv.AppendLine(
                        $"\"{order.Id}\",\"ORD-{order.Id}\",\"{order.CustomerName}\"," +
                        $"\"{order.CustomerEmail}\",\"{order.CustomerPhone}\"," +
                        $"\"{escapedAddress}\",\"{escapedCity}\",\"{order.Status}\"," +
                        $"\"{order.TotalAmount}\",\"{order.OrderItems.Count}\",\"{order.PaymentMethod}\"," +
                        $"\"{order.OrderDate:yyyy-MM-dd HH:mm:ss}\""
                    );
                }

                var bytes = System.Text.Encoding.UTF8.GetBytes(csv.ToString());
                return File(bytes, "text/csv", $"orders_{DateTime.Now:yyyy-MM-dd_HH-mm-ss}.csv");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[ADMIN-ORDERS] Error in ExportOrders: {ex.Message}");
                return StatusCode(500, new { message = "Error exporting orders", error = ex.Message });
            }
        }

        // GET: /api/adminorders/stats - Get summary statistics of all orders
        [HttpGet("stats")]
        public async Task<IActionResult> GetOrderStats()
        {
            try
            {
                var orders = await _db.Orders
                    .Include(o => o.OrderItems)
                    .ToListAsync();

                var stats = new OrderDTOs.OrderStatsResponse
                {
                    TotalOrders = orders.Count,                                                       // Total number of orders from the database
                    TotalRevenue = orders.Sum(or => or.TotalAmount),                                  // Total revenue from all orders
                    TotalItems = orders.Sum(or => or.OrderItems.Count),                               // Total number of items sold across all orders
                    AverageOrderValue = orders.Count > 0 ? orders.Average(or => or.TotalAmount) : 0,  // Average order value (AOV) = Total Revenue / Total Orders
                    ByStatus = orders.GroupBy(or => or.Status)                                        // Count number of orders in each status -> Return List of { status, count }
                        .Select(g => new OrderDTOs.OrderStatusCountDto
                        {
                            Status = g.Key,
                            Count = g.Count()
                        })
                        .ToList(),
                    ByPaymentMethod = orders.GroupBy(or => or.PaymentMethod)                          // Count number of orders in each payment method -> Return List of { method, count }
                        .Select(g => new OrderDTOs.OrderPaymentMethodCountDto
                        {
                            Method = g.Key,
                            Count = g.Count()
                        })
                        .ToList(),
                    Last30DaysRevenue = orders
                        .Where(or => or.OrderDate >= DateTime.UtcNow.AddDays(-30))
                        .Sum(o => o.TotalAmount),
                    Last30DaysOrders = orders
                        .Count(or => or.OrderDate >= DateTime.UtcNow.AddDays(-30))
                };

                return Ok(stats);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[ADMIN-ORDERS] Error in GetOrderStats: {ex.Message}");
                return StatusCode(500, new { message = "Error fetching statistics", error = ex.Message });
            }
        }

        // POST: /api/adminorders/{id}/send-email - Send confirmation email
        [HttpPost("{id:int}/send-email")]
        public async Task<IActionResult> SendConfirmationEmail(int id)
        {
            try
            {
                Console.WriteLine($"[ADMIN-ORDERS] SendConfirmationEmail called for order: {id}");

                var order = await _db.Orders.FindAsync(id);
                if (order == null)
                    return NotFound(new { message = "Order not found" });

                // TODO: Implement email sending logic using SMTP
                // For now, just log and return success
                Console.WriteLine($"[ADMIN-ORDERS] Email would be sent to: {order.CustomerEmail}");

                return Ok(new
                {
                    message = "Confirmation email sent successfully",
                    sentTo = order.CustomerEmail,
                    orderId = order.Id
                });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[ADMIN-ORDERS] Error in SendConfirmationEmail: {ex.Message}");
                return StatusCode(500, new { message = "Error sending email", error = ex.Message });
            }
        }
    }
}
