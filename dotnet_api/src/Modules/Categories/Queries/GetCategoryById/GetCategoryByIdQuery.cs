using MediatR;
using WebApp_API.Modules.Categories.DTOs;

namespace WebApp_API.Modules.Categories.Queries.GetCategoryById
{
    public record GetCategoryByIdQuery(int id)
    : IRequest<CategoryResponse>;
}