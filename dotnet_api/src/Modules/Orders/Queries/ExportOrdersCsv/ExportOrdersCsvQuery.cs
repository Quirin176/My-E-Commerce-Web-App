using MediatR;
using WebApp_API.Modules.Orders.Specifications;

namespace WebApp_API.Modules.Orders.Queries.ExportOrdersCsv;

public record ExportOrdersCsvQuery(OrderFiltersParameters Filters)
    : IRequest<byte[]>;