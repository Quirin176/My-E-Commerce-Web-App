using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WebApp_API.Data;
using WebApp_API.DTOs;

namespace WebApp_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PaymentsController : ControllerBase
    {
        private readonly AppDbContext _db;
        public PaymentsController(AppDbContext db) => _db = db;

        // For now, this is a demo implementation
        // In production, integrate with Stripe, PayPal, etc.

        [HttpPost("create-intent")]
        [Authorize(Roles = "Customer")]
        public async Task<IActionResult> CreatePaymentIntent([FromBody] PaymentDTOs.CreatePaymentIntentRequest request)
        {
            try
            {
                if (request.Amount <= 0)
                    return BadRequest(new { message = "Invalid amount" });

                // In production, create Stripe PaymentIntent here
                // For now, return demo response
                var clientSecret = GenerateDemoSecret();

                return Ok(new
                {
                    clientSecret = clientSecret,
                    amount = request.Amount,
                    orderId = request.OrderId,
                    status = "requires_payment_method"
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error creating payment intent", error = ex.Message });
            }
        }

        [HttpPost("confirm")]
        [Authorize(Roles = "Customer")]
        public async Task<IActionResult> ConfirmPayment([FromBody] PaymentDTOs.ConfirmPaymentRequest request)
        {
            try
            {
                // In production, confirm Stripe payment here
                // For demo, just return success

                return Ok(new
                {
                    success = true,
                    message = "Payment confirmed successfully",
                    paymentIntentId = request.PaymentIntentId
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error confirming payment", error = ex.Message });
            }
        }

        private string GenerateDemoSecret()
        {
            return "pi_" + Guid.NewGuid().ToString().Replace("-", "").Substring(0, 24);
        }
    }
}
