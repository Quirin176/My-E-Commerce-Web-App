using MediatR;
using WebApp_API.Modules.Categories.DTOs;

namespace WebApp_API.Modules.Categories.Queries.GetCategoryBySlug
{
    public record GetCategoryBySlugQuery(string slug)
    : IRequest<CategoryResponse>;
}