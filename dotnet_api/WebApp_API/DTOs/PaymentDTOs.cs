namespace WebApp_API.DTOs
{
    public class PaymentDTOs
    {
        public class CreatePaymentIntentRequest
        {
            public decimal Amount { get; set; }
            public int OrderId { get; set; }
        }

        public class ConfirmPaymentRequest
        {
            public string PaymentIntentId { get; set; }
            public string PaymentMethodId { get; set; }
        }
    }
}
