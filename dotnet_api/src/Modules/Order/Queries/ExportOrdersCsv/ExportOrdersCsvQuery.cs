using MediatR;
using WebApp_API.Specifications;

namespace WebApp_API.Features.Orders.Queries.ExportOrdersCsv;

public record ExportOrdersCsvQuery(OrderFiltersParameters Filters)
    : IRequest<byte[]>;