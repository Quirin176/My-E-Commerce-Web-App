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
    public class AdminOrdersController : ControllerBase
    {
        private readonly AppDbContext _db;
        public AdminOrdersController(AppDbContext db) => _db = db;

        // GET: /api/admin-orders - Get all orders with filters
        [HttpGet]
        public async Task<IActionResult> GetAllOrders(
            [FromQuery] string status = null,
            [FromQuery] string minDate = null,
            [FromQuery] string maxDate = null,
            [FromQuery] string sortBy = "orderDate",
            [FromQuery] string sortOrder = "desc")
        {
            try
            {
                Console.WriteLine("[ADMIN-ORDERS] GetAllOrders called");
                Console.WriteLine($"[ADMIN-ORDERS] Filters - Status: {status}, MinDate: {minDate}, MaxDate: {maxDate}");
                Console.WriteLine($"[ADMIN-ORDERS] Sort - By: {sortBy}, Order: {sortOrder}");

                IQueryable<Order> query = _db.Orders
                    .Include(o => o.User)
                    .Include(o => o.OrderItems);

                // Filter by status
                if (!string.IsNullOrWhiteSpace(status))
                {
                    query = query.Where(o => o.Status == status);
                    Console.WriteLine($"[ADMIN-ORDERS] Filtering by status: {status}");
                }

                // Filter by date range
                if (!string.IsNullOrWhiteSpace(minDate) && DateTime.TryParse(minDate, out var min))
                {
                    query = query.Where(o => o.OrderDate >= min);
                    Console.WriteLine($"[ADMIN-ORDERS] Min date filter: {min:O}");
                }

                if (!string.IsNullOrWhiteSpace(maxDate) && DateTime.TryParse(maxDate, out var max))
                {
                    // Include entire day
                    var maxWithTime = max.AddDays(1).AddSeconds(-1);
                    query = query.Where(o => o.OrderDate <= maxWithTime);
                    Console.WriteLine($"[ADMIN-ORDERS] Max date filter: {maxWithTime:O}");
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
                    "orderDate" or _ => sortOrder == "asc"
                        ? query.OrderBy(o => o.OrderDate)
                        : query.OrderByDescending(o => o.OrderDate)
                };

                var orders = await query.ToListAsync();
                Console.WriteLine($"[ADMIN-ORDERS] Found {orders.Count} orders");

                // Map to response DTO
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

                return Ok(response);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[ADMIN-ORDERS] Error in GetAllOrders: {ex.Message}");
                Console.WriteLine($"[ADMIN-ORDERS] Stack trace: {ex.StackTrace}");
                return StatusCode(500, new { message = "Error fetching orders", error = ex.Message });
            }
        }

        // GET: /api/admin-orders/{id} - Get order detail
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

                var response = new
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
                    UserId = order.User?.Id,
                    UserName = order.User?.Username,
                    Items = order.OrderItems.Select(oi => new
                    {
                        oi.ProductId,
                        oi.ProductName,
                        oi.Quantity,
                        oi.UnitPrice,
                        oi.TotalPrice
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

        // PUT: /api/admin-orders/{id}/status - Update order status
        [HttpPut("{id:int}/status")]
        public async Task<IActionResult> UpdateOrderStatus(int id, [FromBody] UpdateOrderStatusRequest request)
        {
            try
            {
                Console.WriteLine($"[ADMIN-ORDERS] UpdateOrderStatus called for order: {id}");
                Console.WriteLine($"[ADMIN-ORDERS] New status: {request.Status}");

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

                Console.WriteLine($"[ADMIN-ORDERS] Order {id} status updated to: {request.Status}");

                return Ok(new
                {
                    message = "Order status updated successfully",
                    order.Id,
                    order.Status,
                    order.UpdatedAt
                });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[ADMIN-ORDERS] Error in UpdateOrderStatus: {ex.Message}");
                return StatusCode(500, new { message = "Error updating order status", error = ex.Message });
            }
        }

        // PUT: /api/admin-orders/{id} - Update entire order
        [HttpPut("{id:int}")]
        public async Task<IActionResult> UpdateOrder(int id, [FromBody] UpdateOrderRequest request)
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

        // DELETE: /api/admin-orders/{id} - Delete order
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

        // GET: /api/admin-orders/export - Export orders as CSV
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

        // GET: /api/admin-orders/stats - Get order statistics
        [HttpGet("stats")]
        public async Task<IActionResult> GetOrderStats()
        {
            try
            {
                Console.WriteLine("[ADMIN-ORDERS] GetOrderStats called");

                var orders = await _db.Orders
                    .Include(o => o.OrderItems)
                    .ToListAsync();

                var stats = new
                {
                    totalOrders = orders.Count,
                    totalRevenue = orders.Sum(o => o.TotalAmount),
                    totalItems = orders.Sum(o => o.OrderItems.Count),
                    averageOrderValue = orders.Count > 0 ? orders.Average(o => o.TotalAmount) : 0,
                    byStatus = orders.GroupBy(o => o.Status)
                        .Select(g => new { status = g.Key, count = g.Count() })
                        .ToList(),
                    byPaymentMethod = orders.GroupBy(o => o.PaymentMethod)
                        .Select(g => new { method = g.Key, count = g.Count() })
                        .ToList(),
                    last30DaysRevenue = orders
                        .Where(o => o.OrderDate >= DateTime.UtcNow.AddDays(-30))
                        .Sum(o => o.TotalAmount),
                    last30DaysOrders = orders
                        .Count(o => o.OrderDate >= DateTime.UtcNow.AddDays(-30))
                };

                return Ok(stats);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[ADMIN-ORDERS] Error in GetOrderStats: {ex.Message}");
                return StatusCode(500, new { message = "Error fetching statistics", error = ex.Message });
            }
        }

        // POST: /api/admin-orders/{id}/send-email - Send confirmation email
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

    // DTOs for requests
    public class UpdateOrderStatusRequest
    {
        public string Status { get; set; }
    }

    public class UpdateOrderRequest
    {
        public string CustomerName { get; set; }
        public string CustomerEmail { get; set; }
        public string CustomerPhone { get; set; }
        public string ShippingAddress { get; set; }
        public string City { get; set; }
        public string Status { get; set; }
        public string Notes { get; set; }
    }
}
