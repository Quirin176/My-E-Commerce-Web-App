using MediatR;
using System.Text;
using WebApp_API.Modules.Orders.Repositories;

namespace WebApp_API.Modules.Orders.Queries.ExportOrdersCsv;

public class ExportOrdersCsvQueryHandler
    : IRequestHandler<ExportOrdersCsvQuery, byte[]>
{
    private readonly IOrderRepository _repo;

    public ExportOrdersCsvQueryHandler(IOrderRepository repo)
    {
        _repo = repo;
    }

    public async Task<byte[]> Handle(
        ExportOrdersCsvQuery request,
        CancellationToken cancellationToken)
    {
        var orders = await _repo.ExportOrdersCsvAsync(request.Filters);

        var csv = new StringBuilder();

        csv.AppendLine(
            "Order ID,Order Number,Customer Name,Email,Phone,Address,City," +
            "Status,Total Amount (VND),Items Count,Payment Method," +
            "Order Date,Products (Name x Quantity)");

        foreach (var order in orders)
        {
            var itemsCount = order.OrderItems?.Count ?? 0;

            var itemsSummary =
                order.OrderItems?.Count > 0
                ? string.Join(" | ",
                    order.OrderItems.Select(i =>
                        $"{i.ProductName} x{i.Quantity}"))
                : "";

            csv.AppendLine(
                $"\"{order.Id}\",\"ORDER-{order.Id}\"," +
                $"\"{order.CustomerName}\",\"{order.CustomerEmail}\"," +
                $"\"{order.CustomerPhone}\",\"{order.ShippingAddress}\"," +
                $"\"{order.City}\",\"{order.Status}\"," +
                $"\"{order.TotalAmount}\",\"{itemsCount}\"," +
                $"\"{order.PaymentMethod}\"," +
                $"\"{order.OrderDate:yyyy-MM-dd HH:mm:ss}\"," +
                $"\"{itemsSummary}\"");
        }

        return Encoding.UTF8.GetPreamble()
            .Concat(Encoding.UTF8.GetBytes(csv.ToString()))
            .ToArray();
    }
}