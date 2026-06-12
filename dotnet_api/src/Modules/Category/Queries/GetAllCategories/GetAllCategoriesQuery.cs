using MediatR;
using WebApp_API.DTOs;

namespace WebApp_API.Features.Categories.Queries.GetAllCategories
{
    public record GetAllCategoriesQuery()
    : IRequest<List<CategoryDTOs.CategoryResponse>>;
}