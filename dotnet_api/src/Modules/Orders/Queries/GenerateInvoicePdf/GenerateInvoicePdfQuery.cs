using MediatR;

namespace WebApp_API.Modules.Orders.Queries.GenerateInvoicePdf;

public record GenerateInvoicePdfQuery(int OrderId)
    : IRequest<byte[]>;