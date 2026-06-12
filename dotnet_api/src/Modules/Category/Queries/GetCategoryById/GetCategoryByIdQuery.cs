using MediatR;
using WebApp_API.DTOs;

namespace WebApp_API.Features.Categories.Queries.GetCategoryById
{
    public record GetCategoryByIdQuery(int id)
    : IRequest<CategoryDTOs.CategoryResponse>;
}