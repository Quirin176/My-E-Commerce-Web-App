using MediatR;
using WebApp_API.DTOs;

namespace WebApp_API.Features.Categories.Commands.UpdateCategory
{
    public record UpdateCategoryCommand(CategoryDTOs.UpdateCategoryRequest updateRequest) : IRequest<bool>;
}