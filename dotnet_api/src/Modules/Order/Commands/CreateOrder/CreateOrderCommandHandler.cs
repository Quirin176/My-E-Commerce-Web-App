using MediatR;
using WebApp_API.Enums;
using WebApp_API.Entities;
using WebApp_API.DTOs;
using WebApp_API.Repositories;
using WebApp_API.Infrastructure.Email;

namespace WebApp_API.Features.Orders.Commands.CreateOrder
{
    public class CreateOrderCommandHandler
        : IRequestHandler<CreateOrderCommand, OrderDTOs.OrderResponse>
    {
        private readonly IOrderRepository _repo;
        private readonly IEmailService _emailService;

        public CreateOrderCommandHandler(IOrderRepository repo, IEmailService emailService)
        {
            _repo = repo;
            _emailService = emailService;
        }

        public async Task<OrderDTOs.OrderResponse> Handle(
            CreateOrderCommand request,
            CancellationToken cancellationToken)
        {
            var order = new Order
            {
                UserId = request.UserId,
                CustomerName = request.Order.CustomerName,
                CustomerEmail = request.Order.CustomerEmail,
                CustomerPhone = request.Order.CustomerPhone,
                ShippingAddress = request.Order.ShippingAddress,
                City = request.Order.City,
                TotalAmount = request.Order.TotalAmount,
                PaymentMethod = request.Order.PaymentMethod,
                Status = OrderStatus.Pending,
                Notes = request.Order.Notes,
                CreatedAt = DateTime.UtcNow,
                OrderDate = DateTime.UtcNow
            };

            var items = request.Order.OrderItems
                .Select(i => new OrderItem
                {
                    ProductId = i.ProductId,
                    ProductName = i.ProductName,
                    Quantity = i.Quantity,
                    UnitPrice = i.UnitPrice,
                    TotalPrice = i.TotalPrice
                })
                .ToList();

            var created = await _repo.CreateOrderAsync(order, items);

            var itemRows = string.Join("", items.Select(i => $@"
<tr>
    <td>{i.ProductName}</td>
    <td>{i.Quantity}</td>
    <td>{i.UnitPrice:N0}</td>
    <td>{i.TotalPrice:N0}</td>
</tr>"));

            var html = $@"
<h2>Order Received Successfully</h2>

<p>Dear {order.CustomerName},</p>

<p>
Thank you for your order.
Your order has been received and is currently awaiting verification.
</p>

<p>
Our staff will contact you shortly via phone
(<strong>{order.CustomerPhone}</strong>)
to verify the order details before processing and shipping.
</p>

<h3>Order Information</h3>

<p>
Order Date: {order.OrderDate:dd/MM/yyyy HH:mm}<br/>
Payment Method: {order.PaymentMethod}<br/>
Shipping Address: {order.ShippingAddress}, {order.City}
</p>

<h3>Items Ordered</h3>

<table border='1' cellpadding='8' cellspacing='0'>
    <thead>
        <tr>
            <th>Product</th>
            <th>Quantity</th>
            <th>Unit Price</th>
            <th>Total</th>
        </tr>
    </thead>
    <tbody>
        {itemRows}
    </tbody>
</table>

<h3>Total Amount: {order.TotalAmount:N0} VND</h3>

<p>
Please wait for our confirmation call.
Your order status is currently:
<strong>Pending Verification</strong>.
</p>

<p>
If you need to update or cancel your order,
please contact our customer service team as soon as possible.
</p>

<p>
Thank you for shopping with us.
</p>";

            await _emailService.SendEmailAsync(
                order.CustomerEmail,
                "Order Confirmation",
                html);

            return new OrderDTOs.OrderResponse
            {
                Id = created.Id,
                CustomerName = created.CustomerName,
                CustomerEmail = created.CustomerEmail,
                CustomerPhone = created.CustomerPhone,
                ShippingAddress = created.ShippingAddress,
                City = created.City,
                TotalAmount = created.TotalAmount,
                PaymentMethod = created.PaymentMethod,
                Status = created.Status,
                OrderDate = created.OrderDate,
                Notes = created.Notes
            };
        }
    }
}