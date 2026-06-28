using MediatR;
using QuestPDF.Fluent;
using QuestPDF.Helpers;
using QuestPDF.Infrastructure;
using WebApp_API.Modules.Orders.Repositories;

namespace WebApp_API.Modules.Orders.Queries.GenerateInvoicePdf;

public class GenerateInvoicePdfQueryHandler
    : IRequestHandler<GenerateInvoicePdfQuery, byte[]>
{
    private readonly IOrderRepository _repo;

    public GenerateInvoicePdfQueryHandler(IOrderRepository repo)
    {
        _repo = repo;
    }

    public async Task<byte[]> Handle(
        GenerateInvoicePdfQuery request,
        CancellationToken cancellationToken)
    {
        var order = await _repo.GetOrderWithItemsByIdAsync(request.OrderId);

        if (order == null)
            throw new Exception("Order not found");

        var document = Document.Create(container =>
        {
            container.Page(page =>
            {
                page.Size(PageSizes.A4);
                page.Margin(30);

                page.Header().Row(row =>
                {
                    row.RelativeItem().Column(col =>
                    {
                        col.Item().Text("MY E-COMMERCE STORE")
                            .FontSize(24)
                            .Bold();

                        col.Item().Text("sales@mystore.com")
                            .FontSize(10);

                        col.Item().Text("www.mystore.com")
                            .FontSize(10);
                    });

                    row.ConstantItem(180)
                        .Border(1)
                        .Padding(10)
                        .Column(col =>
                        {
                            col.Item().Text("INVOICE")
                                .FontSize(18)
                                .Bold();

                            col.Item().Text($"Invoice #: {order.Id}");
                            col.Item().Text($"Date: {order.OrderDate:dd/MM/yyyy}");
                        });
                });

                page.Content().PaddingVertical(20).Column(column =>
                {
                    column.Spacing(15);

                    // Customer Info Card
                    column.Item()
                        .Border(1)
                        .Padding(15)
                        .Column(col =>
                        {
                            col.Item().Text("Bill To")
                                .FontSize(14)
                                .Bold();

                            col.Item().Text(order.CustomerName);
                            col.Item().Text(order.CustomerEmail);
                            col.Item().Text(order.CustomerPhone);
                            col.Item().Text(order.ShippingAddress);
                        });

                    // Products Table
                    column.Item().Table(table =>
                    {
                        table.ColumnsDefinition(columns =>
                        {
                            columns.RelativeColumn(5);
                            columns.RelativeColumn(1);
                            columns.RelativeColumn(2);
                            columns.RelativeColumn(2);
                        });

                        static IContainer HeaderStyle(IContainer container)
                        {
                            return container
                                .Border(1)
                                .Padding(8);
                        }

                        table.Header(header =>
                        {
                            header.Cell().Element(HeaderStyle).Text("Product").Bold();
                            header.Cell().Element(HeaderStyle).AlignCenter().Text("Qty").Bold();
                            header.Cell().Element(HeaderStyle).AlignRight().Text("Price").Bold();
                            header.Cell().Element(HeaderStyle).AlignRight().Text("Total").Bold();
                        });

                        foreach (var item in order.OrderItems)
                        {
                            table.Cell().Border(1).Padding(6)
                                .Text(item.ProductName);

                            table.Cell().Border(1).Padding(6)
                                .AlignCenter()
                                .Text(item.Quantity.ToString());

                            table.Cell().Border(1).Padding(6)
                                .AlignRight()
                                .Text($"{item.UnitPrice:N0}");

                            table.Cell().Border(1).Padding(6)
                                .AlignRight()
                                .Text($"{item.TotalPrice:N0}");
                        }
                    });

                    // Summary
                    column.Item()
                        .AlignRight()
                        .Width(250)
                        .Border(1)
                        .Padding(10)
                        .Column(col =>
                        {
                            col.Item().Row(row =>
                            {
                                row.RelativeItem().Text("Subtotal");
                                row.ConstantItem(100)
                                    .AlignRight()
                                    .Text($"{order.TotalAmount:N0} VND");
                            });

                            col.Item().Row(row =>
                            {
                                row.RelativeItem().Text("Shipping");
                                row.ConstantItem(100)
                                    .AlignRight()
                                    .Text("Free");
                            });

                            col.Item().PaddingTop(5);

                            col.Item().Row(row =>
                            {
                                row.RelativeItem().Text("Grand Total")
                                    .Bold()
                                    .FontSize(14);

                                row.ConstantItem(100)
                                    .AlignRight()
                                    .Text($"{order.TotalAmount:N0} VND")
                                    .Bold()
                                    .FontSize(14);
                            });
                        });

                    // Notes
                    if (!string.IsNullOrWhiteSpace(order.Notes))
                    {
                        column.Item()
                            .Border(1)
                            .Padding(10)
                            .Column(col =>
                            {
                                col.Item().Text("Notes")
                                    .Bold();

                                col.Item().Text(order.Notes);
                            });
                    }
                });

                page.Footer()
                    .AlignCenter()
                    .Column(col =>
                    {
                        col.Item().Text("Thank you for your purchase!")
                            .Bold();

                        col.Item().Text(
                            $"Generated on {DateTime.Now:dd/MM/yyyy HH:mm}")
                            .FontSize(10);
                    });
            });
        });

        return document.GeneratePdf();
    }
}