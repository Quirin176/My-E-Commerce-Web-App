using MediatR;

namespace WebApp_API.Features.Orders.Queries.GenerateInvoicePdf;

public record GenerateInvoicePdfQuery(int OrderId)
    : IRequest<byte[]>;