using MediatR;
using WebApp_API.Modules.Categories.DTOs;

namespace WebApp_API.Modules.Categories.Commands.UpdateCategory
{
    public record UpdateCategoryCommand(
        int categoryId,
        UpdateCategoryRequest updateRequest) : IRequest<bool>;
}