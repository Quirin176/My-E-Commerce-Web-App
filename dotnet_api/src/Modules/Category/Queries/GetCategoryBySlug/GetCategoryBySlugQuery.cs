using MediatR;
using WebApp_API.DTOs;

namespace WebApp_API.Features.Categories.Queries.GetCategoryBySlug
{
    public record GetCategoryBySlugQuery(string slug)
    : IRequest<CategoryDTOs.CategoryResponse>;
}