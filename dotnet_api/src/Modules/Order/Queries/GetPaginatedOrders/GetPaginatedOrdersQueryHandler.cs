using MediatR;
using WebApp_API.DTOs;
using WebApp_API.Repositories;
using static WebApp_API.Models.PaginationDTOs;

namespace WebApp_API.Features.Orders.Queries.GetPaginatedOrders
{
    public class GetPaginatedOrdersQueryHandler
        : IRequestHandler<
            GetPaginatedOrdersQuery,
            PaginatedResponse<OrderDTOs.OrderResponse>>
    {
        private readonly IOrderRepository _repo;

        public GetPaginatedOrdersQueryHandler(IOrderRepository repo)
        {
            _repo = repo;
        }

        public async Task<PaginatedResponse<OrderDTOs.OrderResponse>> Handle(
            GetPaginatedOrdersQuery request,
            CancellationToken cancellationToken)
        {
            var (orders, totalCount) =
                await _repo.GetPaginatedOrdersAsync(request.Filters);

            var data = orders.Select(order => new OrderDTOs.OrderResponse
            {
                Id = order.Id,
                CustomerName = order.CustomerName,
                CustomerEmail = order.CustomerEmail,
                CustomerPhone = order.CustomerPhone,
                ShippingAddress = order.ShippingAddress,
                City = order.City,
                TotalAmount = order.TotalAmount,
                PaymentMethod = order.PaymentMethod,
                Status = order.Status,
                OrderDate = order.OrderDate,
                Notes = order.Notes,
                ItemCount = order.OrderItems?.Count ?? 0,
                Items = order.OrderItems?.Select(orderItem => new OrderItemDTOs.OrderItemResponse
                {
                    ProductId = orderItem.ProductId,
                    ProductName = orderItem.ProductName,
                    Quantity = orderItem.Quantity,
                    UnitPrice = orderItem.UnitPrice,
                    TotalPrice = orderItem.TotalPrice
                }).ToList() ?? new()
            }).ToList();

            return new PaginatedResponse<OrderDTOs.OrderResponse>
            {
                Success = true,
                Data = data,
                Pagination = PaginationMeta.From(
                    request.Filters.Page,
                    request.Filters.PageSize,
                    totalCount)
            };
        }
    }
}