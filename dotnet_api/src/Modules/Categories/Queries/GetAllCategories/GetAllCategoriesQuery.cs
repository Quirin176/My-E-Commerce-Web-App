using MediatR;
using WebApp_API.Modules.Categories.DTOs;

namespace WebApp_API.Modules.Categories.Queries.GetAllCategories
{
    public record GetAllCategoriesQuery()
    : IRequest<List<CategoryResponse>>;
}